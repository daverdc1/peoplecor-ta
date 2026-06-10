import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-border-input bg-white transition-colors before:absolute before:-inset-2 before:content-[''] hover:enabled:data-[state=unchecked]:border-subtle group-hover:enabled:data-[state=unchecked]:border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-dark data-[state=checked]:bg-brand-dark data-[state=checked]:text-white data-[state=checked]:hover:enabled:border-brand data-[state=checked]:group-hover:enabled:border-brand data-[state=indeterminate]:border-brand-dark data-[state=indeterminate]:bg-brand-dark data-[state=indeterminate]:text-white data-[state=indeterminate]:hover:enabled:border-brand data-[state=indeterminate]:group-hover:enabled:border-brand",
      "[&_[data-slot=check-icon]]:hidden [&_[data-slot=dash-icon]]:hidden",
      "data-[state=checked]:[&_[data-slot=check-icon]]:flex data-[state=checked]:[&_[data-slot=dash-icon]]:hidden",
      "data-[state=indeterminate]:[&_[data-slot=check-icon]]:hidden data-[state=indeterminate]:[&_[data-slot=dash-icon]]:flex",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="absolute inset-0 flex items-center justify-center text-white">
      <span data-slot="check-icon" className="flex items-center justify-center">
        <MaterialIcon name="check" size={12} weight={700} />
      </span>
      <span data-slot="dash-icon" className="flex items-center justify-center">
        <MaterialIcon name="remove" size={12} weight={700} />
      </span>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
