import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";
import type { ApprovalStatus } from "@/data/employees";

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
    <div className="mt-4 px-6 pb-3">
      <div className="flex h-8 items-center gap-2">
        <p className="text-sm leading-5 text-ink">
          {selectedCount} selected {timesheetLabel}
        </p>

        <Button
          type="button"
          variant="brandOutline"
          className="h-8 gap-1 px-2 py-0 text-xs"
        >
          <MaterialIcon name="download" className="text-brand" size={16} />
          Download Selected
        </Button>

        <Button
          type="button"
          variant="brandOutline"
          className="h-8 gap-1 px-2 py-0 text-xs"
        >
          <MaterialIcon name="verified" className="text-brand" size={16} />
          Verify Selected
        </Button>

        <Button
          type="button"
          className="h-8 gap-1 border-0 bg-success px-2 py-0 text-xs font-bold uppercase text-white hover:bg-success-dark disabled:bg-surface-muted disabled:text-muted disabled:opacity-100"
          disabled={!hasPendingSelected}
          onClick={onApproveSelected}
        >
          <MaterialIcon name="check" size={16} />
          Approve Selected
        </Button>

        <Button
          type="button"
          variant="brandOutline"
          className="h-8 gap-1 px-2 py-0 text-xs disabled:opacity-50"
          disabled={!hasApprovedSelected}
          onClick={onUnapproveSelected}
        >
          <MaterialIcon name="undo" className="text-brand" size={16} />
          Unapprove Selected
        </Button>
      </div>
    </div>
  );
}
