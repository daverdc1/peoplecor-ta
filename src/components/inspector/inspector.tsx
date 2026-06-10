import { useCallback, useEffect, useRef, useState } from "react";
import { InspectorHighlight } from "@/components/inspector/inspector-highlight";
import { InspectorPanel } from "@/components/inspector/inspector-panel";
import type { InspectorEntry } from "@/lib/inspector-registry";
import { getInspectorEntry } from "@/lib/inspector-registry";
import {
  findInspectorElement,
  getInspectorAtPoint,
  getInspectorFromElement,
  isInspectorIgnored,
} from "@/lib/inspector";

type HighlightScroll = "center" | "nearest" | false;

type InspectorProps = {
  appViewActive: boolean;
  canGoBack: boolean;
  focusInspectorCode: string | null;
  onClose: () => void;
  onFocusInspectorComplete: () => void;
  onGoBack: () => void;
  onOpenDesignSystemSection: (sectionId: string, selectedCode: string | null) => void;
  onRestoreInspectorComplete: () => void;
  restoreInspectorCode: string | null;
};

export function Inspector({
  appViewActive,
  canGoBack,
  focusInspectorCode,
  onClose,
  onFocusInspectorComplete,
  onGoBack,
  onOpenDesignSystemSection,
  onRestoreInspectorComplete,
  restoreInspectorCode,
}: InspectorProps) {
  const [hovered, setHovered] = useState<InspectorEntry | null>(null);
  const [selected, setSelected] = useState<InspectorEntry | null>(null);
  const [hoverTarget, setHoverTarget] = useState<HTMLElement | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<HTMLElement | null>(null);
  const [tokenHighlightTargets, setTokenHighlightTargets] = useState<HTMLElement[]>([]);
  const [childHighlightTargets, setChildHighlightTargets] = useState<HTMLElement[]>([]);
  const selectedRef = useRef<InspectorEntry | null>(null);
  const selectedTargetRef = useRef<HTMLElement | null>(null);

  const clearHoverHighlight = useCallback(() => {
    setHoverTarget(null);
  }, []);

  const clearSelectedHighlight = useCallback(() => {
    setSelectedTarget(null);
    selectedTargetRef.current = null;
  }, []);

  const applySelectedHighlight = useCallback(
    (element: HTMLElement | null, scroll: HighlightScroll = false) => {
      clearSelectedHighlight();

      if (!element) {
        return;
      }

      setSelectedTarget(element);
      selectedTargetRef.current = element;

      if (scroll !== false) {
        element.scrollIntoView({ behavior: "smooth", block: scroll });
      }
    },
    [clearSelectedHighlight],
  );

  const selectEntry = useCallback(
    (
      entry: InspectorEntry | null,
      element: HTMLElement | null = null,
      scroll: HighlightScroll = false,
    ) => {
      selectedRef.current = entry;
      setSelected(entry);

      if (entry) {
        const targetElement = element ?? findInspectorElement(entry.code);
        applySelectedHighlight(targetElement, scroll);
      } else {
        clearSelectedHighlight();
      }
    },
    [applySelectedHighlight, clearSelectedHighlight],
  );

  useEffect(() => {
    document.body.classList.add("inspector-mode");

    const handleMove = (event: MouseEvent) => {
      const element = document.elementFromPoint(event.clientX, event.clientY);

      if (isInspectorIgnored(element)) {
        clearHoverHighlight();
        if (!selectedRef.current) {
          setHovered(null);
        }
        return;
      }

      const { entry, target } = getInspectorAtPoint(event.clientX, event.clientY);

      if (!selectedRef.current) {
        setHovered(entry);
      }

      if (target && target !== selectedTargetRef.current) {
        setHoverTarget(target);
      } else if (!target) {
        clearHoverHighlight();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const element = event.target as Element;

      if (isInspectorIgnored(element)) {
        return;
      }

      const { entry, target } = getInspectorAtPoint(event.clientX, event.clientY);

      if (!entry || !target) {
        if (!isInspectorIgnored(element)) {
          selectEntry(null);
        }
        return;
      }

      if (event.pointerType === "touch") {
        selectEntry(entry, target, false);
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      selectEntry(entry, target, false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.body.classList.remove("inspector-mode");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      clearHoverHighlight();
      clearSelectedHighlight();
      selectedRef.current = null;
    };
  }, [clearHoverHighlight, clearSelectedHighlight, selectEntry]);

  useEffect(() => {
    if (!restoreInspectorCode || !appViewActive) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const element = findInspectorElement(restoreInspectorCode);
      const entry = element ? getInspectorFromElement(element) : null;

      if (entry && element) {
        selectEntry(entry, element, "nearest");
      }

      onRestoreInspectorComplete();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    appViewActive,
    onRestoreInspectorComplete,
    restoreInspectorCode,
    selectEntry,
  ]);

  useEffect(() => {
    if (!focusInspectorCode || appViewActive) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const element = findInspectorElement(focusInspectorCode);
      const entry =
        getInspectorEntry(focusInspectorCode) ??
        (element ? getInspectorFromElement(element) : null);

      if (entry && element) {
        selectEntry(entry, element, "center");
      }

      onFocusInspectorComplete();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    appViewActive,
    focusInspectorCode,
    onFocusInspectorComplete,
    selectEntry,
  ]);

  return (
    <>
      <InspectorHighlight target={hoverTarget} variant="active" />
      <InspectorHighlight target={selectedTarget} variant="selected" />
      {tokenHighlightTargets.map((target, index) => (
        <InspectorHighlight key={`token-${index}`} target={target} variant="token" />
      ))}
      {childHighlightTargets.map((target, index) => (
        <InspectorHighlight key={`child-${index}`} target={target} variant="active" />
      ))}
      <InspectorPanel
        canGoBack={canGoBack}
        onClose={onClose}
        onGoBack={onGoBack}
        onOpenDesignSystemSection={(sectionId) =>
          onOpenDesignSystemSection(sectionId, selected?.code ?? hovered?.code ?? null)
        }
        onChildComponentHover={setChildHighlightTargets}
        onColorTokenHover={setTokenHighlightTargets}
        onSelectInspectorCode={(code) => {
          const element = findInspectorElement(code);
          const entry = element ? getInspectorFromElement(element) : null;
          if (entry && element) {
            selectEntry(entry, element, false);
          }
        }}
        preview={hovered}
        target={selected}
        targetElement={selectedTarget ?? hoverTarget}
      />
    </>
  );
}
