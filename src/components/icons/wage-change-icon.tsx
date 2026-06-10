import { cn } from "@/lib/utils";
import type { WageChange } from "@/data/employees";

type WageChangeIconProps = {
  type: WageChange["type"];
  className?: string;
  size?: number;
};

export function WageChangeIcon({
  type,
  className,
  size = 16,
}: WageChangeIconProps) {
  const isIncrease = type === "increase";

  return (
    <svg
      aria-hidden
      className={cn(
        "shrink-0",
        isIncrease ? "text-success-dark" : "text-danger-text",
        className,
      )}
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
    >
      {isIncrease ? (
        <path
          d="M4.5 11.5L11.5 4.5M11.5 4.5H6.25M11.5 4.5V9.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      ) : (
        <path
          d="M4.5 4.5L11.5 11.5M11.5 11.5H6.25M11.5 11.5V6.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}
