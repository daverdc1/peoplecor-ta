import { useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <span className="inline-flex items-center gap-1">
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
    banner: "bg-danger text-white",
    switch: "data-[state=checked]:bg-danger",
    switchCheckIcon: "text-danger",
    toggle: "border-danger bg-danger/10",
  },
  some: {
    banner: "bg-warning text-white",
    switch: "data-[state=checked]:bg-warning",
    switchCheckIcon: "text-[#9a6410]",
    toggle: "border-warning bg-warning-muted",
  },
  all: {
    banner: "bg-success-dark text-white",
    switch: "data-[state=checked]:bg-success",
    switchCheckIcon: "text-success",
    toggle: "border-success bg-success-muted",
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={payPeriodId}
          onValueChange={(value) =>
            setPayPeriodId(value as (typeof payPeriods)[number]["id"])
          }
        >
          <SelectTrigger className="h-9 w-[360px] border-2 transition-colors hover:border-brand hover:bg-brand/5">
            <PayPeriodLabel range={selectedPayPeriod.range} />
          </SelectTrigger>
          <SelectContent>
            {payPeriods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                <PayPeriodLabel range={period.range} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 text-base text-ink">
          <MaterialIcon name="paid" className="text-success" size={24} />
          <span className="inline-flex items-center gap-1">
            <span>Payday</span>
            <span className="font-semibold">{selectedPayPeriod.payday}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!prepMode ? (
          <Button
            className="border-0 bg-warning text-ink hover:bg-warning/90 disabled:bg-surface-muted disabled:text-muted disabled:opacity-100"
            disabled={!allEmployeesApproved}
            type="button"
          >
            <MaterialIcon name="money_bag" size={16} />
            Go to Payroll
          </Button>
        ) : null}
        <div className="flex h-8 overflow-hidden rounded-sm">
          <div
            className={cn(
              "flex items-center overflow-hidden text-sm font-semibold whitespace-nowrap",
              progressStyles.banner,
              prepMode ? "max-w-72 px-3 opacity-100" : "max-w-0 px-0 opacity-0",
            )}
          >
            {approvedCount}/{totalEmployeeCount} approved
          </div>
          <div
            className={cn(
              "flex items-center gap-2 border px-3",
              prepMode
                ? progressStyles.toggle
                : "rounded-sm border-border bg-white",
            )}
          >
            <Switch
              checkIconClassName={prepMode ? progressStyles.switchCheckIcon : undefined}
              checked={prepMode}
              className={prepMode ? progressStyles.switch : undefined}
              onCheckedChange={onPrepModeChange}
            />
            <span className="text-xs font-bold uppercase text-ink">
              Prep for Payroll
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
