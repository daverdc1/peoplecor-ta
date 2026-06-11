import {
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type TooltipPlacement = "top" | "left";

type TooltipPortalProps = {
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  placement?: TooltipPlacement;
  show: boolean;
};

const placementClassNames: Record<TooltipPlacement, string> = {
  top: "-translate-x-1/2 -translate-y-full",
  left: "-translate-x-full -translate-y-1/2",
};

export function TooltipPortal({
  anchorRef,
  children,
  className,
  placement = "top",
  show,
}: TooltipPortalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!show || !anchorRef.current) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();

      if (placement === "left") {
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.left - 8,
        });
        return;
      }

      setPosition({
        top: rect.top - 2,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorRef, placement, show]);

  if (!show) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "tooltip-surface pointer-events-none fixed z-[200]",
        placementClassNames[placement],
        className,
      )}
      role="tooltip"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body,
  );
}
