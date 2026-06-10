import { useState } from "react";
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
import { cn } from "@/lib/utils";

const payPeriods = [
  {
    id: "june-1-15",
    range: "Jun 1, 2026 - Jun 15, 2026",
    payday: "Friday, Jun 19",
  },
  {
    id: "may-16-31",
    range: "May 16, 2026 - May 31, 2026",
    payday: "Friday, Jun 5",
  },
] as const;

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
    bar: "bg-danger-dark outline-danger",
  },
  some: {
    bar: "bg-warning-dark outline-warning-border",
  },
  all: {
    bar: "bg-success-dark outline-success",
  },
} as const;

type PayPeriodToolbarProps = {
  allEmployeesApproved: boolean;
  approvedCount: number;
  prepMode: boolean;
  totalEmployeeCount: number;
  onPrepModeChange: (prepMode: boolean) => void;
};

export function PayPeriodToolbar({
  allEmployeesApproved,
  approvedCount,
  prepMode,
  totalEmployeeCount,
  onPrepModeChange,
}: PayPeriodToolbarProps) {
  const [payPeriodId, setPayPeriodId] =
    useState<(typeof payPeriods)[number]["id"]>("june-1-15");
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
      className="flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-4"
      {...inspectorProps(inspectorRegistry.PPT)}
    >
      <div className="flex flex-wrap items-center gap-3" {...inspectorProps(inspectorRegistry["PPT-PER"])}>
        <Select
          value={payPeriodId}
          onValueChange={(value) =>
            setPayPeriodId(value as (typeof payPeriods)[number]["id"])
          }
        >
          <SelectTrigger className="h-9 w-auto min-w-[340px] border-2 transition-colors hover:border-brand hover:bg-brand-subtle">
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

        <div className="flex items-center gap-2 text-base text-ink">
          <MaterialIcon name="paid" className="text-success-dark" filled size={24} />
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
                cn("pl-2 outline outline-[6px] outline-offset-0", progressStyles.bar),
            )}
          >
            {prepMode ? (
              <div className="mr-4 flex items-center gap-2 whitespace-nowrap">
                <MaterialIcon
                  name="groups"
                  className="shrink-0 text-white"
                  filled
                  size={16}
                />
                <span className="text-xs font-bold uppercase leading-4 text-white">
                  {approvedCount}/{totalEmployeeCount} employees approved
                </span>
              </div>
            ) : null}

            <label
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 rounded-sm border bg-white p-2",
                prepMode
                  ? "border-transparent"
                  : "border-border transition-colors hover:bg-page",
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
