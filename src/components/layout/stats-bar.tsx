import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { SmartClockIcon } from "@/components/icons/smart-clock-icon";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

const siteNameButtonClass =
  "flex cursor-pointer items-center gap-1 rounded-sm px-1.5 text-white transition-colors hover:bg-white/10";

function StatSubheading({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-start py-0.5">
      <p className="text-[11px] font-bold uppercase leading-[14px] text-label">
        {children}
      </p>
    </div>
  );
}

function StatColumn({
  label,
  children,
  className,
  gap = "gap-1",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  gap?: "gap-0.5" | "gap-1";
}) {
  return (
    <div className={cn("flex flex-col items-center", gap, className)}>
      <StatSubheading>{label}</StatSubheading>
      {children}
    </div>
  );
}

function ActivityDot({ color }: { color: "green" | "orange" }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <span
        className={cn(
          "size-2.5 rounded-full",
          color === "green" ? "bg-success" : "bg-[#eb925b]",
        )}
      />
    </span>
  );
}

export function StatsBar() {
  return (
    <div
      className="relative flex h-[60px] items-start justify-between bg-stats px-6 py-1 text-white"
      {...inspectorProps(inspectorRegistry.STS)}
    >
      <div className="flex h-full items-start gap-6">
        <StatColumn label="Site Name">
          <button type="button" className={cn(siteNameButtonClass, "text-[18px] leading-5")}>
            XYZ Dairy
            <MaterialIcon name="arrow_drop_down" size={20} />
          </button>
        </StatColumn>

        <StatColumn label="Site Manager">
          <p className="text-[18px] leading-5">Jimmy Johnson</p>
        </StatColumn>

        <StatColumn gap="gap-0.5" label="Smart Clock">
          <button
            type="button"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success p-0 transition-colors hover:bg-success-pill-hover"
          >
            <SmartClockIcon className="text-white" />
          </button>
        </StatColumn>
      </div>

      <StatColumn
        className="absolute top-1 left-1/2 h-12 -translate-x-1/2"
        gap="gap-0.5"
        label="Performance Notes"
      >
        <button
          type="button"
          className="flex items-center gap-2 rounded-pill px-3 py-1 text-sm font-semibold leading-5 transition-colors hover:bg-stats-badge-hover"
        >
          <span className="flex items-center gap-1">
            <MaterialIcon
              name="thumb_up"
              className="text-success"
              filled
              size={16}
            />
            23
          </span>
          <span className="flex items-center gap-1">
            <MaterialIcon
              name="thumb_down"
              className="text-danger"
              filled
              size={16}
            />
            5
          </span>
        </button>
      </StatColumn>

      <div className="flex h-12 items-center gap-6">
        <div className="flex items-center gap-3">
          <StatColumn gap="gap-0.5" label="Alerts">
            <button
              type="button"
              className="flex items-center gap-1 rounded-pill bg-stats-badge px-3 py-1 transition-colors hover:bg-stats-badge-hover"
            >
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                <MaterialIcon
                  name="warning"
                  className="text-danger"
                  filled
                  size={16}
                />
                <MaterialIcon
                  name="priority_high"
                  className="absolute mt-px text-white"
                  size={9}
                  weight={700}
                />
              </span>
              <span className="text-sm font-semibold leading-5">12</span>
            </button>
          </StatColumn>

          <StatColumn gap="gap-0.5" label="Current Employee Activity">
            <div className="flex items-stretch">
              <button
                type="button"
                className="flex items-center gap-1 rounded-l-[14px] border-r border-stats bg-stats-badge px-3 py-1.5 transition-colors hover:bg-stats-badge-hover"
              >
                <ActivityDot color="green" />
                <span className="text-xs font-semibold leading-4">IN:78</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-r-[14px] bg-stats-badge px-3 py-1.5 transition-colors hover:bg-stats-badge-hover"
              >
                <ActivityDot color="orange" />
                <span className="text-xs font-semibold leading-4">OUT:37</span>
              </button>
            </div>
          </StatColumn>
        </div>

        <div className="flex flex-col items-center justify-center whitespace-nowrap">
          <p className="text-[28px] font-bold leading-8 tracking-[-0.42px]">39</p>
          <StatSubheading>Current</StatSubheading>
        </div>
      </div>
    </div>
  );
}
