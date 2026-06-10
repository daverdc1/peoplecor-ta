import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  checkIconClassName?: string;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ checkIconClassName, className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border-input transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-success-dark data-[state=unchecked]:bg-border-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none flex size-3 items-center justify-center rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        "[&_[data-slot=check-icon]]:hidden [&_[data-slot=close-icon]]:hidden",
        "data-[state=checked]:[&_[data-slot=check-icon]]:flex",
        "data-[state=unchecked]:[&_[data-slot=close-icon]]:flex",
      )}
    >
      <span data-slot="check-icon" className="items-center justify-center">
        <MaterialIcon
          name="check"
          className={cn("text-success-dark", checkIconClassName)}
          size={8}
          weight={700}
        />
      </span>
      <span data-slot="close-icon" className="items-center justify-center">
        <MaterialIcon name="close" className="text-muted" size={8} weight={700} />
      </span>
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
