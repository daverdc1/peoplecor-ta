import { useMemo, useState } from "react";
import { EmployeeTable } from "@/components/time-attendance/employee-table";
import { employees } from "@/data/employees";
import type { ApprovalStatus } from "@/data/employees";

type EmployeeTablePreviewProps = {
  prepMode?: boolean;
};

export function EmployeeTablePreview({ prepMode = true }: EmployeeTablePreviewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const approvalById = useMemo(
    () =>
      Object.fromEntries(
        employees.map((employee) => [employee.id, "pending" as ApprovalStatus]),
      ),
    [],
  );

  return (
    <EmployeeTable
      approvalById={approvalById}
      employmentStatusFilter={[]}
      onResolveAlert={() => undefined}
      onSearchQueryChange={() => undefined}
      onSelectedIdsChange={setSelectedIds}
      onSetEmployeeApproval={() => undefined}
      prepMode={prepMode}
      resolvedAlertIds={new Set()}
      searchQuery=""
      selectedIds={selectedIds}
      viewMode="name"
    />
  );
}
