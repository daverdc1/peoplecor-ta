import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

type AlertBadgeIconProps = {
  className?: string;
  size?: number;
};

export function AlertBadgeIcon({ className, size = 16 }: AlertBadgeIconProps) {
  const exclamationSize = Math.max(8, Math.round(size * 0.5625));

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <MaterialIcon name="warning" className="text-danger" filled size={size} />
      <MaterialIcon
        name="priority_high"
        className="absolute mt-px text-white"
        size={exclamationSize}
        weight={700}
      />
    </span>
  );
}
