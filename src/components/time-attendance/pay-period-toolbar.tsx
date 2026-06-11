import { useEffect, useRef, useState } from "react";
import {
  APP_HEADER_HEIGHT_PX,
  useAppHeaderVisible,
} from "@/hooks/use-app-header-visible";
import { GoToPayrollIcon } from "@/components/icons/go-to-payroll-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HoverTooltip } from "@/components/ui/truncated-text";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { payPeriods, type PayPeriodId } from "@/data/pay-periods";
import { cn } from "@/lib/utils";

function PayPeriodLabel({ range }: { range: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap">
      <span>Pay Period:</span>
      <span className="font-bold">{range}</span>
    </span>
  );
}

type ApprovalProgress = "none" | "some" | "all";

function getApprovalProgress(
  approvedCount: number,
  totalEmployeeCount: number,
): ApprovalProgress {
  if (totalEmployeeCount === 0 || approvedCount === 0) {
    return "none";
  }

  if (approvedCount >= totalEmployeeCount) {
    return "all";
  }

  return "some";
}

const approvalProgressStyles = {
  none: {
    fill: "bg-danger-dark",
    ring: "outline outline-[6px] outline-offset-0 outline-danger/30",
  },
  some: {
    fill: "bg-warning-dark",
    ring: "outline outline-[6px] outline-offset-0 outline-warning/35",
  },
  all: {
    fill: "bg-success-dark",
    ring: "outline outline-[6px] outline-offset-0 outline-success/35",
  },
} as const;

type PayPeriodToolbarProps = {
  allEmployeesApproved: boolean;
  approvedCount: number;
  payPeriodId: PayPeriodId;
  prepMode: boolean;
  totalEmployeeCount: number;
  onPayPeriodChange: (payPeriodId: PayPeriodId) => void;
  onPrepModeChange: (prepMode: boolean) => void;
};

export function PayPeriodToolbar({
  allEmployeesApproved,
  approvedCount,
  payPeriodId,
  prepMode,
  totalEmployeeCount,
  onPayPeriodChange,
  onPrepModeChange,
}: PayPeriodToolbarProps) {
  const headerVisible = useAppHeaderVisible();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const toolbar = toolbarRef.current;

    if (!prepMode || !toolbar) {
      setIsStuck(false);
      return;
    }

    const updateStuck = () => {
      const stickyTop = headerVisible ? APP_HEADER_HEIGHT_PX : 0;
      setIsStuck(toolbar.getBoundingClientRect().top <= stickyTop);
    };

    updateStuck();
    window.addEventListener("scroll", updateStuck, { passive: true });
    window.addEventListener("resize", updateStuck);

    return () => {
      window.removeEventListener("scroll", updateStuck);
      window.removeEventListener("resize", updateStuck);
    };
  }, [headerVisible, prepMode]);
  const selectedPayPeriod =
    payPeriods.find((period) => period.id === payPeriodId) ?? payPeriods[0];
  const approvalProgress = getApprovalProgress(
    approvedCount,
    totalEmployeeCount,
  );
  const progressStyles = approvalProgressStyles[approvalProgress];
  const pendingApprovalCount = totalEmployeeCount - approvedCount;
  const goToPayrollTooltipLabel =
    pendingApprovalCount === 1
      ? "1 employee still needs approval"
      : `${pendingApprovalCount} employees still need approval`;

  return (
    <div
      ref={toolbarRef}
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-4 transition-shadow",
        prepMode &&
          cn(
            "sticky z-40 bg-white transition-[top,box-shadow] duration-200 ease-in-out",
            headerVisible ? "top-12" : "top-0",
          ),
        isStuck && "border-b border-border shadow-[0_4px_12px_rgba(14,24,33,0.12)]",
      )}
      {...inspectorProps(inspectorRegistry.PPT)}
    >
      <div className="flex flex-wrap items-center gap-3" {...inspectorProps(inspectorRegistry["PPT-PER"])}>
        <Select
          value={payPeriodId}
          onValueChange={(value) => onPayPeriodChange(value as PayPeriodId)}
        >
          <SelectTrigger className="h-9 w-auto min-w-[340px] border-2">
            <PayPeriodLabel range={selectedPayPeriod.range} />
          </SelectTrigger>
          <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
            {payPeriods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                <PayPeriodLabel range={period.range} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-sm leading-5 text-ink">
          <MaterialIcon name="paid" className="text-success-dark" filled size={20} />
          <span className="inline-flex items-center gap-1">
            <span>Payday</span>
            <span className="font-semibold">{selectedPayPeriod.payday}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="relative shrink-0">
          {!prepMode ? (
            <div className="absolute top-1/2 right-full mr-2 -translate-y-1/2">
              <HoverTooltip
                disabled={allEmployeesApproved}
                label={goToPayrollTooltipLabel}
              >
                <span className="inline-flex">
                  <Button
                    className="gap-1 border-0 px-2 text-xs font-bold uppercase leading-4 text-ink enabled:bg-payroll-yellow enabled:hover:bg-payroll-yellow/90 disabled:bg-surface-muted disabled:text-muted disabled:opacity-100"
                    disabled={!allEmployeesApproved}
                    type="button"
                    {...inspectorProps(inspectorRegistry["PPT-GOP"])}
                  >
                    <GoToPayrollIcon />
                    Go To Payroll
                  </Button>
                </span>
              </HoverTooltip>
            </div>
          ) : null}

          <div
            className={cn(
              "flex items-center rounded-sm",
              prepMode &&
                cn("pl-2", progressStyles.fill, progressStyles.ring),
            )}
          >
            {prepMode ? (
              <div className="mr-4 flex items-center gap-2 whitespace-nowrap">
                <MaterialIcon
                  name="groups"
                  className="shrink-0 text-white"
                  filled
                  size={18}
                />
                <span className="text-sm leading-5 text-white">
                  <span className="font-semibold">
                    {approvedCount}/{totalEmployeeCount}
                  </span>{" "}
                  <span className="font-normal">
                    <span className="hidden xl:inline">employees </span>
                    approved
                  </span>
                </span>
              </div>
            ) : null}

            <label
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 rounded-sm border bg-white",
                prepMode
                  ? "m-1 border-transparent px-1.5 py-1"
                  : "border-border p-2 transition-colors hover:bg-page",
              )}
              htmlFor="prep-for-payroll-toggle"
              {...inspectorProps(inspectorRegistry["PPT-PREP"])}
            >
            <span className="text-xs font-bold uppercase leading-4 text-ink">
              Prep for Payroll
            </span>
            <Switch
              checkIconClassName="text-ink"
              checked={prepMode}
              className={prepMode ? "data-[state=checked]:bg-ink" : undefined}
              id="prep-for-payroll-toggle"
              onCheckedChange={onPrepModeChange}
            />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
