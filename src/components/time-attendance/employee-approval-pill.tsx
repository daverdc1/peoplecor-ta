import { MaterialIcon } from "@/components/icons/material-icon";
import type { ApprovalStatus } from "@/data/employees";
import { cn } from "@/lib/utils";

type EmployeeApprovalPillProps = {
  status: ApprovalStatus;
};

export function EmployeeApprovalPill({ status }: EmployeeApprovalPillProps) {
  const isApproved = status === "approved";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase",
        isApproved
          ? "bg-success-dark text-white"
          : "border border-warning/60 bg-warning/25 text-[#9a6410]",
      )}
    >
      {isApproved ? (
        <>
          <MaterialIcon name="check" className="text-white" filled size={12} />
          Approved
        </>
      ) : (
        <>
          <MaterialIcon name="hourglass_top" className="text-[#9a6410]" size={12} />
          Pending
        </>
      )}
    </span>
  );
}
