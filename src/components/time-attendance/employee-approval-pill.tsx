import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { StatusPill, statusPillVariants } from "@/components/ui/status-pill";
import { HoverTooltip } from "@/components/ui/truncated-text";
import type { ApprovalStatus } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type EmployeeApprovalPillProps = {
  employeeName: string;
  hasAlerts?: boolean;
  payPeriodRange: string;
  prepMode: boolean;
  status: ApprovalStatus;
  onApprove?: () => void;
  onClearAlerts?: () => void;
  onUnapprove?: () => void;
};

const actionPillClass =
  "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed";

const pillIconSlotClass =
  "inline-flex size-3 shrink-0 items-center justify-center";

function PillIcon({ children }: { children: ReactNode }) {
  return <span className={pillIconSlotClass}>{children}</span>;
}

const pillWrapperClass = "inline-flex h-5 items-center";

export function EmployeeApprovalPill({
  employeeName,
  hasAlerts = false,
  payPeriodRange,
  prepMode,
  status,
  onApprove,
  onClearAlerts,
  onUnapprove,
}: EmployeeApprovalPillProps) {
  const isApproved = status === "approved";

  if (!prepMode) {
    if (isApproved) {
      return (
        <span
          className={pillWrapperClass}
          {...inspectorProps(inspectorRegistry["PIL-APR"])}
        >
          <StatusPill
            icon={
              <PillIcon>
                <MaterialIcon name="check" className="text-white" filled size={12} />
              </PillIcon>
            }
            variant="success"
          >
            Approved
          </StatusPill>
        </span>
      );
    }

    return (
      <span
        className={pillWrapperClass}
        {...inspectorProps(inspectorRegistry["PIL-PND"])}
      >
        <StatusPill
          icon={
            <PillIcon>
              <MaterialIcon name="hourglass_top" className="text-warning-text" size={12} />
            </PillIcon>
          }
          variant="warning"
        >
          Pending
        </StatusPill>
      </span>
    );
  }

  if (isApproved) {
    return (
      <span
        className={pillWrapperClass}
        {...inspectorProps(inspectorRegistry["PIL-APR"])}
      >
        <HoverTooltip label="Unapprove" placement="left" showDelayMs={500}>
          <button
            type="button"
            className={cn(
              statusPillVariants({ variant: "success" }),
              actionPillClass,
              "hover:bg-success-dark",
            )}
            onClick={onUnapprove}
          >
            <PillIcon>
              <MaterialIcon name="check" className="text-white" filled size={12} />
            </PillIcon>
            Approved
          </button>
        </HoverTooltip>
      </span>
    );
  }

  return (
    <span
      className={pillWrapperClass}
      {...inspectorProps(inspectorRegistry["PIL-PND"])}
    >
      <HoverTooltip
        label={
          hasAlerts ? (
            "Resolve alerts before approving"
          ) : (
            <span>
              <span className="whitespace-nowrap">
                Approve <span className="font-semibold">{employeeName}</span>&apos;s
              </span>{" "}
              time for the Pay Period{" "}
              <span className="font-semibold whitespace-nowrap">{payPeriodRange}</span>
            </span>
          )
        }
        placement="left"
        tooltipClassName="max-w-[300px] px-2.5 py-1.5 text-left text-xs leading-4 font-normal normal-case"
      >
        <button
          type="button"
          className={cn(
            statusPillVariants({ variant: "neutral" }),
            actionPillClass,
            !hasAlerts &&
              "hover:border-subtle hover:bg-surface-muted-hover hover:text-ink",
            hasAlerts && "opacity-50",
          )}
          onClick={() => {
            if (hasAlerts) {
              onClearAlerts?.();
              return;
            }

            onApprove?.();
          }}
        >
          Approve?
        </button>
      </HoverTooltip>
    </span>
  );
}
