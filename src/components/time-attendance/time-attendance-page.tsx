import { useMemo, useState } from "react";
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

export function TimeAttendancePage() {
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
  const [toast, setToast] = useState<{
    action: ToastAction;
    id: number;
    message: string;
  } | null>(null);

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

  const showApprovalToast = (
    count: number,
    status: ApprovalStatus,
    employeeName?: string,
  ) => {
    setToast({
      action: status === "approved" ? "approved" : "unapproved",
      id: Date.now(),
      message: getApprovalToastMessage(count, status, employeeName),
    });
  };

  const setEmployeeApproval = (
    employeeId: string,
    status: ApprovalStatus,
  ) => {
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
    const updatedIds = Array.from(selectedIds).filter(
      (employeeId) => approvalById[employeeId] !== status,
    );

    if (updatedIds.length === 0) {
      return;
    }

    setApprovalById((current) => {
      const next = { ...current };
      for (const employeeId of selectedIds) {
        next[employeeId] = status;
      }
      return next;
    });

    const employeeName =
      updatedIds.length === 1
        ? employees.find((employee) => employee.id === updatedIds[0])?.name
        : undefined;
    showApprovalToast(updatedIds.length, status, employeeName);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
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
          onSetEmployeeApproval={setEmployeeApproval}
          onSearchQueryChange={setSearchQuery}
          onSelectedIdsChange={setSelectedIds}
          prepMode={prepMode}
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
    </div>
  );
}
