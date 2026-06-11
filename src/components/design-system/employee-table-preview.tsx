import { useMemo, useState } from "react";
import { EmployeeTable } from "@/components/time-attendance/employee-table";
import { junePayPeriodEmployees } from "@/data/employees";
import { payPeriods } from "@/data/pay-periods";
import type { ApprovalStatus } from "@/data/employees";

type EmployeeTablePreviewProps = {
  prepMode?: boolean;
};

export function EmployeeTablePreview({ prepMode = true }: EmployeeTablePreviewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const approvalById = useMemo(
    () =>
      Object.fromEntries(
        junePayPeriodEmployees.map((employee) => [
          employee.id,
          "pending" as ApprovalStatus,
        ]),
      ),
    [],
  );

  return (
    <EmployeeTable
      approvalById={approvalById}
      employees={junePayPeriodEmployees}
      employmentStatusFilter={[]}
      onResolveAlert={() => undefined}
      onSearchQueryChange={() => undefined}
      onSelectedIdsChange={setSelectedIds}
      onSetEmployeeApproval={() => undefined}
      payPeriodRange={payPeriods[0].range}
      prepMode={prepMode}
      resolvedAlertIds={new Set()}
      searchQuery=""
      selectedIds={selectedIds}
      viewMode="name"
    />
  );
}
