import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EmployeeAlertIcon } from "@/components/icons/employee-alert-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Checkbox, CheckboxContainer } from "@/components/ui/checkbox";
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
import type {
  ApprovalStatus,
  EmployeeRow,
  EmploymentStatus,
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
        <TruncatedButton className="w-full cursor-pointer text-left text-sm leading-5 font-semibold text-brand-dark hover:underline">
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
  align = "left",
}: {
  label: ReactNode;
  sortKey: SortKey;
  sort: SortState | null;
  onSort: (key: SortKey) => void;
  ariaLabel?: string;
  align?: "left" | "center";
}) {
  const isActive = sort?.key === sortKey;
  const direction = isActive ? sort.direction : null;
  const isCentered = align === "center";

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
        "group relative h-14 max-w-full cursor-pointer rounded-sm text-xs leading-4 uppercase hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        isCentered ? "w-full text-center" : "shrink-0 text-left",
        isActive ? "text-ink" : "text-subtle",
      )}
    >
      {!isCentered ? (
        <span
          className="invisible block whitespace-nowrap leading-4"
          aria-hidden="true"
        >
          {label}
        </span>
      ) : null}
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          isCentered
            ? "inset-x-0 whitespace-normal text-center"
            : "left-0 whitespace-nowrap",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute bottom-0 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center",
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
  header = false,
  trailing,
  gap = "gap-1",
}: {
  children: ReactNode;
  header?: boolean;
  trailing: ReactNode;
  gap?: "gap-1" | "gap-3";
}) {
  return (
    <div
      className={cn(
        "flex w-full",
        gap,
        header ? "h-14" : "items-center",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center justify-center",
          header && "h-full",
        )}
      >
        {children}
      </div>
      <div className="size-8 shrink-0">{trailing}</div>
    </div>
  );
}

const thCell = "h-14 align-middle px-3";
const thCentered = cn(thCell, "text-center");
const tdCell =
  "h-[52px] overflow-visible border-t border-border align-middle px-3";
const tdNameCell =
  "h-[52px] overflow-visible border-t border-border align-middle px-3";

function rowCellBg(
  isSelected: boolean,
  side: "left" | "right",
  options?: { isApprovedInPrepMode?: boolean },
) {
  if (isSelected) {
    return side === "left"
      ? "bg-row-selected-left group-hover:bg-row-selected-left"
      : "bg-row-selected-right group-hover:bg-row-selected-right";
  }

  if (options?.isApprovedInPrepMode) {
    return "bg-success-muted group-hover:bg-success-muted";
  }

  if (side === "left") {
    return "bg-page group-hover:bg-row-hover-left";
  }

  return "bg-white group-hover:bg-row-hover-right";
}

const TABLE_HORIZONTAL_PADDING_PX = 48;

function stickyActionsHeaderClass(prepMode: boolean) {
  return cn(
    "sticky right-0 z-30",
    prepMode ? "bg-white" : "bg-page",
  );
}

function stickyActionsCellClass(
  isSelected: boolean,
  prepMode: boolean,
  options?: { isApprovedInPrepMode?: boolean; isLastRow?: boolean },
) {
  return cn(
    "sticky right-0 z-20",
    rowCellBg(isSelected, prepMode ? "right" : "left", {
      isApprovedInPrepMode: options?.isApprovedInPrepMode,
    }),
    options?.isLastRow && "rounded-br-[8px]",
  );
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
const NAME_FLEX_WEIGHT = 0.22;
const NAME_COLUMN_UNITS_OFF = 3;
const HOUR_FLEX_WEIGHT = 0.12;
const TOTAL_FLEX_WEIGHT = 0.14;
const MIN_NAME_COL_PX = 120;
const MIN_HOUR_COL_PX = 90;
const MIN_TOTAL_COL_PX = 86;
const MIN_ADJUSTMENT_COL_PX = 76;
const TABLE_MIN_WIDTH_PX =
  CHECKBOX_COL_PX +
  ALERTS_COL_PX +
  ACTIONS_COL_PX +
  MIN_NAME_COL_PX +
  MIN_HOUR_COL_PX * hourColumns.length +
  MIN_TOTAL_COL_PX +
  MIN_ADJUSTMENT_COL_PX * adjustmentColumns.length;
const LEFT_SECTION_MIN_PX =
  CHECKBOX_COL_PX +
  ALERTS_COL_PX +
  MIN_NAME_COL_PX +
  MIN_HOUR_COL_PX * hourColumns.length +
  MIN_TOTAL_COL_PX;
const RIGHT_SECTION_MIN_PX =
  MIN_ADJUSTMENT_COL_PX * adjustmentColumns.length + ACTIONS_COL_PX;
const DEFAULT_LEFT_RATIO = 0.6;
const MIN_LEFT_RATIO = 0.3;
const MAX_LEFT_RATIO = 0.75;

function getResizeRatioBounds(tableWidth: number) {
  if (tableWidth <= 0) {
    return { min: MIN_LEFT_RATIO, max: MAX_LEFT_RATIO };
  }

  const minRatio = LEFT_SECTION_MIN_PX / tableWidth;
  const maxRatio = (tableWidth - RIGHT_SECTION_MIN_PX) / tableWidth;

  return {
    min: Math.max(MIN_LEFT_RATIO, minRatio),
    max: Math.min(MAX_LEFT_RATIO, maxRatio),
  };
}

function distributeWidths(
  availablePx: number,
  segments: { weight: number; min: number }[],
) {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  if (totalWeight <= 0 || availablePx <= 0) {
    return segments.map((segment) => segment.min);
  }

  let widths = segments.map(
    (segment) =>
      Math.max(segment.min, (availablePx * segment.weight) / totalWeight),
  );
  let total = widths.reduce((sum, width) => sum + width, 0);

  if (total < availablePx) {
    const extra = availablePx - total;
    widths = widths.map(
      (width, index) =>
        width + (extra * segments[index].weight) / totalWeight,
    );
    return widths;
  }

  let deficit = total - availablePx;
  while (deficit > 0.5) {
    const shrinkable = widths.map(
      (width, index) => Math.max(0, width - segments[index].min),
    );
    const shrinkableTotal = shrinkable.reduce((sum, width) => sum + width, 0);

    if (shrinkableTotal <= 0) {
      break;
    }

    widths = widths.map((width, index) => {
      const room = shrinkable[index];
      if (room <= 0) {
        return width;
      }

      return width - (deficit * room) / shrinkableTotal;
    });
    total = widths.reduce((sum, width) => sum + width, 0);
    deficit = total - availablePx;
  }

  return widths;
}
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

  const leftSegments = prepMode
    ? [
        { weight: NAME_FLEX_WEIGHT, min: MIN_NAME_COL_PX },
        {
          weight: HOUR_FLEX_WEIGHT * hourColumns.length,
          min: MIN_HOUR_COL_PX * hourColumns.length,
        },
        { weight: TOTAL_FLEX_WEIGHT, min: MIN_TOTAL_COL_PX },
      ]
    : [
        { weight: NAME_COLUMN_UNITS_OFF, min: MIN_NAME_COL_PX },
        {
          weight: hourColumns.length,
          min: MIN_HOUR_COL_PX * hourColumns.length,
        },
        { weight: 1, min: MIN_TOTAL_COL_PX },
      ];
  const [namePx, hourGroupPx, totalPx] = distributeWidths(
    leftFlexPx,
    leftSegments,
  );
  const hourPx = hourGroupPx / hourColumns.length;

  if (!prepMode) {
    return {
      checkbox: `${CHECKBOX_COL_PX}px`,
      name: `${namePx}px`,
      alerts: `${ALERTS_COL_PX}px`,
      hour: `${hourPx}px`,
      total: `${totalPx}px`,
      adjustment: "0px",
      actions: `${ACTIONS_COL_PX}px`,
    };
  }

  const adjustmentPx =
    distributeWidths(
      rightFlexPx,
      adjustmentColumns.map(() => ({
        weight: 1,
        min: MIN_ADJUSTMENT_COL_PX,
      })),
    )[0] ?? MIN_ADJUSTMENT_COL_PX;

  return {
    checkbox: `${CHECKBOX_COL_PX}px`,
    name: `${namePx}px`,
    alerts: `${ALERTS_COL_PX}px`,
    hour: `${hourPx}px`,
    total: `${totalPx}px`,
    adjustment: `${adjustmentPx}px`,
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
    thCentered,
    "overflow-visible bg-white",
    prepMode ? "opacity-100" : "border-0 p-0 opacity-0",
  );
}

function getLeftSectionColumnCount(prepMode: boolean) {
  return LEFT_SECTION_COLUMN_COUNT + (prepMode ? 0 : 1);
}

const LEFT_SECTION_COLUMN_COUNT = 3 + hourColumns.length + 1;

type EmployeeTableProps = {
  employees: EmployeeRow[];
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
  payPeriodRange: string;
  resolvedAlertIds: Set<string>;
  viewMode: "name" | "team";
};

export function EmployeeTable({
  employees,
  employmentStatusFilter,
  selectedIds,
  onSelectedIdsChange,
  prepMode,
  searchQuery,
  onSearchQueryChange,
  approvalById,
  onResolveAlert,
  onSetEmployeeApproval,
  payPeriodRange,
  resolvedAlertIds,
  viewMode,
}: EmployeeTableProps) {
  const [sort, setSort] = useState<SortState | null>({
    key: "firstName",
    direction: "asc",
  });
  const [displayOrder, setDisplayOrder] = useState<string[] | null>(null);
  const [leftRatio, setLeftRatio] = useState(DEFAULT_LEFT_RATIO);
  const [isResizing, setIsResizing] = useState(false);
  const [tableWidth, setTableWidth] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const updateTableLayout = useCallback(() => {
    const scrollEl = scrollRef.current;
    const wrapperEl = tableWrapperRef.current;
    const containerEl = tableContainerRef.current;
    if (!scrollEl || !wrapperEl) {
      return;
    }

    const minTableWidth = prepMode ? TABLE_MIN_WIDTH_PX : 800;
    const parentWidth =
      containerEl?.parentElement?.clientWidth ?? scrollEl.clientWidth;
    const fitsWithPadding =
      minTableWidth <= parentWidth - TABLE_HORIZONTAL_PADDING_PX;

    setIsOverflowing(!fitsWithPadding);
    setIsScrolled(scrollEl.scrollLeft > 0);
    setTableHeight(wrapperEl.offsetHeight);
  }, [prepMode]);
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
  }, [approvalById, employees, resolvedAlertIds]);

  const sortedEmployees = useMemo(() => {
    const filtered = filterEmployees(
      employees,
      employmentStatusFilter,
      searchQuery,
    );

    if (!sort) {
      if (!displayOrder) {
        return filtered;
      }

      const orderIndex = new Map(displayOrder.map((id, index) => [id, index]));

      return [...filtered].sort((a, b) => {
        const indexA = orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const indexB = orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
      });
    }

    return [...filtered].sort((a, b) =>
      compareEmployees(a, b, sort, approvalById, resolvedAlertIds),
    );
  }, [
    approvalById,
    displayOrder,
    employees,
    employmentStatusFilter,
    resolvedAlertIds,
    searchQuery,
    sort,
  ]);
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
    const isApprovedInPrepMode =
      prepMode && (approvalById[employee.id] ?? "pending") === "approved";
    const rowBgOptions = { isApprovedInPrepMode };

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
            "w-10 max-w-10 pl-3 pr-0",
            rowCellBg(isSelected, "left", rowBgOptions),
            isLastRow && "rounded-bl-[8px]",
          )}
        >
          <div className="flex min-h-[51px] items-center">
            <CheckboxContainer {...inspectorProps(inspectorRegistry["TBL-CHK"])}>
              <Checkbox
                aria-label={`Select ${employee.name}`}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  toggleRow(employee.id, checked === true)
                }
              />
            </CheckboxContainer>
          </div>
        </td>
        <td
          className={cn(
            tdNameCell,
            "pl-1 pr-2",
            rowCellBg(isSelected, "left", rowBgOptions),
          )}
        >
          <EmployeeCell employee={employee} />
        </td>
        <td
          className={cn(
            "w-12 max-w-12 px-3",
            tdCell,
            "text-center",
            rowCellBg(isSelected, "left", rowBgOptions),
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
                onClick={() => handleResolveAlert(employee.id)}
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
            className={cn(tdCell, rowCellBg(isSelected, "left", rowBgOptions))}
          >
            <TableCellCenter>
              <MoneyValue cell={employee[col.key]} />
            </TableCellCenter>
          </td>
        ))}
        <td
          className={cn(
            tdCell,
            rowCellBg(isSelected, "left", rowBgOptions),
            prepMode && isLastRow && "rounded-br-[8px]",
          )}
        >
          <TableCellCenter>
            <p className="m-0 truncate text-sm font-semibold text-ink">
              {employee.total}
            </p>
          </TableCellCenter>
        </td>
        {adjustmentColumns.map((col) => (
          <td
            key={col.key}
            className={cn(
              adjustmentCellClass(prepMode),
              rowCellBg(isSelected, "right", rowBgOptions),
            )}
          >
            <DeductionList items={employee[col.key]} tone={col.tone} />
          </td>
        ))}
        <td
          className={cn(
            tdCell,
            "min-w-[132px] pr-2 text-center",
            stickyActionsCellClass(isSelected, prepMode, {
              isApprovedInPrepMode,
              isLastRow,
            }),
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
              employeeName={employee.name}
              hasAlerts={getEmployeeAlertCount(employee, resolvedAlertIds) > 0}
              payPeriodRange={payPeriodRange}
              prepMode={prepMode}
              status={approvalById[employee.id] ?? "pending"}
              onApprove={() => onSetEmployeeApproval(employee.id, "approved")}
              onClearAlerts={() => handleResolveAlert(employee.id)}
              onUnapprove={() => onSetEmployeeApproval(employee.id, "pending")}
            />
          </StatusColumnLayout>
        </td>
      </tr>
    );
  };

  const handleResolveAlert = (employeeId: string) => {
    if (sort?.key === "alertCount") {
      setDisplayOrder(sortedEmployees.map((employee) => employee.id));
      setSort(null);
    }

    onResolveAlert(employeeId);
  };

  const handleSort = (key: SortKey) => {
    setDisplayOrder(null);
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

  useEffect(() => {
    setDisplayOrder(null);
  }, [employees]);

  const startResize = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    const scrollEl = scrollRef.current;
    if (!wrapper) {
      return;
    }

    const updateWidth = () => {
      setTableWidth(wrapper.getBoundingClientRect().width);
      updateTableLayout();
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapper);
    if (tableContainerRef.current?.parentElement) {
      observer.observe(tableContainerRef.current.parentElement);
    }

    scrollEl?.addEventListener("scroll", updateTableLayout, { passive: true });

    return () => {
      observer.disconnect();
      scrollEl?.removeEventListener("scroll", updateTableLayout);
    };
  }, [updateTableLayout, prepMode, sortedEmployees.length, viewMode]);

  useEffect(() => {
    if (!prepMode || tableWidth <= 0) {
      return;
    }

    const { min, max } = getResizeRatioBounds(tableWidth);
    setLeftRatio((current) => Math.min(max, Math.max(min, current)));
  }, [prepMode, tableWidth]);

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
        const { min, max } = getResizeRatioBounds(width);
        setLeftRatio(Math.min(max, Math.max(min, nextRatio)));
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
  const resizeRatioBounds = getResizeRatioBounds(resolvedTableWidth);
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
    <div
      ref={tableContainerRef}
      className={cn(
        "relative",
        !isScrolled && "ml-6",
        !isOverflowing && !isScrolled && "mr-6",
      )}
    >
      {isOverflowing ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 z-[25] w-3"
          style={{
            right: ACTIONS_COL_PX,
            height: tableHeight,
            background:
              "linear-gradient(to left, rgba(0, 0, 0, 0.1), transparent)",
          }}
        />
      ) : null}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden"
        {...inspectorProps(inspectorRegistry.TBL)}
      >
        <div
          ref={tableWrapperRef}
          className={cn("relative w-full", !prepMode && "min-w-[800px]")}
          style={{ minWidth: prepMode ? TABLE_MIN_WIDTH_PX : undefined }}
        >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-hidden={!prepMode}
          aria-label="Resize table sections"
          aria-valuenow={Math.round(effectiveLeftRatio * 100)}
          aria-valuemin={Math.round(resizeRatioBounds.min * 100)}
          aria-valuemax={Math.round(resizeRatioBounds.max * 100)}
          onMouseDown={prepMode ? startResize : undefined}
          className={cn(
            "absolute top-0 z-40 w-8 -translate-x-1/2 touch-none select-none",
            prepMode
              ? "cursor-col-resize hover:bg-brand/15"
              : "pointer-events-none opacity-0",
            isResizing && prepMode && "bg-brand/25",
          )}
          style={{
            left:
              resolvedTableWidth > 0
                ? `${splitPositionPx}px`
                : `${effectiveLeftRatio * 100}%`,
            height: tableHeight > 0 ? tableHeight : undefined,
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
                "w-10 max-w-10 rounded-tl-[8px] pl-3 pr-0",
                thCell,
                "bg-page",
              )}
            >
              <div className="flex h-14 items-center">
                <CheckboxContainer {...inspectorProps(inspectorRegistry["TBL-CHK-ALL"])}>
                  <Checkbox
                    aria-label="Select all employees"
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                  />
                </CheckboxContainer>
              </div>
            </th>
            <th className={cn(thCell, "overflow-visible bg-page pl-1 pr-2 text-left")}>
              <div className="flex h-14 items-center gap-6">
                <SortableHeader
                  label="First"
                  onSort={handleSort}
                  sort={sort}
                  sortKey="firstName"
                />
                <SortableHeader
                  label="Last"
                  onSort={handleSort}
                  sort={sort}
                  sortKey="lastName"
                />
              </div>
            </th>
            <th className={cn("w-12 max-w-12 overflow-visible bg-page px-3", thCentered)}>
              <SortableHeader
                align="center"
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
            </th>
            {hourColumns.map((col) => (
              <th
                key={col.key}
                className={cn(thCentered, "overflow-visible bg-page")}
              >
                <SortableHeader
                  align="center"
                  label={col.label}
                  onSort={handleSort}
                  sort={sort}
                  sortKey={col.key}
                />
              </th>
            ))}
            <th
              className={cn(
                thCentered,
                "overflow-visible bg-page",
                prepMode && "rounded-tr-[8px]",
              )}
            >
              <SortableHeader
                align="center"
                label="Total"
                onSort={handleSort}
                sort={sort}
                sortKey="total"
              />
            </th>
            {adjustmentColumns.map((col) => (
              <th key={col.key} className={adjustmentHeaderClass(prepMode)}>
                <SortableHeader
                  align="center"
                  label={col.label}
                  onSort={handleSort}
                  sort={sort}
                  sortKey={col.key}
                />
              </th>
            ))}
            <th
              className={cn(
                thCentered,
                "min-w-[132px] rounded-tr-[8px] pr-2",
                stickyActionsHeaderClass(prepMode),
              )}
            >
              <StatusColumnLayout
                header
                gap="gap-3"
                trailing={<span aria-hidden="true" />}
              >
                <SortableHeader
                  align="center"
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
                      adjustmentColumnCount={
                        prepMode ? adjustmentColumns.length : 0
                      }
                      showStatusColumn={prepMode}
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
    </div>
  );
}
