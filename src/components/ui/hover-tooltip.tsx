import { useEffect, useRef, useState, type ReactNode } from "react";
import { TooltipPortal } from "@/components/ui/tooltip";

type HoverTooltipProps = {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onMouseLeave?: () => void;
};

export function HoverTooltip({
  children,
  disabled = false,
  label,
  onMouseLeave,
}: HoverTooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (disabled) {
      setShowTooltip(false);
    }
  }, [disabled]);

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      onBlur={() => setShowTooltip(false)}
      onFocus={() => {
        if (!disabled) {
          setShowTooltip(true);
        }
      }}
      onMouseEnter={() => {
        if (!disabled) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
        onMouseLeave?.();
      }}
    >
      {children}
      <TooltipPortal
        anchorRef={anchorRef}
        className="max-w-[220px] px-2 py-1 text-center text-xs leading-4 font-normal normal-case"
        show={showTooltip}
      >
        {label}
      </TooltipPortal>
    </span>
  );
}
