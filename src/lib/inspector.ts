import type { InspectorEntry } from "@/lib/inspector-registry";
import { inspectorRegistry } from "@/lib/inspector-registry";

export const INSPECTOR_ATTR = "data-inspector";
export const INSPECTOR_IGNORE_ATTR = "data-inspector-ignore";

export function inspectorProps(entry: InspectorEntry) {
  return {
    [INSPECTOR_ATTR]: entry.code,
    "data-inspector-name": entry.name,
    ...(entry.file ? { "data-inspector-file": entry.file } : {}),
    ...(entry.sourcePath ? { "data-inspector-source": entry.sourcePath } : {}),
    ...(entry.parentCode ? { "data-inspector-parent": entry.parentCode } : {}),
  };
}

export function getInspectorEntryFromTarget(target: Element): InspectorEntry | null {
  const code = target.getAttribute(INSPECTOR_ATTR);
  const name = target.getAttribute("data-inspector-name");

  if (!code || !name) {
    return null;
  }

  const registryEntry = inspectorRegistry[code];

  if (registryEntry) {
    return registryEntry;
  }

  return {
    code,
    name,
    file: target.getAttribute("data-inspector-file") ?? undefined,
    sourcePath: target.getAttribute("data-inspector-source") ?? undefined,
    parentCode: target.getAttribute("data-inspector-parent") ?? undefined,
  };
}

export function getInspectorFromElement(element: Element | null): InspectorEntry | null {
  if (!element) {
    return null;
  }

  const target = element.closest(`[${INSPECTOR_ATTR}]`);
  if (!target) {
    return null;
  }

  return getInspectorEntryFromTarget(target);
}

export function getInspectorTargetAtPoint(x: number, y: number) {
  const elements = document.elementsFromPoint(x, y);
  let bestTarget: HTMLElement | null = null;
  let bestArea = Infinity;

  for (const element of elements) {
    if (isInspectorIgnored(element)) {
      continue;
    }

    const inspectorTarget = element.closest<HTMLElement>(`[${INSPECTOR_ATTR}]`);
    if (!inspectorTarget) {
      continue;
    }

    const rect = inspectorTarget.getBoundingClientRect();
    const area = rect.width * rect.height;

    if (area < bestArea) {
      bestArea = area;
      bestTarget = inspectorTarget;
    }
  }

  return bestTarget;
}

export function getInspectorAtPoint(x: number, y: number) {
  const target = getInspectorTargetAtPoint(x, y);
  if (!target) {
    return { entry: null, target: null };
  }

  return {
    entry: getInspectorEntryFromTarget(target),
    target,
  };
}

export function findInspectorElement(code: string) {
  return document.querySelector<HTMLElement>(`[${INSPECTOR_ATTR}="${code}"]`);
}

export function getChildInspectorComponents(
  root: HTMLElement | null,
  parentCode: string | undefined,
) {
  if (!root || !parentCode) {
    return [];
  }

  const children: { entry: InspectorEntry; element: HTMLElement }[] = [];

  root.querySelectorAll<HTMLElement>(`[${INSPECTOR_ATTR}]`).forEach((element) => {
    if (element === root) {
      return;
    }

    const entry = getInspectorEntryFromTarget(element);
    if (entry?.parentCode === parentCode) {
      children.push({ entry, element });
    }
  });

  return children.sort((a, b) =>
    a.entry.name.localeCompare(b.entry.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

export function isInspectorIgnored(element: Element | null) {
  return Boolean(element?.closest(`[${INSPECTOR_IGNORE_ATTR}]`));
}
