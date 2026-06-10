import { useMemo, useState } from "react";
import { UsageHighlightPanel } from "@/components/design-system/usage-highlight-panel";
import { AppHeader } from "@/components/layout/app-header";
import { SectionHeader } from "@/components/layout/section-header";
import { StatsBar } from "@/components/layout/stats-bar";
import { EmployeeTable } from "@/components/time-attendance/employee-table";
import { FilterBar } from "@/components/time-attendance/filter-bar";
import { PayPeriodToolbar } from "@/components/time-attendance/pay-period-toolbar";
import { SelectionBar } from "@/components/time-attendance/selection-bar";
import { Toast, type ToastAction } from "@/components/ui/toast";
import {
  employees,
  type ApprovalStatus,
  type EmploymentStatus,
} from "@/data/employees";
import { filterEmployees } from "@/lib/filter-employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

function getApprovalToastMessage(
  count: number,
  status: ApprovalStatus,
  employeeName?: string,
) {
  if (count === 1 && employeeName) {
    if (status === "approved") {
      return `${employeeName}'s timesheet approved`;
    }

    return `${employeeName}'s approval removed`;
  }

  if (status === "approved") {
    return `${count} timesheets approved`;
  }

  return `${count} timesheets unapproved`;
}

function getBlockedApprovalToastMessage(
  count: number,
  employeeName?: string,
) {
  if (count === 1 && employeeName) {
    return `${employeeName}'s timesheet could not be approved due to alerts`;
  }

  return `${count} timesheets could not be approved due to alerts`;
}

function getMixedApprovalToastMessage(
  approvedCount: number,
  blockedCount: number,
) {
  const approvedPart =
    approvedCount === 1
      ? "1 timesheet approved"
      : `${approvedCount} timesheets approved`;
  const blockedPart =
    blockedCount === 1
      ? "1 could not be approved due to alerts"
      : `${blockedCount} could not be approved due to alerts`;

  return `${approvedPart}. ${blockedPart}.`;
}

type TimeAttendancePageProps = {
  onClearUsageHighlight?: () => void;
  onOpenDesignSystem?: () => void;
  usageHighlight?: string | null;
};

export function TimeAttendancePage({
  onClearUsageHighlight,
  onOpenDesignSystem,
  usageHighlight = null,
}: TimeAttendancePageProps) {
  const [viewMode, setViewMode] = useState<"name" | "team">("name");
  const [employmentStatusFilter, setEmploymentStatusFilter] = useState<
    EmploymentStatus[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prepMode, setPrepMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalById, setApprovalById] = useState<Record<string, ApprovalStatus>>(
    () => Object.fromEntries(employees.map((employee) => [employee.id, "pending"])),
  );
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(
    new Set(),
  );
  const [toast, setToast] = useState<{
    action: ToastAction;
    id: number;
    message: string;
  } | null>(null);

  const employeeHasAlerts = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);

    return Boolean(
      employee?.alertCount &&
        employee.alertCount > 0 &&
        !resolvedAlertIds.has(employeeId),
    );
  };

  const resolveAlert = (employeeId: string) => {
    setResolvedAlertIds((current) => {
      if (current.has(employeeId)) {
        return current;
      }

      const next = new Set(current);
      next.add(employeeId);
      return next;
    });
  };

  const visibleEmployees = useMemo(
    () => filterEmployees(employees, employmentStatusFilter, searchQuery),
    [employmentStatusFilter, searchQuery],
  );
  const approvedCount = useMemo(
    () =>
      visibleEmployees.filter(
        (employee) => approvalById[employee.id] === "approved",
      ).length,
    [approvalById, visibleEmployees],
  );
  const totalEmployeeCount = visibleEmployees.length;
  const allEmployeesApproved =
    totalEmployeeCount > 0 && approvedCount === totalEmployeeCount;

  const showToast = (action: ToastAction, message: string) => {
    setToast({
      action,
      id: Date.now(),
      message,
    });
  };

  const showApprovalToast = (
    count: number,
    status: ApprovalStatus,
    employeeName?: string,
  ) => {
    showToast(
      status === "approved" ? "approved" : "unapproved",
      getApprovalToastMessage(count, status, employeeName),
    );
  };

  const setEmployeeApproval = (
    employeeId: string,
    status: ApprovalStatus,
  ) => {
    if (status === "approved" && employeeHasAlerts(employeeId)) {
      return;
    }

    if (approvalById[employeeId] === status) {
      return;
    }

    setApprovalById((current) => ({
      ...current,
      [employeeId]: status,
    }));
    const employeeName = employees.find(
      (employee) => employee.id === employeeId,
    )?.name;
    showApprovalToast(1, status, employeeName);
  };

  const setSelectedApproval = (status: ApprovalStatus) => {
    const selectedIdList = Array.from(selectedIds);

    if (status !== "approved") {
      const updatedIds = selectedIdList.filter(
        (employeeId) => approvalById[employeeId] !== status,
      );

      if (updatedIds.length === 0) {
        return;
      }

      setApprovalById((current) => {
        const next = { ...current };
        for (const employeeId of updatedIds) {
          next[employeeId] = status;
        }
        return next;
      });

      const employeeName =
        updatedIds.length === 1
          ? employees.find((employee) => employee.id === updatedIds[0])?.name
          : undefined;
      showApprovalToast(updatedIds.length, status, employeeName);
      return;
    }

    const approvableIds: string[] = [];
    const blockedByAlertIds: string[] = [];

    for (const employeeId of selectedIdList) {
      if (approvalById[employeeId] === "approved") {
        continue;
      }

      if (employeeHasAlerts(employeeId)) {
        blockedByAlertIds.push(employeeId);
      } else {
        approvableIds.push(employeeId);
      }
    }

    if (approvableIds.length === 0 && blockedByAlertIds.length === 0) {
      return;
    }

    if (approvableIds.length > 0) {
      setApprovalById((current) => {
        const next = { ...current };
        for (const employeeId of approvableIds) {
          next[employeeId] = "approved";
        }
        return next;
      });
    }

    if (approvableIds.length > 0 && blockedByAlertIds.length > 0) {
      showToast(
        "approved",
        getMixedApprovalToastMessage(
          approvableIds.length,
          blockedByAlertIds.length,
        ),
      );
      return;
    }

    if (approvableIds.length > 0) {
      const employeeName =
        approvableIds.length === 1
          ? employees.find((employee) => employee.id === approvableIds[0])?.name
          : undefined;
      showApprovalToast(approvableIds.length, "approved", employeeName);
      return;
    }

    const blockedEmployeeName =
      blockedByAlertIds.length === 1
        ? employees.find((employee) => employee.id === blockedByAlertIds[0])
            ?.name
        : undefined;
    showToast(
      "approval-blocked",
      getBlockedApprovalToastMessage(
        blockedByAlertIds.length,
        blockedEmployeeName,
      ),
    );
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-page"
      {...inspectorProps(inspectorRegistry["PG-TA"])}
    >
      <AppHeader />
      <StatsBar />
      <SectionHeader />

      <main className="flex-1 bg-white pb-8">
        <PayPeriodToolbar
          allEmployeesApproved={allEmployeesApproved}
          approvedCount={approvedCount}
          prepMode={prepMode}
          totalEmployeeCount={totalEmployeeCount}
          onPrepModeChange={setPrepMode}
        />
        {selectedIds.size > 0 ? (
          <SelectionBar
            approvalById={approvalById}
            onApproveSelected={() => setSelectedApproval("approved")}
            onUnapproveSelected={() => setSelectedApproval("pending")}
            selectedIds={selectedIds}
          />
        ) : (
          <FilterBar
            employmentStatusFilter={employmentStatusFilter}
            onEmploymentStatusFilterChange={setEmploymentStatusFilter}
            onSearchQueryChange={setSearchQuery}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            viewMode={viewMode}
          />
        )}
        <EmployeeTable
          approvalById={approvalById}
          employmentStatusFilter={employmentStatusFilter}
          onResolveAlert={resolveAlert}
          onSetEmployeeApproval={setEmployeeApproval}
          onSearchQueryChange={setSearchQuery}
          onSelectedIdsChange={setSelectedIds}
          prepMode={prepMode}
          resolvedAlertIds={resolvedAlertIds}
          searchQuery={searchQuery}
          selectedIds={selectedIds}
          viewMode={viewMode}
        />
      </main>

      {toast ? (
        <Toast
          key={toast.id}
          action={toast.action}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      ) : null}

      {usageHighlight ? (
        <UsageHighlightPanel
          highlightId={usageHighlight}
          onDismiss={() => onClearUsageHighlight?.()}
          onOpenDesignSystem={() => onOpenDesignSystem?.()}
        />
      ) : null}
    </div>
  );
}
