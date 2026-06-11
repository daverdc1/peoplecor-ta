import { useEffect, useRef, useState, type ReactNode } from "react";
import { TooltipPortal } from "@/components/ui/tooltip";

type HoverTooltipProps = {
  children: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  onMouseLeave?: () => void;
  placement?: "top" | "left";
  showDelayMs?: number;
  tooltipClassName?: string;
};

export function HoverTooltip({
  children,
  disabled = false,
  label,
  onMouseLeave,
  placement = "top",
  showDelayMs = 0,
  tooltipClassName,
}: HoverTooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const delayTimeoutRef = useRef<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const clearDelayTimeout = () => {
    if (delayTimeoutRef.current !== null) {
      window.clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
  };

  const hideTooltip = () => {
    clearDelayTimeout();
    setShowTooltip(false);
  };

  useEffect(() => {
    if (disabled) {
      hideTooltip();
    }
  }, [disabled]);

  useEffect(() => {
    return () => {
      clearDelayTimeout();
    };
  }, []);

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      onBlur={hideTooltip}
      onFocus={() => {
        if (!disabled) {
          clearDelayTimeout();
          setShowTooltip(true);
        }
      }}
      onMouseEnter={() => {
        if (disabled) {
          return;
        }

        clearDelayTimeout();

        if (showDelayMs > 0) {
          delayTimeoutRef.current = window.setTimeout(() => {
            setShowTooltip(true);
            delayTimeoutRef.current = null;
          }, showDelayMs);
          return;
        }

        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        hideTooltip();
        onMouseLeave?.();
      }}
    >
      {children}
      <TooltipPortal
        anchorRef={anchorRef}
        className={tooltipClassName ?? "max-w-[220px] px-2 py-1 text-center text-xs leading-4 font-normal normal-case"}
        placement={placement}
        show={showTooltip}
      >
        {label}
      </TooltipPortal>
    </span>
  );
}
