import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialIcon } from "@/components/icons/material-icon";
import type { ApprovalStatus } from "@/data/employees";
import { cn } from "@/lib/utils";

type EmployeeActionsMenuProps = {
  approvalStatus?: ApprovalStatus;
  employeeName: string;
  onApprove?: () => void;
  onUnapprove?: () => void;
  prepMode: boolean;
};

export function EmployeeActionsMenu({
  approvalStatus = "pending",
  employeeName,
  onApprove,
  onUnapprove,
  prepMode,
}: EmployeeActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm text-ink hover:bg-surface-muted data-[state=open]:bg-surface-muted"
          aria-label={`Actions for ${employeeName}`}
        >
          <MaterialIcon name="more_vert" size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {approvalStatus === "pending" ? (
          <DropdownMenuItem
            className={cn(
              "font-semibold text-success-dark focus:bg-success-muted focus:text-success-dark",
            )}
            onClick={onApprove}
          >
            <MaterialIcon
              name="check_circle"
              className="text-success-dark"
              filled
              size={14}
            />
            Approve timesheet
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className={cn(
              "font-semibold text-warning focus:bg-warning-muted focus:text-warning",
            )}
            onClick={onUnapprove}
          >
            <MaterialIcon name="undo" className="text-warning" size={14} />
            Unapprove timesheet
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <MaterialIcon name="edit" className="text-muted" size={14} />
          Edit timesheet
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="edit" className="text-muted" size={14} />
          Edit wage
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="verified" className="text-muted" size={14} />
          Verify labor
        </DropdownMenuItem>

        {prepMode ? (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>Create Adjustment</DropdownMenuLabel>
            <DropdownMenuItem>
              <MaterialIcon name="add_circle" className="text-muted" size={14} />
              One-Time Addition
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon name="add_circle" className="text-muted" size={14} />
              Recurring Addition
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <MaterialIcon name="remove_circle" className="text-muted" size={14} />
              One-Time Deduction
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon name="remove_circle" className="text-muted" size={14} />
              Recurring Deduction
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon name="remove_circle" className="text-muted" size={14} />
              Payroll Benefit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon name="remove_circle" className="text-muted" size={14} />
              Payroll Garnishment
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <MaterialIcon
                name="account_balance"
                className="text-muted"
                size={14}
              />
              Loan
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className={cn(
            "text-danger-menu focus:text-danger-menu focus:bg-danger/5",
          )}
        >
          <MaterialIcon
            name="close"
            className="text-danger-menu"
            size={14}
          />
          Delete timesheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
