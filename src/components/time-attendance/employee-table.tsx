import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EmployeeAlertIcon } from "@/components/icons/employee-alert-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverTooltip, TruncatedButton, TruncatedInline } from "@/components/ui/truncated-text";
import { EmployeeApprovalPill } from "@/components/time-attendance/employee-approval-pill";
import { EmployeeActionsMenu } from "@/components/time-attendance/employee-actions-menu";
import {
  DeductionList,
  MoneyValue,
  TableCellCenter,
} from "@/components/time-attendance/employee-table-cells";
import { EmployeeSearchEmptyState } from "@/components/time-attendance/employee-search-empty-state";
import { TeamSectionHeader } from "@/components/time-attendance/team-section";
import { groupEmployeesByTeam } from "@/lib/group-employees-by-team";
import {
  employees,
  type ApprovalStatus,
  type EmployeeRow,
  type EmploymentStatus,
} from "@/data/employees";
import { filterEmployees } from "@/lib/filter-employees";
import { getInspectorEntryForRow, inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

function StatusIndicator({ employee }: { employee: EmployeeRow }) {
  return (
    <span
      className={cn(
        "inline-block size-[6px] shrink-0 rounded-full",
        employee.status === "in" ? "bg-success-dark" : "bg-warning-dark",
      )}
    />
  );
}

function EmployeeCell({ employee }: { employee: EmployeeRow }) {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <StatusIndicator employee={employee} />
        <TruncatedButton className="w-full cursor-pointer text-left text-sm leading-5 font-semibold text-brand hover:underline">
          {employee.name}
        </TruncatedButton>
      </div>
      <TruncatedInline
        className="pl-4 text-xs leading-4"
        tooltip={`${employee.role} ${employee.level}`}
      >
        <span className="text-ink">{employee.role}</span>{" "}
        <span className="text-muted">{employee.level}</span>
      </TruncatedInline>
    </div>
  );
}

type SortKey =
  | "firstName"
  | "lastName"
  | "alertCount"
  | "shift"
  | "reg"
  | "pm"
  | "ot"
  | "pto"
  | "total"
  | "additions"
  | "payrollDeductions"
  | "companyDeductions"
  | "loans"
  | "approvalStatus";

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

type HourColumnKey = "shift" | "reg" | "pm" | "ot" | "pto";

const hourColumns: { key: HourColumnKey; label: string }[] = [
  { key: "shift", label: "Shift" },
  { key: "reg", label: "Reg" },
  { key: "pm", label: "PM" },
  { key: "ot", label: "OT" },
  { key: "pto", label: "PTO" },
];

function getNameParts(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    first: parts[0] ?? "",
    last: parts[parts.length - 1] ?? "",
  };
}

function parseMoney(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value.replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function getEmployeeAlertCount(
  employee: EmployeeRow,
  resolvedAlertIds: Set<string>,
) {
  if (resolvedAlertIds.has(employee.id)) {
    return 0;
  }

  return employee.alertCount ?? 0;
}

function getSortValue(
  employee: EmployeeRow,
  key: SortKey,
  approvalById: Record<string, ApprovalStatus>,
  resolvedAlertIds: Set<string>,
): string | number | null {
  switch (key) {
    case "firstName":
      return getNameParts(employee.name).first;
    case "lastName":
      return getNameParts(employee.name).last;
    case "alertCount":
      return getEmployeeAlertCount(employee, resolvedAlertIds);
    case "approvalStatus":
      return approvalById[employee.id] ?? "pending";
    case "shift":
    case "reg":
    case "pm":
    case "ot":
    case "pto":
      return parseMoney(employee[key]?.value);
    case "total":
      return parseMoney(employee.total);
    case "additions":
    case "payrollDeductions":
    case "companyDeductions":
    case "loans": {
      const items = employee[key];
      if (!items?.length) {
        return 0;
      }

      return items.reduce(
        (sum, item) => sum + (parseMoney(item.value) ?? 0),
        0,
      );
    }
  }
}

function compareEmployees(
  a: EmployeeRow,
  b: EmployeeRow,
  sort: SortState,
  approvalById: Record<string, ApprovalStatus>,
  resolvedAlertIds: Set<string>,
): number {
  const valueA = getSortValue(a, sort.key, approvalById, resolvedAlertIds);
  const valueB = getSortValue(b, sort.key, approvalById, resolvedAlertIds);
  const direction = sort.direction === "asc" ? 1 : -1;

  if (typeof valueA === "string" && typeof valueB === "string") {
    return valueA.localeCompare(valueB) * direction;
  }

  const numberA = valueA as number | null;
  const numberB = valueB as number | null;

  if (numberA === null && numberB === null) {
    return 0;
  }
  if (numberA === null) {
    return 1;
  }
  if (numberB === null) {
    return -1;
  }

  return (numberA - numberB) * direction;
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  ariaLabel,
}: {
  label: ReactNode;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  ariaLabel?: string;
}) {
  const isActive = sort.key === sortKey;
  const direction = isActive ? sort.direction : null;

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? `Sort by ${typeof label === "string" ? label : sortKey}`}
      aria-sort={
        isActive
          ? direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      onClick={() => onSort(sortKey)}
      className={cn(
        "group relative inline-block cursor-pointer rounded-sm uppercase hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        isActive ? "text-ink" : "text-subtle",
      )}
    >
      {label}
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 left-full ml-0.5 flex -translate-y-1/2 items-center justify-center",
          !isActive &&
            "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        {isActive && direction === "desc" ? (
          <MaterialIcon
            name="arrow_drop_down"
            className="text-ink"
            size={16}
          />
        ) : (
          <MaterialIcon
            name="arrow_drop_up"
            className={isActive ? "text-ink" : "text-label"}
            size={16}
          />
        )}
      </span>
    </button>
  );
}

function StatusColumnLayout({
  children,
  trailing,
  gap = "gap-1",
}: {
  children: ReactNode;
  trailing: ReactNode;
  gap?: "gap-1" | "gap-3";
}) {
  return (
    <div className={cn("flex items-center", gap)}>
      <div className="flex min-w-0 flex-1 justify-center">{children}</div>
      <div className="size-8 shrink-0">{trailing}</div>
    </div>
  );
}

const thCell = "h-14 align-middle px-3";
const tdCell =
  "h-[52px] overflow-visible border-t border-border align-middle px-3";
const tdNameCell =
  "h-[52px] overflow-visible border-t border-border align-middle px-3";

function rowCellBg(isSelected: boolean, side: "left" | "right") {
  if (isSelected) {
    return side === "left"
      ? "bg-row-selected-left group-hover:bg-row-selected-left"
      : "bg-row-selected-right group-hover:bg-row-selected-right";
  }

  if (side === "left") {
    return "bg-page group-hover:bg-row-hover-left";
  }

  return "bg-white group-hover:bg-row-hover-right";
}

const adjustmentColumns = [
  { key: "additions" as const, label: "Additions", tone: "success" as const },
  {
    key: "payrollDeductions" as const,
    label: "Payroll Deductions",
    tone: "danger" as const,
  },
  {
    key: "companyDeductions" as const,
    label: "Company Deductions",
    tone: "danger" as const,
  },
  { key: "loans" as const, label: "Loans", tone: "danger" as const },
];

const CHECKBOX_COL_PX = 40;
const ALERTS_COL_PX = 48;
const ACTIONS_COL_PX = 132;
const NAME_FLEX_WEIGHT = 0.28;
const NAME_COLUMN_UNITS_OFF = 3;
const HOUR_FLEX_WEIGHT = 0.1;
const TOTAL_FLEX_WEIGHT = 0.15;
const DEFAULT_LEFT_RATIO = 0.58;
const MIN_LEFT_RATIO = 0.3;
const MAX_LEFT_RATIO = 0.75;
function getEffectiveLeftRatio(
  tableWidth: number,
  prepMode: boolean,
  leftRatio: number,
) {
  if (prepMode) {
    return leftRatio;
  }

  return tableWidth > 0 ? (tableWidth - ACTIONS_COL_PX) / tableWidth : 1;
}

function getColumnWidths(
  tableWidth: number,
  prepMode: boolean,
  leftRatio: number,
) {
  const effectiveLeftRatio = getEffectiveLeftRatio(
    tableWidth,
    prepMode,
    leftRatio,
  );
  const leftSectionPx = tableWidth * effectiveLeftRatio;
  const rightSectionPx = Math.max(0, tableWidth - leftSectionPx);
  const leftFlexPx = Math.max(0, leftSectionPx - CHECKBOX_COL_PX - ALERTS_COL_PX);
  const rightFlexPx = Math.max(0, rightSectionPx - ACTIONS_COL_PX);

  if (!prepMode) {
    const hourTotalColumnCount = hourColumns.length + 1;
    const totalUnits = NAME_COLUMN_UNITS_OFF + hourTotalColumnCount;
    const unitWidth = totalUnits > 0 ? leftFlexPx / totalUnits : 0;

    return {
      checkbox: `${CHECKBOX_COL_PX}px`,
      name: `${unitWidth * NAME_COLUMN_UNITS_OFF}px`,
      alerts: `${ALERTS_COL_PX}px`,
      hour: `${unitWidth}px`,
      total: `${unitWidth}px`,
      adjustment: "0px",
      actions: `${ACTIONS_COL_PX}px`,
    };
  }

  const flexWeight =
    NAME_FLEX_WEIGHT +
    HOUR_FLEX_WEIGHT * hourColumns.length +
    TOTAL_FLEX_WEIGHT;

  return {
    checkbox: `${CHECKBOX_COL_PX}px`,
    name: `${leftFlexPx * (NAME_FLEX_WEIGHT / flexWeight)}px`,
    alerts: `${ALERTS_COL_PX}px`,
    hour: `${leftFlexPx * (HOUR_FLEX_WEIGHT / flexWeight)}px`,
    total: `${leftFlexPx * (TOTAL_FLEX_WEIGHT / flexWeight)}px`,
    adjustment: `${rightFlexPx / adjustmentColumns.length}px`,
    actions: `${ACTIONS_COL_PX}px`,
  };
}

function adjustmentCellClass(prepMode: boolean) {
  return cn(
    tdCell,
    "text-center",
    prepMode ? "overflow-visible opacity-100" : "overflow-hidden border-0 p-0 opacity-0",
  );
}

function adjustmentHeaderClass(prepMode: boolean) {
  return cn(
    thCell,
    "overflow-hidden bg-white text-center",
    prepMode ? "opacity-100" : "border-0 p-0 opacity-0",
  );
}

function getLeftSectionColumnCount(prepMode: boolean) {
  return LEFT_SECTION_COLUMN_COUNT + (prepMode ? 0 : 1);
}

const LEFT_SECTION_COLUMN_COUNT = 3 + hourColumns.length + 1;
const RIGHT_SECTION_COLUMN_COUNT = adjustmentColumns.length + 1;

type EmployeeTableProps = {
  employmentStatusFilter: EmploymentStatus[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (selectedIds: Set<string>) => void;
  prepMode: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  approvalById: Record<string, ApprovalStatus>;
  onResolveAlert: (employeeId: string) => void;
  onSetEmployeeApproval: (
    employeeId: string,
    status: ApprovalStatus,
  ) => void;
  resolvedAlertIds: Set<string>;
  viewMode: "name" | "team";
};

export function EmployeeTable({
  employmentStatusFilter,
  selectedIds,
  onSelectedIdsChange,
  prepMode,
  searchQuery,
  onSearchQueryChange,
  approvalById,
  onResolveAlert,
  onSetEmployeeApproval,
  resolvedAlertIds,
  viewMode,
}: EmployeeTableProps) {
  const [sort, setSort] = useState<SortState>({
    key: "firstName",
    direction: "asc",
  });
  const [leftRatio, setLeftRatio] = useState(DEFAULT_LEFT_RATIO);
  const [isResizing, setIsResizing] = useState(false);
  const [tableWidth, setTableWidth] = useState(0);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const rowNumberByEmployeeId = useMemo(() => {
    const byFirstName = [...employees].sort((a, b) =>
      compareEmployees(
        a,
        b,
        { key: "firstName", direction: "asc" },
        approvalById,
        resolvedAlertIds,
      ),
    );

    return new Map(byFirstName.map((employee, index) => [employee.id, index + 1]));
  }, [approvalById, resolvedAlertIds]);

  const sortedEmployees = useMemo(() => {
    const filtered = filterEmployees(
      employees,
      employmentStatusFilter,
      searchQuery,
    );

    return [...filtered].sort((a, b) =>
      compareEmployees(a, b, sort, approvalById, resolvedAlertIds),
    );
  }, [approvalById, employmentStatusFilter, resolvedAlertIds, searchQuery, sort]);
  const teamGroups = useMemo(
    () => groupEmployeesByTeam(sortedEmployees),
    [sortedEmployees],
  );
  const lastRowIndex = sortedEmployees.length - 1;
  const visibleIds = sortedEmployees.map((employee) => employee.id);
  const allSelected =
    visibleIds.length > 0 &&
    visibleIds.every((employeeId) => selectedIds.has(employeeId));
  const someSelected =
    visibleIds.some((employeeId) => selectedIds.has(employeeId)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onSelectedIdsChange(new Set());
      return;
    }

    onSelectedIdsChange(new Set(visibleIds));
  };

  const toggleRow = (employeeId: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(employeeId);
    } else {
      next.delete(employeeId);
    }
    onSelectedIdsChange(next);
  };

  const toggleTeam = (employeeIds: string[]) => {
    const next = new Set(selectedIds);
    const allTeamSelected =
      employeeIds.length > 0 &&
      employeeIds.every((employeeId) => selectedIds.has(employeeId));

    if (allTeamSelected) {
      employeeIds.forEach((employeeId) => next.delete(employeeId));
    } else {
      employeeIds.forEach((employeeId) => next.add(employeeId));
    }

    onSelectedIdsChange(next);
  };

  const renderEmployeeRow = (
    employee: EmployeeRow,
    { isLastRow = false }: { isLastRow?: boolean } = {},
  ) => {
    const isSelected = selectedIds.has(employee.id);

    return (
      <tr
        key={employee.id}
        className="group relative hover:z-20 focus-within:z-20"
        {...inspectorProps(
          getInspectorEntryForRow(rowNumberByEmployeeId.get(employee.id) ?? 0),
        )}
      >
        <td
          className={cn(
            tdCell,
            "flex w-10 max-w-10 items-center pl-3 pr-0",
            rowCellBg(isSelected, "left"),
            isLastRow && "rounded-bl-[8px]",
          )}
        >
          <span {...inspectorProps(inspectorRegistry["TBL-CHK"])}>
            <Checkbox
              aria-label={`Select ${employee.name}`}
              checked={isSelected}
              onCheckedChange={(checked) =>
                toggleRow(employee.id, checked === true)
              }
            />
          </span>
        </td>
        <td
          className={cn(
            tdNameCell,
            "pl-1 pr-2",
            rowCellBg(isSelected, "left"),
          )}
        >
          <EmployeeCell employee={employee} />
        </td>
        <td
          className={cn(
            "w-12 max-w-12 px-3",
            tdCell,
            "text-center",
            rowCellBg(isSelected, "left"),
          )}
          {...inspectorProps(inspectorRegistry["TBL-ALR"])}
        >
          {getEmployeeAlertCount(employee, resolvedAlertIds) > 0 ? (
            <HoverTooltip label="On-going shift">
              <button
                {...inspectorProps(inspectorRegistry["TBL-TIP-ALR"])}
                type="button"
                aria-label={`Resolve alert for ${employee.name}`}
                className="inline-flex cursor-pointer flex-col items-center"
                onClick={() => onResolveAlert(employee.id)}
              >
                <span className="text-xs font-semibold text-danger-text">
                  {employee.alertCount}
                </span>
                <EmployeeAlertIcon className="text-danger-text" />
              </button>
            </HoverTooltip>
          ) : null}
        </td>
        {hourColumns.map((col) => (
          <td
            key={col.key}
            className={cn(tdCell, rowCellBg(isSelected, "left"))}
          >
            <TableCellCenter>
              <MoneyValue cell={employee[col.key]} />
            </TableCellCenter>
          </td>
        ))}
        <td
          className={cn(
            tdCell,
            rowCellBg(isSelected, "left"),
            prepMode && isLastRow && "rounded-br-[8px]",
          )}
        >
          <TableCellCenter>
            <p className="m-0 whitespace-nowrap text-sm font-semibold text-ink">
              {employee.total}
            </p>
          </TableCellCenter>
        </td>
        {adjustmentColumns.map((col) => (
          <td
            key={col.key}
            className={cn(
              adjustmentCellClass(prepMode),
              rowCellBg(isSelected, "right"),
            )}
          >
            <DeductionList items={employee[col.key]} tone={col.tone} />
          </td>
        ))}
        <td
          className={cn(
            tdCell,
            "min-w-[132px] pr-2",
            "text-center",
            rowCellBg(isSelected, prepMode ? "right" : "left"),
            !prepMode && isLastRow && "rounded-br-[8px]",
          )}
          {...inspectorProps(inspectorRegistry["TBL-STS"])}
        >
          <StatusColumnLayout
            gap="gap-3"
            trailing={
              <EmployeeActionsMenu
                approvalStatus={approvalById[employee.id] ?? "pending"}
                employeeName={employee.name}
                hasAlerts={getEmployeeAlertCount(employee, resolvedAlertIds) > 0}
                onApprove={() => onSetEmployeeApproval(employee.id, "approved")}
                onUnapprove={() =>
                  onSetEmployeeApproval(employee.id, "pending")
                }
                prepMode={prepMode}
              />
            }
          >
            <EmployeeApprovalPill
              status={approvalById[employee.id] ?? "pending"}
            />
          </StatusColumnLayout>
        </td>
      </tr>
    );
  };

  const handleSort = (key: SortKey) => {
    setSort((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const startResize = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const updateWidth = () => {
      setTableWidth(wrapper.getBoundingClientRect().width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    let frameId = 0;

    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) {
          return;
        }

        const { left, width } = wrapper.getBoundingClientRect();
        const nextRatio = (event.clientX - left) / width;
        setLeftRatio(
          Math.min(MAX_LEFT_RATIO, Math.max(MIN_LEFT_RATIO, nextRatio)),
        );
      });
    };

    const handleMouseUp = () => {
      cancelAnimationFrame(frameId);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const resolvedTableWidth =
    tableWidth || tableWrapperRef.current?.getBoundingClientRect().width || 1100;
  const columnWidths = getColumnWidths(
    resolvedTableWidth,
    prepMode,
    leftRatio,
  );
  const effectiveLeftRatio = getEffectiveLeftRatio(
    resolvedTableWidth,
    prepMode,
    leftRatio,
  );
  const splitPositionPx = resolvedTableWidth * effectiveLeftRatio;
  const showSearchEmptyState =
    searchQuery.trim().length > 0 && sortedEmployees.length === 0;

  if (showSearchEmptyState) {
    return (
      <div className="mx-6">
        <EmployeeSearchEmptyState onClearSearch={() => onSearchQueryChange("")} />
      </div>
    );
  }

  return (
    <div className="mx-6 overflow-x-auto" {...inspectorProps(inspectorRegistry.TBL)}>
      <div
        ref={tableWrapperRef}
        className={cn(
          "relative w-full",
          prepMode ? "min-w-[1100px]" : "min-w-[800px]",
        )}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-hidden={!prepMode}
          aria-label="Resize table sections"
          aria-valuenow={Math.round(effectiveLeftRatio * 100)}
          aria-valuemin={Math.round(MIN_LEFT_RATIO * 100)}
          aria-valuemax={Math.round(MAX_LEFT_RATIO * 100)}
          onMouseDown={prepMode ? startResize : undefined}
          className={cn(
            "absolute top-0 z-10 h-full w-3 -translate-x-1/2 touch-none",
            prepMode
              ? "cursor-col-resize hover:bg-brand/20"
              : "pointer-events-none opacity-0",
            isResizing && prepMode && "bg-brand/30",
          )}
          style={{
            left:
              resolvedTableWidth > 0
                ? `${splitPositionPx}px`
                : `${effectiveLeftRatio * 100}%`,
          }}
        />
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <colgroup>
            <col style={{ width: columnWidths.checkbox }} />
            <col style={{ width: columnWidths.name }} />
            <col style={{ width: columnWidths.alerts }} />
            {hourColumns.map((col) => (
              <col key={`hour-col-${col.key}`} style={{ width: columnWidths.hour }} />
            ))}
            <col style={{ width: columnWidths.total }} />
            {adjustmentColumns.map((col) => (
              <col
                key={`adjustment-col-${col.key}`}
                style={{ width: columnWidths.adjustment }}
              />
            ))}
            <col style={{ width: columnWidths.actions }} />
          </colgroup>
        <thead {...inspectorProps(inspectorRegistry["TBL-HDR"])}>
          <tr className="text-xs font-bold uppercase text-subtle">
            <th
              className={cn(
                "flex w-10 max-w-10 items-center rounded-tl-[8px] pl-3 pr-0",
                thCell,
                "bg-page",
              )}
            >
              <span {...inspectorProps(inspectorRegistry["TBL-CHK-ALL"])}>
                <Checkbox
                  aria-label="Select all employees"
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                />
              </span>
            </th>
            <th className={cn(thCell, "overflow-visible bg-page pl-1 pr-2 text-left")}>
              <span className="inline-flex items-center gap-2">
                <span className="mr-4">
                  <SortableHeader
                    label="First"
                    onSort={handleSort}
                    sort={sort}
                    sortKey="firstName"
                  />
                </span>
                <SortableHeader
                  label="Last"
                  onSort={handleSort}
                  sort={sort}
                  sortKey="lastName"
                />
              </span>
            </th>
            <th className={cn("w-12 max-w-12 overflow-visible bg-page px-3", thCell)}>
              <div className="text-center">
                <SortableHeader
                  ariaLabel="Alerts"
                  label={
                    <MaterialIcon
                      name="warning"
                      className="text-danger-text"
                      filled
                      size={16}
                    />
                  }
                  onSort={handleSort}
                  sort={sort}
                  sortKey="alertCount"
                />
              </div>
            </th>
            {hourColumns.map((col) => (
              <th
                key={col.key}
                className={cn(thCell, "overflow-visible bg-page text-center")}
              >
                <SortableHeader
                  label={col.label}
                  onSort={handleSort}
                  sort={sort}
                  sortKey={col.key}
                />
              </th>
            ))}
            <th
              className={cn(
                thCell,
                "overflow-visible bg-page text-center",
                prepMode && "rounded-tr-[8px]",
              )}
            >
              <SortableHeader
                label="Total"
                onSort={handleSort}
                sort={sort}
                sortKey="total"
              />
            </th>
            {adjustmentColumns.map((col) => (
              <th key={col.key} className={adjustmentHeaderClass(prepMode)}>
                <SortableHeader
                  label={col.label}
                  onSort={handleSort}
                  sort={sort}
                  sortKey={col.key}
                />
              </th>
            ))}
            <th
              className={cn(
                thCell,
                "min-w-[132px] pr-2",
                prepMode ? "bg-white" : "rounded-tr-[8px] bg-page",
              )}
            >
              <StatusColumnLayout
                gap="gap-3"
                trailing={<span aria-hidden="true" />}
              >
                <SortableHeader
                  label="Status"
                  onSort={handleSort}
                  sort={sort}
                  sortKey="approvalStatus"
                />
              </StatusColumnLayout>
            </th>
          </tr>
        </thead>
        <tbody>
          {viewMode === "team"
            ? teamGroups.map((group, groupIndex) => {
                const teamIds = group.employees.map((employee) => employee.id);
                const teamAllSelected =
                  teamIds.length > 0 &&
                  teamIds.every((employeeId) => selectedIds.has(employeeId));
                const teamSomeSelected =
                  teamIds.some((employeeId) => selectedIds.has(employeeId)) &&
                  !teamAllSelected;
                const isLastGroup = groupIndex === teamGroups.length - 1;

                return (
                  <Fragment key={group.team}>
                    <TeamSectionHeader
                      allSelected={teamAllSelected}
                      employeeCount={group.employees.length}
                      onToggleAll={() => toggleTeam(teamIds)}
                      remainingColSpan={
                        getLeftSectionColumnCount(prepMode) -
                        2 +
                        (prepMode ? 0 : adjustmentColumns.length)
                      }
                      rightSectionColumnCount={
                        prepMode ? RIGHT_SECTION_COLUMN_COUNT : 0
                      }
                      someSelected={teamSomeSelected}
                      team={group.team}
                    />
                    {group.employees.map((employee, rowIndex) =>
                      renderEmployeeRow(employee, {
                        isLastRow:
                          isLastGroup &&
                          rowIndex === group.employees.length - 1,
                      }),
                    )}
                  </Fragment>
                );
              })
            : sortedEmployees.map((employee, rowIndex) =>
                renderEmployeeRow(employee, {
                  isLastRow: rowIndex === lastRowIndex,
                }),
              )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
