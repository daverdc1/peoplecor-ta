import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialIcon } from "@/components/icons/material-icon";
import { HoverTooltip } from "@/components/ui/truncated-text";
import type { ApprovalStatus } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type EmployeeActionsMenuProps = {
  approvalStatus?: ApprovalStatus;
  employeeName: string;
  hasAlerts?: boolean;
  onApprove?: () => void;
  onUnapprove?: () => void;
  prepMode: boolean;
};

export function EmployeeActionsMenu({
  approvalStatus = "pending",
  employeeName,
  hasAlerts = false,
  onApprove,
  onUnapprove,
  prepMode,
}: EmployeeActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [allowMoreTooltip, setAllowMoreTooltip] = useState(true);

  return (
    <span className="inline-flex" {...inspectorProps(inspectorRegistry.ACT)}>
    <DropdownMenu
      onOpenChange={(open) => {
        setMenuOpen(open);
        if (!open) {
          setAllowMoreTooltip(false);
        }
      }}
    >
      <HoverTooltip
        disabled={menuOpen || !allowMoreTooltip}
        label="Actions"
        onMouseLeave={() => {
          if (!menuOpen) {
            setAllowMoreTooltip(true);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex aspect-square size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-ink hover:bg-surface-muted data-[state=open]:bg-surface-muted"
            aria-label={`Actions for ${employeeName}`}
          >
            <MaterialIcon name="more_vert" size={20} />
          </button>
        </DropdownMenuTrigger>
      </HoverTooltip>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {approvalStatus === "pending" ? (
          <DropdownMenuItem
            className={cn(
              "font-semibold text-success-dark focus:bg-success-muted focus:text-success-dark data-[highlighted]:bg-success-muted data-[highlighted]:text-success-dark",
              hasAlerts && "opacity-50",
            )}
            {...inspectorProps(inspectorRegistry["ACT-APR"])}
            onSelect={(event) => {
              if (hasAlerts) {
                event.preventDefault();
                return;
              }

              onApprove?.();
            }}
          >
            <HoverTooltip
              disabled={!hasAlerts}
              label="Resolve alerts before approving"
            >
              <span className="inline-flex w-full items-center gap-1.5">
                <MaterialIcon
                  name="check_circle"
                  className="text-success-dark"
                  filled
                  size={14}
                />
                Approve timesheet
              </span>
            </HoverTooltip>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className={cn(
              "font-semibold text-warning-text focus:bg-warning-muted focus:text-warning-text data-[highlighted]:bg-warning-muted data-[highlighted]:text-warning-text",
            )}
            {...inspectorProps(inspectorRegistry["ACT-UNA"])}
            onSelect={() => onUnapprove?.()}
          >
            <MaterialIcon name="undo" className="text-warning-text" size={14} />
            Unapprove timesheet
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <MaterialIcon name="verified" className="text-muted" size={14} />
          Verify labor
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="download" className="text-muted" size={14} />
          Download timesheet
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <MaterialIcon name="edit" className="text-muted" size={14} />
          Edit timesheet
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="edit" className="text-muted" size={14} />
          Edit wage
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
            "text-danger-text focus:bg-danger-subtle focus:text-danger-text data-[highlighted]:bg-danger-subtle data-[highlighted]:text-danger-text",
          )}
        >
          <MaterialIcon
            name="close"
            className="text-danger-text"
            size={14}
          />
          Delete timesheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </span>
  );
}
