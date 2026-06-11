import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";
import type { ApprovalStatus } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

type SelectionBarProps = {
  approvalById: Record<string, ApprovalStatus>;
  onApproveSelected: () => void;
  onUnapproveSelected: () => void;
  selectedIds: Set<string>;
};

export function SelectionBar({
  approvalById,
  onApproveSelected,
  onUnapproveSelected,
  selectedIds,
}: SelectionBarProps) {
  const selectedCount = selectedIds.size;
  const timesheetLabel =
    selectedCount === 1 ? "timesheet" : "timesheets";
  const selectedIdList = Array.from(selectedIds);
  const hasPendingSelected = selectedIdList.some(
    (employeeId) => approvalById[employeeId] !== "approved",
  );
  const hasApprovedSelected = selectedIdList.some(
    (employeeId) => approvalById[employeeId] === "approved",
  );

  return (
    <div className="mt-4 px-6 pb-3" {...inspectorProps(inspectorRegistry.SEL)}>
      <div className="flex h-8 items-center gap-2">
        <p className="text-sm leading-5 text-ink">
          {selectedCount} selected {timesheetLabel}
        </p>

        <Button type="button" variant="brandOutline" className="gap-1 px-2">
          <MaterialIcon name="download" size={16} />
          Download Selected
        </Button>

        <Button type="button" variant="brandOutline" className="gap-1 px-2">
          <MaterialIcon name="verified" size={16} />
          Verify Selected
        </Button>

        {hasPendingSelected ? (
          <Button
            type="button"
            variant="success"
            className="gap-1 px-2"
            onClick={onApproveSelected}
            {...inspectorProps(inspectorRegistry["SEL-APR"])}
          >
            <MaterialIcon name="check" size={16} />
            Approve Selected
          </Button>
        ) : null}

        {hasApprovedSelected ? (
          <Button
            type="button"
            variant="warning"
            className="gap-1 px-2"
            onClick={onUnapproveSelected}
            {...inspectorProps(inspectorRegistry["SEL-UNA"])}
          >
            <MaterialIcon name="undo" size={16} />
            Unapprove Selected
          </Button>
        ) : null}
      </div>
    </div>
  );
}
