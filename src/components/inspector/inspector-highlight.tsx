import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type InspectorHighlightProps = {
  target: HTMLElement | null;
  variant: "active" | "selected" | "token";
};

const OUTLINE_OFFSET = 2;

export function InspectorHighlight({ target, variant }: InspectorHighlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }

    const update = () => setRect(target.getBoundingClientRect());
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(target);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  if (!rect) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed z-[105] rounded-[2px] border-2",
        variant === "active" && "border-inspector/50",
        variant === "selected" && "border-inspector",
        variant === "token" && "border-yellow-400",
      )}
      style={{
        top: rect.top - OUTLINE_OFFSET,
        left: rect.left - OUTLINE_OFFSET,
        width: rect.width + OUTLINE_OFFSET * 2,
        height: rect.height + OUTLINE_OFFSET * 2,
        boxShadow:
          variant === "selected"
            ? "0 0 0 4px color-mix(in srgb, var(--color-inspector) 20%, transparent)"
            : undefined,
      }}
    />,
    document.body,
  );
}
