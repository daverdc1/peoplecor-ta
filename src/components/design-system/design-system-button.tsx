import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DesignSystemButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export const DesignSystemButton = forwardRef<
  HTMLButtonElement,
  DesignSystemButtonProps
>(({ className, variant = "outline", type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-6 cursor-pointer items-center justify-center gap-1.5 rounded-none border px-3 font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50",
      variant === "outline"
        ? "border-border bg-white text-ink hover:border-ink hover:bg-page"
        : "border-ink bg-ink text-white hover:bg-subtle",
      className,
    )}
    {...props}
  />
));

DesignSystemButton.displayName = "DesignSystemButton";
