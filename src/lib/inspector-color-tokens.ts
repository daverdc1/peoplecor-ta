import { colorTokens, type ColorToken } from "@/lib/design-tokens";
import { getInspectorEntryFromTarget } from "@/lib/inspector";

const COLOR_CLASS_PREFIXES = ["bg-", "text-", "border-"] as const;

export type ColorTokenUsage = {
  token: ColorToken;
  elements: HTMLElement[];
};

const tokenByName = new Map(colorTokens.map((token) => [token.name, token]));

const tokenByNormalizedValue = new Map(
  colorTokens.map((token) => [normalizeColorValue(token.value), token]),
);

function normalizeColorValue(value: string) {
  return value.trim().toLowerCase();
}

function parseRgbColor(value: string) {
  const match = value.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/i,
  );

  if (!match) {
    return null;
  }

  const [, red, green, blue, alpha] = match;
  const hex = [red, green, blue]
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("");

  if (alpha != null && Number(alpha) < 1) {
    const alphaHex = Math.round(Number(alpha) * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${hex}${alphaHex}`;
  }

  return `#${hex}`;
}

function normalizeComputedColor(value: string) {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed || trimmed === "transparent" || trimmed === "rgba(0, 0, 0, 0)") {
    return null;
  }

  if (trimmed.startsWith("#")) {
    return trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
  }

  if (trimmed.startsWith("rgb")) {
    return parseRgbColor(trimmed);
  }

  return null;
}

function tokenNameFromClass(className: string) {
  for (const prefix of COLOR_CLASS_PREFIXES) {
    if (!className.startsWith(prefix)) {
      continue;
    }

    const tokenName = className.slice(prefix.length).split("/")[0];
    if (tokenByName.has(tokenName)) {
      return tokenName;
    }
  }

  return null;
}

function tokenFromComputedColor(value: string) {
  const normalized = normalizeComputedColor(value);
  if (!normalized) {
    return null;
  }

  return tokenByNormalizedValue.get(normalized) ?? null;
}

function addTokenUsage(
  usages: Map<string, ColorTokenUsage>,
  token: ColorToken,
  element: HTMLElement,
) {
  const existing = usages.get(token.name);

  if (existing) {
    if (!existing.elements.includes(element)) {
      existing.elements.push(element);
    }
    return;
  }

  usages.set(token.name, { token, elements: [element] });
}

export function getColorTokenUsagesForElement(
  root: HTMLElement | null,
): ColorTokenUsage[] {
  if (!root) {
    return [];
  }

  const usages = new Map<string, ColorTokenUsage>();
  const elements = [root, ...root.querySelectorAll<HTMLElement>("*")];

  for (const element of elements) {
    for (const className of element.classList) {
      const tokenName = tokenNameFromClass(className);
      if (!tokenName) {
        continue;
      }

      const token = tokenByName.get(tokenName);
      if (token) {
        addTokenUsage(usages, token, element);
      }
    }

    const styles = getComputedStyle(element);
    for (const value of [
      styles.color,
      styles.backgroundColor,
      styles.borderTopColor,
      styles.borderRightColor,
      styles.borderBottomColor,
      styles.borderLeftColor,
      styles.outlineColor,
    ]) {
      const token = tokenFromComputedColor(value);
      if (token) {
        addTokenUsage(usages, token, element);
      }
    }
  }

  return [...usages.values()].sort((a, b) =>
    a.token.name.localeCompare(b.token.name),
  );
}

export function getElementColorLabel(element: HTMLElement) {
  const entry = getInspectorEntryFromTarget(element);
  if (entry) {
    return entry.name;
  }

  const tag = element.tagName.toLowerCase();
  const colorClass = [...element.classList].find((className) =>
    COLOR_CLASS_PREFIXES.some((prefix) => className.startsWith(prefix)),
  );

  return colorClass ? `${tag} · ${colorClass}` : tag;
}
