import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import type { InspectorEntry } from "@/lib/inspector-registry";
import {
  getDesignSystemSectionForInspectorCode,
  getInspectorParent,
} from "@/lib/inspector-registry";
import { getColorTokenUsagesForElement } from "@/lib/inspector-color-tokens";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import {
  getChildInspectorComponents,
  INSPECTOR_IGNORE_ATTR,
} from "@/lib/inspector";
import { cn } from "@/lib/utils";

type InspectorPanelProps = {
  canGoBack: boolean;
  onClose: () => void;
  onChildComponentHover: (elements: HTMLElement[]) => void;
  onColorTokenHover: (elements: HTMLElement[]) => void;
  onGoBack: () => void;
  onOpenDesignSystemSection: (sectionId: string) => void;
  onSelectInspectorCode: (code: string) => void;
  preview: InspectorEntry | null;
  target: InspectorEntry | null;
  targetElement: HTMLElement | null;
};

const PANEL_DEFAULT_WIDTH = 280;
const PANEL_DEFAULT_HEIGHT = 320;
const PANEL_MIN_WIDTH = 160;
const PANEL_MIN_HEIGHT = 80;
const PANEL_MARGIN = 16;

export function InspectorPanel({
  canGoBack,
  onClose,
  onChildComponentHover,
  onColorTokenHover,
  onGoBack,
  onOpenDesignSystemSection,
  onSelectInspectorCode,
  preview,
  target,
  targetElement,
}: InspectorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [position, setPosition] = useState({ x: PANEL_MARGIN, y: PANEL_MARGIN });
  const [size, setSize] = useState({
    width: PANEL_DEFAULT_WIDTH,
    height: PANEL_DEFAULT_HEIGHT,
  });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [colorsExpanded, setColorsExpanded] = useState(false);
  const [childrenExpanded, setChildrenExpanded] = useState(false);
  const [hoveredColorToken, setHoveredColorToken] = useState<string | null>(null);

  const displayTarget = target ?? preview;
  const isLoadingDetails = Boolean(displayTarget && !targetElement);
  const parent = displayTarget ? getInspectorParent(displayTarget) : undefined;
  const designSystemSection = displayTarget
    ? getDesignSystemSectionForInspectorCode(displayTarget.code)
    : undefined;
  const colorTokenUsages = useMemo(
    () => getColorTokenUsagesForElement(targetElement),
    [targetElement],
  );
  const childComponents = useMemo(
    () => getChildInspectorComponents(targetElement, displayTarget?.code),
    [displayTarget?.code, targetElement],
  );

  useEffect(() => {
    setPosition({
      x: PANEL_MARGIN,
      y: Math.max(PANEL_MARGIN, window.innerHeight - PANEL_DEFAULT_HEIGHT - PANEL_MARGIN),
    });
  }, []);

  useEffect(() => {
    setCopied(false);
    setColorsExpanded(false);
    setChildrenExpanded(false);
    setHoveredColorToken(null);
    onColorTokenHover([]);
    onChildComponentHover([]);
  }, [displayTarget?.code, onChildComponentHover, onColorTokenHover]);

  useEffect(() => {
    return () => {
      onColorTokenHover([]);
      onChildComponentHover([]);
    };
  }, [onChildComponentHover, onColorTokenHover]);

  const clampPosition = (x: number, y: number, panelWidth = size.width, panelHeight = size.height) => {
    const maxX = window.innerWidth - panelWidth - PANEL_MARGIN;
    const maxY = window.innerHeight - panelHeight - PANEL_MARGIN;

    return {
      x: Math.min(Math.max(PANEL_MARGIN, x), maxX),
      y: Math.min(Math.max(PANEL_MARGIN, y), maxY),
    };
  };

  const clampSize = (width: number, height: number) => ({
    width: Math.min(
      Math.max(PANEL_MIN_WIDTH, width),
      window.innerWidth - PANEL_MARGIN * 2,
    ),
    height: Math.min(
      Math.max(PANEL_MIN_HEIGHT, height),
      window.innerHeight - PANEL_MARGIN * 2,
    ),
  });

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

  const handleResizePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    resizeStart.current = {
      x: event.clientX,
      y: event.clientY,
      width: size.width,
      height: size.height,
    };
    setResizing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleResizePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!resizing) {
      return;
    }

    const nextSize = clampSize(
      resizeStart.current.width + (event.clientX - resizeStart.current.x),
      resizeStart.current.height + (event.clientY - resizeStart.current.y),
    );

    setSize(nextSize);
    setPosition((current) => clampPosition(current.x, current.y, nextSize.width, nextSize.height));
  };

  const handleResizePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setResizing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const copyName = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleColorTokenEnter = (tokenName: string, elements: HTMLElement[]) => {
    setHoveredColorToken(tokenName);
    onColorTokenHover(elements);
  };

  const handleColorTokenLeave = () => {
    setHoveredColorToken(null);
    onColorTokenHover([]);
  };

  const handleChildEnter = (element: HTMLElement) => {
    onChildComponentHover([element]);
  };

  const handleChildLeave = () => {
    onChildComponentHover([]);
  };

  return (
    <div
      ref={panelRef}
      {...{ [INSPECTOR_IGNORE_ATTR]: true }}
      className="inspector-panel fixed z-[110] flex flex-col rounded-sm border border-white/10 shadow-xl"
      style={{ width: size.width, height: size.height, left: position.x, top: position.y }}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
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
          <MaterialIcon name="drag_indicator" className="shrink-0 text-white/50" size={18} />
          <p className="inspector-text m-0 text-white/50">Inspector</p>
        </div>
        <button
          type="button"
          aria-label="Close inspector"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-white/50 hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          <MaterialIcon name="close" size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {displayTarget ? (
          <>
            <div className="px-4 pt-4">
              {parent ? (
                <button
                  type="button"
                  className="inspector-text group mb-3 flex w-fit cursor-pointer items-center gap-1 text-left text-inspector-on-dark"
                  onClick={() => onSelectInspectorCode(parent.code)}
                >
                  <MaterialIcon
                    name="subdirectory_arrow_left"
                    className="shrink-0 rotate-90"
                    size={14}
                  />
                  <span className="group-hover:underline">{parent.name}</span>
                </button>
              ) : (
                <p className="inspector-text mb-3 m-0 text-white/50">No parent component</p>
              )}
            </div>

            <div className="sticky top-0 z-10 flex w-full items-center gap-2 bg-[#1e2125] px-4 py-2">
              <p className="inspector-text m-0 min-w-0 flex-1 text-[13px] font-bold text-white/80">
                {displayTarget.name}
              </p>

              <HoverTooltip label="copy component name">
                <button
                  type="button"
                  aria-label={copied ? "Copied!" : `Copy ${displayTarget.name}`}
                  className="flex shrink-0 cursor-pointer items-center justify-center text-inspector-on-dark hover:text-white"
                  onClick={() => copyName(displayTarget.name)}
                >
                  <MaterialIcon
                    name={copied ? "check" : "content_copy"}
                    className="shrink-0"
                    size={12}
                  />
                </button>
              </HoverTooltip>

              {designSystemSection ? (
                <HoverTooltip label="View Source Component">
                  <button
                    type="button"
                    aria-label="View Source Component"
                    className="flex shrink-0 cursor-pointer items-center justify-center text-inspector-on-dark hover:text-white"
                    onClick={() => onOpenDesignSystemSection(designSystemSection)}
                  >
                    <MaterialIcon name="north_east" className="shrink-0" size={14} />
                  </button>
                </HoverTooltip>
              ) : null}
            </div>

            <div className="px-4 pb-4">
              <div className="mt-3">
                <button
                  type="button"
                  aria-expanded={colorsExpanded}
                  className="inspector-text flex w-full cursor-pointer items-center justify-between gap-2 text-left text-white/80"
                  onClick={() => setColorsExpanded((current) => !current)}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    Color tokens
                    {isLoadingDetails ? (
                      <MaterialIcon
                        name="progress_activity"
                        className="animate-spin text-white/50"
                        size={14}
                      />
                    ) : (
                      <span>({colorTokenUsages.length})</span>
                    )}
                  </span>
                  <MaterialIcon
                    name={colorsExpanded ? "expand_less" : "expand_more"}
                    className="shrink-0 text-white/50"
                    size={16}
                  />
                </button>

                {colorsExpanded ? (
                  <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
                    {isLoadingDetails ? null : colorTokenUsages.length > 0 ? (
                      colorTokenUsages.map((usage) => (
                        <li
                          key={usage.token.name}
                          onMouseEnter={() =>
                            handleColorTokenEnter(usage.token.name, usage.elements)
                          }
                          onMouseLeave={handleColorTokenLeave}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "size-6 shrink-0 rounded-sm border-2",
                                hoveredColorToken === usage.token.name
                                  ? "border-yellow-400"
                                  : "border-white/10",
                              )}
                              style={{ backgroundColor: usage.token.value }}
                            />
                            <span className="inspector-text m-0 text-white/80">
                              {usage.token.name}
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="inspector-text text-white/50">No color tokens detected</li>
                    )}
                  </ul>
                ) : null}
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  aria-expanded={childrenExpanded}
                  className="inspector-text flex w-full cursor-pointer items-center justify-between gap-2 text-left text-white/80"
                  onClick={() => setChildrenExpanded((current) => !current)}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    Child components
                    {isLoadingDetails ? (
                      <MaterialIcon
                        name="progress_activity"
                        className="animate-spin text-white/50"
                        size={14}
                      />
                    ) : (
                      <span>({childComponents.length})</span>
                    )}
                  </span>
                  <MaterialIcon
                    name={childrenExpanded ? "expand_less" : "expand_more"}
                    className="shrink-0 text-white/50"
                    size={16}
                  />
                </button>

                {childrenExpanded ? (
                  <ul className="m-0 mt-2 flex list-none flex-col gap-0.5 p-0">
                    {isLoadingDetails ? null : childComponents.length > 0 ? (
                      childComponents.map(({ entry, element }) => (
                        <li
                          key={entry.code}
                          onMouseEnter={() => handleChildEnter(element)}
                          onMouseLeave={handleChildLeave}
                        >
                          <button
                            type="button"
                            className="inspector-text w-full cursor-pointer py-0.5 text-left text-inspector-on-dark hover:underline"
                            onClick={() => onSelectInspectorCode(entry.code)}
                          >
                            {entry.name}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="inspector-text text-white/50">No child components</li>
                    )}
                  </ul>
                ) : null}
              </div>

              {canGoBack ? (
                <button
                  type="button"
                  className="inspector-text mt-4 w-fit cursor-pointer text-left text-inspector-on-dark hover:underline"
                  onClick={onGoBack}
                >
                  Go back →
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="inspector-text m-0 p-4 text-white/50">
            Hover to preview. Click to select.
          </p>
        )}
      </div>

      <div
        aria-hidden
        className={cn(
          "absolute right-0 bottom-0 flex size-4 cursor-nwse-resize items-end justify-end p-0.5 text-white/30 hover:text-white/60",
          resizing && "text-white/60",
        )}
        onPointerCancel={handleResizePointerUp}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      >
        <MaterialIcon name="south_east" size={12} />
      </div>
    </div>
  );
}
