import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { getUsageExample } from "@/lib/design-system-catalog";
import { INSPECTOR_IGNORE_ATTR } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type UsageHighlightPanelProps = {
  highlightId: string;
  onDismiss: () => void;
  onOpenDesignSystem: () => void;
};

const PANEL_WIDTH = 300;
const PANEL_MARGIN = 16;

export function UsageHighlightPanel({
  highlightId,
  onDismiss,
  onOpenDesignSystem,
}: UsageHighlightPanelProps) {
  const example = getUsageExample(highlightId);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const x = Math.max(
      PANEL_MARGIN,
      window.innerWidth - PANEL_WIDTH - PANEL_MARGIN - 80,
    );
    const y = Math.max(PANEL_MARGIN, window.innerHeight - 260);
    setPosition({ x, y });
  }, [highlightId]);

  if (!example || !position) {
    return null;
  }

  const clampPosition = (x: number, y: number) => {
    const panelHeight = panelRef.current?.offsetHeight ?? 220;
    const maxX = window.innerWidth - PANEL_WIDTH - PANEL_MARGIN;
    const maxY = window.innerHeight - panelHeight - PANEL_MARGIN;

    return {
      x: Math.min(Math.max(PANEL_MARGIN, x), maxX),
      y: Math.min(Math.max(PANEL_MARGIN, y), maxY),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) {
      return;
    }

    setPosition(
      clampPosition(
        event.clientX - dragOffset.current.x,
        event.clientY - dragOffset.current.y,
      ),
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      ref={panelRef}
      {...{ [INSPECTOR_IGNORE_ATTR]: true }}
      className="fixed z-[90] w-[300px] rounded-sm border border-brand/30 bg-white shadow-xl"
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-brand/5 px-3 py-2">
        <div
          className={cn(
            "flex min-w-0 flex-1 cursor-grab items-center gap-2 active:cursor-grabbing",
            dragging && "cursor-grabbing",
          )}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <MaterialIcon name="drag_indicator" className="shrink-0 text-subtle" size={18} />
          <p className="m-0 truncate text-xs font-bold uppercase text-brand">
            Design system
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-subtle hover:bg-brand/10 hover:text-ink"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
        >
          <MaterialIcon name="close" size={16} />
        </button>
      </div>

      <div className="p-4">
        <p className="m-0 text-sm font-semibold text-ink">{example.title}</p>
        <p className="ds-notes m-0 mt-2 text-subtle">{example.viewHint}</p>
        <p className="ds-notes m-0 mt-2 text-muted">
          {example.location} · {example.file}
        </p>

        <button
          type="button"
          className="mt-4 w-full cursor-pointer rounded-sm border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/5"
          onClick={onOpenDesignSystem}
        >
          Back to Design System
        </button>
      </div>
    </div>
  );
}
