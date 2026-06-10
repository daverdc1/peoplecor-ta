import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-transparent disabled:bg-surface-muted disabled:text-muted disabled:opacity-100",
  {
    variants: {
      variant: {
        default: "bg-brand-dark text-white hover:bg-brand",
        outline:
          "border border-white bg-transparent text-white hover:bg-white/10",
        brandOutline:
          "border border-brand bg-white text-brand hover:bg-brand-subtle",
        ghost: "bg-transparent hover:bg-surface-muted",
        success:
          "border border-success bg-success-muted text-ink hover:bg-success/15",
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
