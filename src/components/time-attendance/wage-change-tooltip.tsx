import { useRef, useState, type ReactNode } from "react";
import { WageChangeIcon } from "@/components/icons/wage-change-icon";
import { TooltipPortal } from "@/components/ui/tooltip";
import type { WageChange } from "@/data/employees";
import { cn } from "@/lib/utils";

function TooltipMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 text-xs leading-4 text-white">
      <span className="w-[115px] shrink-0 font-semibold">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function WageChangeTooltipContent({ wageChange }: { wageChange: WageChange }) {
  const isIncrease = wageChange.type === "increase";
  const title = isIncrease ? "Wage increase" : "Wage decrease";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <p className="m-0 text-base leading-6 font-semibold text-white">
          {title}
        </p>
        <WageChangeIcon
          className={cn(
            "translate-y-[2px]",
            isIncrease ? "text-success" : "text-danger",
          )}
          size={16}
          type={wageChange.type}
        />
      </div>

      <div className="flex items-start gap-2">
        <div className="shrink-0 text-label">
          <p className="m-0 text-sm leading-5 font-semibold">
            {wageChange.oldWage}
          </p>
          <p className="m-0 text-[11px] leading-3">Old wage</p>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col items-center pt-1">
          <div className="absolute top-3 right-0 left-0 h-px bg-label" />
          <div className="relative z-10 flex h-4 items-center rounded-pill border border-label bg-ink px-1.5">
            <span
              className={cn(
                "text-xs leading-4 font-semibold",
                isIncrease ? "text-success" : "text-danger",
              )}
            >
              {wageChange.delta}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="m-0 text-sm leading-5 font-semibold text-white">
            {wageChange.newWage}
          </p>
          <p className="m-0 text-[11px] leading-3 text-label">New wage</p>
        </div>
      </div>

      <div className="py-2">
        <div className="h-px bg-stats" />
      </div>

      <TooltipMetaRow label="Effective on" value={wageChange.effectiveOn} />
      <TooltipMetaRow label="Changed by" value={wageChange.changedBy} />
      <TooltipMetaRow label="Changed on" value={wageChange.changedOn} />
    </div>
  );
}

export function WageChangeTooltip({
  children,
  wageChange,
}: {
  children: ReactNode;
  wageChange: WageChange;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      ref={anchorRef}
      className="inline-flex"
      onBlur={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <TooltipPortal
        anchorRef={anchorRef}
        className="w-[224px] p-2"
        show={showTooltip}
      >
        <WageChangeTooltipContent wageChange={wageChange} />
      </TooltipPortal>
    </span>
  );
}
