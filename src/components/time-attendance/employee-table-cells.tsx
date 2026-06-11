import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { WageChangeIcon } from "@/components/icons/wage-change-icon";
import { HoverTooltip, TruncatedText } from "@/components/ui/truncated-text";
import { WageChangeTooltip } from "@/components/time-attendance/wage-change-tooltip";
import type { DeductionCell, MoneyCell } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

/** 10.5px labels need extra line-height so truncate does not clip descenders (g, y, p). */
export const cellDetailClassName = "text-[10.5px] leading-4 text-muted";

export function TableCellCenter({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[51px] w-full min-w-0 flex-col items-center justify-center px-0.5">
      {children}
    </div>
  );
}

export function MoneyValue({ cell }: { cell?: MoneyCell }) {
  if (!cell) {
    return <span className="text-sm text-muted">--</span>;
  }

  if (!cell.wageChange) {
    return (
      <>
        <p className="m-0 whitespace-nowrap text-sm leading-5 text-ink">
          {cell.value}
        </p>
        {cell.detail ? (
          <TruncatedText className={cellDetailClassName}>{cell.detail}</TruncatedText>
        ) : null}
      </>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 text-center">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
        <span aria-hidden />
        <p className="col-start-2 m-0 whitespace-nowrap text-sm leading-5 text-ink">
          {cell.value}
        </p>
        <span
          className="col-start-3 flex min-w-4 items-center justify-start pl-0.5"
          {...inspectorProps(inspectorRegistry["TBL-TIP-WAGE"])}
        >
          <WageChangeTooltip wageChange={cell.wageChange}>
            <button
              type="button"
              aria-label={
                cell.wageChange.type === "increase"
                  ? "Wage increase"
                  : "Wage decrease"
              }
              className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none"
            >
              <WageChangeIcon size={14} type={cell.wageChange.type} />
            </button>
          </WageChangeTooltip>
        </span>
      </div>
      {cell.detail ? (
        <TruncatedText className={cellDetailClassName}>{cell.detail}</TruncatedText>
      ) : null}
    </div>
  );
}

function RecurringIcon() {
  return (
    <HoverTooltip label="Recurring">
      <span
        aria-label="Recurring"
        className="inline-flex shrink-0 cursor-pointer"
        {...inspectorProps(inspectorRegistry["TBL-TIP-REC"])}
      >
        <MaterialIcon
          name="autorenew"
          className="text-muted transition-colors hover:text-ink"
          size={12}
        />
      </span>
    </HoverTooltip>
  );
}

function DeductionValue({
  item,
  tone,
}: {
  item: DeductionCell;
  tone: "success" | "danger";
}) {
  const showRecurring = item.recurring ?? true;

  return (
    <div className="mx-auto w-full min-w-0 text-center">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
        <span aria-hidden />
        <p
          className={cn(
            "col-start-2 m-0 whitespace-nowrap text-sm leading-5 font-semibold",
            tone === "success" ? "text-success-text" : "text-danger-text",
          )}
        >
          {item.value}
        </p>
        <span className="col-start-3 flex min-w-3 items-center justify-start pl-0.5">
          {showRecurring ? <RecurringIcon /> : null}
        </span>
      </div>
      <TruncatedText className={cellDetailClassName}>{item.label}</TruncatedText>
    </div>
  );
}

export function DeductionList({
  items,
  tone,
}: {
  items?: DeductionCell[];
  tone: "success" | "danger";
}) {
  if (!items?.length) {
    return <span className="text-sm text-muted">--</span>;
  }

  return (
    <div>
      {items.map((item) => (
        <DeductionValue key={`${item.label}-${item.value}`} item={item} tone={tone} />
      ))}
    </div>
  );
}
