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
  getEmployeesForPayPeriod,
  type ApprovalStatus,
  type EmploymentStatus,
} from "@/data/employees";
import { payPeriods, type PayPeriodId } from "@/data/pay-periods";
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
  const [prepMode, setPrepMode] = useState(false);
  const [payPeriodId, setPayPeriodId] = useState<PayPeriodId>("june-1-15");
  const [searchQuery, setSearchQuery] = useState("");
  const employees = useMemo(
    () => getEmployeesForPayPeriod(payPeriodId),
    [payPeriodId],
  );
  const [approvalById, setApprovalById] = useState<Record<string, ApprovalStatus>>(
    () =>
      Object.fromEntries(
        getEmployeesForPayPeriod("june-1-15").map((employee) => [
          employee.id,
          "pending",
        ]),
      ),
  );
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(
    new Set(),
  );
  const [toast, setToast] = useState<{
    action: ToastAction;
    id: number;
    message: string;
    onUndo?: () => void;
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

  const approvedCount = useMemo(
    () =>
      employees.filter(
        (employee) => approvalById[employee.id] === "approved",
      ).length,
    [approvalById, employees],
  );

  const handlePayPeriodChange = (nextPayPeriodId: PayPeriodId) => {
    setPayPeriodId(nextPayPeriodId);
    const nextEmployees = getEmployeesForPayPeriod(nextPayPeriodId);
    setApprovalById(
      Object.fromEntries(nextEmployees.map((employee) => [employee.id, "pending"])),
    );
    setSelectedIds(new Set());
    setResolvedAlertIds(new Set());
  };
  const totalEmployeeCount = employees.length;
  const allEmployeesApproved =
    totalEmployeeCount > 0 && approvedCount === totalEmployeeCount;
  const payPeriodRange =
    payPeriods.find((period) => period.id === payPeriodId)?.range ??
    payPeriods[0].range;

  const showToast = (
    action: ToastAction,
    message: string,
    onUndo?: () => void,
  ) => {
    setToast({
      action,
      id: Date.now(),
      message,
      onUndo: action === "approved" ? onUndo : undefined,
    });
  };

  const showApprovalToast = (
    count: number,
    status: ApprovalStatus,
    employeeName?: string,
    onUndo?: () => void,
  ) => {
    showToast(
      status === "approved" ? "approved" : "unapproved",
      getApprovalToastMessage(count, status, employeeName),
      onUndo,
    );
  };

  const revertEmployeeApprovals = (
    employeeIds: string[],
    previousStatuses: Record<string, ApprovalStatus>,
  ) => {
    setApprovalById((current) => {
      const next = { ...current };
      for (const employeeId of employeeIds) {
        next[employeeId] = previousStatuses[employeeId] ?? "pending";
      }
      return next;
    });
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

    const previousStatus = approvalById[employeeId] ?? "pending";

    setApprovalById((current) => ({
      ...current,
      [employeeId]: status,
    }));
    const employeeName = employees.find(
      (employee) => employee.id === employeeId,
    )?.name;
    showApprovalToast(
      1,
      status,
      employeeName,
      status === "approved"
        ? () => revertEmployeeApprovals([employeeId], { [employeeId]: previousStatus })
        : undefined,
    );
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

    const previousStatuses = Object.fromEntries(
      approvableIds.map((employeeId) => [
        employeeId,
        approvalById[employeeId] ?? "pending",
      ]),
    );
    const undoApproval = () =>
      revertEmployeeApprovals(approvableIds, previousStatuses);

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
        undoApproval,
      );
      return;
    }

    if (approvableIds.length > 0) {
      const employeeName =
        approvableIds.length === 1
          ? employees.find((employee) => employee.id === approvableIds[0])?.name
          : undefined;
      showApprovalToast(
        approvableIds.length,
        "approved",
        employeeName,
        undoApproval,
      );
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
          payPeriodId={payPeriodId}
          prepMode={prepMode}
          totalEmployeeCount={totalEmployeeCount}
          onPayPeriodChange={handlePayPeriodChange}
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
          employees={employees}
          employmentStatusFilter={employmentStatusFilter}
          onResolveAlert={resolveAlert}
          onSetEmployeeApproval={setEmployeeApproval}
          onSearchQueryChange={setSearchQuery}
          onSelectedIdsChange={setSelectedIds}
          payPeriodRange={payPeriodRange}
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
          onUndo={toast.onUndo}
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
