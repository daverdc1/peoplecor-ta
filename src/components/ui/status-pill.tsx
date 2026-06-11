import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const statusPillVariants = cva(
  "inline-flex h-5 shrink-0 items-center justify-center gap-1 rounded-pill border px-2 text-[10px] font-bold uppercase leading-4",
  {
    variants: {
      variant: {
        success: "border-transparent bg-success-text text-white",
        warning:
          "border-warning/60 bg-warning/25 text-warning-text",
        neutral: "border-border bg-surface-muted text-subtle",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type StatusPillProps = {
  children: ReactNode;
  icon?: ReactNode;
} & VariantProps<typeof statusPillVariants> &
  Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export function StatusPill({
  children,
  className,
  icon,
  variant,
  ...props
}: StatusPillProps) {
  return (
    <span className={cn(statusPillVariants({ variant }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
