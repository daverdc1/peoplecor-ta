import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-100",
  {
    variants: {
      variant: {
        default:
          "bg-brand-dark text-white hover:bg-brand disabled:border-transparent disabled:bg-surface-muted disabled:text-muted",
        outline:
          "border border-white bg-transparent text-white hover:bg-white/10 disabled:border-white/30 disabled:bg-transparent disabled:text-muted",
        brandOutline:
          "border border-brand-dark bg-white text-brand-dark hover:bg-brand-subtle disabled:border-border disabled:bg-white disabled:text-muted",
        success:
          "border-0 bg-success-text text-white hover:bg-success-dark disabled:border-transparent disabled:bg-surface-muted disabled:text-muted",
        warning:
          "border-0 bg-warning-dark text-white hover:bg-warning disabled:border-transparent disabled:bg-surface-muted disabled:text-muted",
        ghost:
          "bg-transparent hover:bg-surface-muted disabled:bg-transparent disabled:text-muted",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-xs uppercase",
        sm: "h-7 px-2 text-xs",
        lg: "h-9 px-4",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
