import { MaterialIcon } from "@/components/icons/material-icon";
import { StatusPill } from "@/components/ui/status-pill";
import type { ApprovalStatus } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

type EmployeeApprovalPillProps = {
  status: ApprovalStatus;
};

export function EmployeeApprovalPill({ status }: EmployeeApprovalPillProps) {
  const isApproved = status === "approved";

  if (isApproved) {
    return (
      <span {...inspectorProps(inspectorRegistry["PIL-APR"])}>
      <StatusPill
        icon={<MaterialIcon name="check" className="text-white" filled size={12} />}
        variant="success"
      >
        Approved
      </StatusPill>
      </span>
    );
  }

  return (
    <span {...inspectorProps(inspectorRegistry["PIL-PND"])}>
    <StatusPill
      icon={
        <MaterialIcon name="hourglass_top" className="text-warning-text" size={12} />
      }
      variant="warning"
    >
      Pending
    </StatusPill>
    </span>
  );
}
