import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

const siteNameButtonClass =
  "flex items-center gap-1 rounded-sm px-1.5 py-1.5 text-white transition-colors hover:bg-white/10";

function StatLabel({ children }: { children: ReactNode }) {
  return (
    <p className="py-0.5 text-[11px] font-bold uppercase leading-[14px] text-label">
      {children}
    </p>
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
  gap?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center", gap, className)}>
      <StatLabel>{label}</StatLabel>
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
    <div className="relative flex h-[60px] items-center justify-between bg-stats px-6 text-white">
      <div className="flex items-center gap-6">
        <StatColumn label="Site Name">
          <button type="button" className={cn(siteNameButtonClass, "text-lg leading-5")}>
            XYZ Dairy
            <MaterialIcon name="keyboard_arrow_down" size={20} />
          </button>
        </StatColumn>

        <StatColumn label="Site Manager">
          <p className="text-lg leading-5">Jimmy Johnson</p>
        </StatColumn>

        <StatColumn label="Smart Clock" gap="gap-0.5">
          <button
            type="button"
            className="flex size-[28px] shrink-0 items-center justify-center rounded-pill bg-success p-0 transition-colors hover:bg-success-pill-hover"
          >
            <MaterialIcon name="smartphone" className="text-white" size={16} />
          </button>
        </StatColumn>
      </div>

      <StatColumn
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        gap="gap-1"
        label="Performance Notes"
      >
        <div className="flex items-center gap-2 text-base leading-6">
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
              className="text-danger-menu"
              filled
              size={16}
            />
            5
          </span>
        </div>
      </StatColumn>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <StatColumn gap="gap-0.5" label="Alerts">
            <button
              type="button"
              className="flex items-center gap-1 rounded-pill bg-stats-badge px-3 py-1 transition-colors hover:bg-stats-badge-hover"
            >
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                <MaterialIcon
                  name="warning"
                  className="text-danger-menu"
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
              <span className="text-sm leading-5 font-semibold">12</span>
            </button>
          </StatColumn>

          <StatColumn gap="gap-0.5" label="Current Employee Activity">
            <div className="flex items-stretch">
              <button
                type="button"
                className="flex items-center gap-1 rounded-l-[14px] border-r border-label/60 bg-stats-badge px-3 py-1.5 transition-colors hover:bg-stats-badge-hover"
              >
                <ActivityDot color="green" />
                <span className="text-xs leading-4 font-semibold">IN:78</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-r-[14px] bg-stats-badge px-3 py-1.5 transition-colors hover:bg-stats-badge-hover"
              >
                <ActivityDot color="orange" />
                <span className="text-xs leading-4 font-semibold">OUT:37</span>
              </button>
            </div>
          </StatColumn>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-[28px] leading-8 font-bold tracking-[-0.42px]">39</p>
          <StatLabel>Current</StatLabel>
        </div>
      </div>
    </div>
  );
}
