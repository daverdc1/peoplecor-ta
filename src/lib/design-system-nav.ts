export type DesignSystemNavItem = {
  id: string;
  label: string;
  children?: DesignSystemNavItem[];
};

export const designSystemNav: DesignSystemNavItem[] = [
  {
    id: "ds-foundations",
    label: "Foundations",
    children: [
      { id: "ds-colors", label: "Colors" },
      { id: "ds-typography", label: "Typography" },
    ],
  },
  {
    id: "ds-components",
    label: "Components",
    children: [
      { id: "ds-section-button", label: "Buttons" },
      { id: "ds-section-input", label: "Input" },
      { id: "ds-section-checkbox", label: "Checkbox" },
      { id: "ds-section-switch", label: "Switch" },
      { id: "ds-section-badge", label: "Badges" },
      { id: "ds-section-pill", label: "Status Pills" },
    ],
  },
  {
    id: "ds-patterns",
    label: "Patterns",
    children: [
      { id: "page-app-header", label: "App Header" },
      { id: "page-stats-bar", label: "Stats Bar" },
      { id: "page-section-header", label: "Section Header" },
      { id: "page-pay-period-toolbar", label: "Pay Period Toolbar" },
      { id: "page-filter-bar", label: "Filter Bar" },
      { id: "page-selection-bar", label: "Selection Bar" },
      {
        id: "page-employee-table",
        label: "Employee Table",
        children: [{ id: "page-table-headers", label: "Table Headers" }],
      },
      { id: "ds-section-menu", label: "Actions Menu" },
      { id: "ds-section-tooltip", label: "Tooltips" },
      { id: "ds-section-toast", label: "Toasts" },
    ],
  },
];

function collectNavIds(items: DesignSystemNavItem[]) {
  const ids: string[] = [];

  for (const item of items) {
    ids.push(item.id);
    if (item.children) {
      ids.push(...collectNavIds(item.children));
    }
  }

  return ids;
}

function flattenNavItems(items: DesignSystemNavItem[], prefix = "") {
  return items.flatMap((item) => {
    const label = prefix ? `${prefix} / ${item.label}` : item.label;
    const entries = [{ id: item.id, label }];

    if (item.children) {
      entries.push(...flattenNavItems(item.children, label));
    }

    return entries;
  });
}

function findNavGroupId(
  items: DesignSystemNavItem[],
  sectionId: string,
  groupId: string,
): string | null {
  for (const item of items) {
    if (item.id === sectionId) {
      return groupId;
    }

    if (item.children) {
      const match = findNavGroupId(item.children, sectionId, groupId);
      if (match) {
        return match;
      }
    }
  }

  return null;
}

export function getAllDesignSystemNavIds() {
  return collectNavIds(designSystemNav);
}

export function getFlatDesignSystemNavItems() {
  return designSystemNav.flatMap((group) => [
    { id: group.id, label: group.label },
    ...flattenNavItems(group.children ?? [], group.label),
  ]);
}

export function getDesignSystemNavGroupId(sectionId: string) {
  for (const group of designSystemNav) {
    if (group.id === sectionId) {
      return group.id;
    }

    const match = findNavGroupId(group.children ?? [], sectionId, group.id);
    if (match) {
      return match;
    }
  }

  return designSystemNav[0].id;
}
