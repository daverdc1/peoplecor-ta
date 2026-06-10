export type ColorToken = {
  name: string;
  className: string;
  value: string;
};

export type ColorTokenGroup = {
  label: string;
  tokens: ColorToken[];
};

export const colorTokenGroups: ColorTokenGroup[] = [
  {
    label: "Brand",
    tokens: [
      { name: "brand", className: "bg-brand", value: "#0EB1E6" },
      { name: "brand-dark", className: "bg-brand-dark", value: "#0097CB" },
      { name: "nav-hover", className: "bg-nav-hover", value: "brand-dark 50% + brand" },
      { name: "brand-subtle", className: "bg-brand-subtle", value: "brand 5% + white" },
      { name: "brand-muted", className: "bg-brand-muted", value: "brand 10% + page" },
      {
        name: "brand-muted-on-white",
        className: "bg-brand-muted-on-white",
        value: "brand 10% + white",
      },
    ],
  },
  {
    label: "Neutrals",
    tokens: [
      { name: "ink", className: "bg-ink", value: "#0E1821" },
      { name: "muted", className: "bg-muted", value: "#859098" },
      { name: "label", className: "bg-label", value: "#ACB4BA" },
      { name: "subtle", className: "bg-subtle", value: "#606D78" },
      { name: "page", className: "bg-page", value: "#F1F5F8" },
      { name: "ds-surface", className: "bg-ds-surface", value: "page 50% + white" },
      { name: "surface-muted", className: "bg-surface-muted", value: "#E7ECF0" },
      {
        name: "surface-muted-hover",
        className: "bg-surface-muted-hover",
        value: "ink 5% + surface-muted",
      },
      { name: "border", className: "bg-border", value: "#D5DCE2" },
      { name: "border-input", className: "bg-border-input", value: "#ACB4BA" },
      { name: "stats", className: "bg-stats", value: "#3D505F" },
      { name: "stats-badge", className: "bg-stats-badge", value: "#20303E" },
      { name: "stats-badge-hover", className: "bg-stats-badge-hover", value: "#2C4050" },
    ],
  },
  {
    label: "Table",
    tokens: [
      {
        name: "row-hover-left",
        className: "bg-row-hover-left",
        value: "ink 2.5% + page",
      },
      {
        name: "row-hover-right",
        className: "bg-row-hover-right",
        value: "ink 2.5% + white",
      },
      { name: "row-selected", className: "bg-row-selected", value: "= brand-muted" },
      {
        name: "row-selected-left",
        className: "bg-row-selected-left",
        value: "= brand-muted",
      },
      {
        name: "row-selected-right",
        className: "bg-row-selected-right",
        value: "= brand-muted-on-white",
      },
    ],
  },
  {
    label: "Secondary",
    tokens: [
      { name: "success", className: "bg-success", value: "#57BC6F" },
      { name: "success-dark", className: "bg-success-dark", value: "#357A47" },
      { name: "success-muted", className: "bg-success-muted", value: "#57BC6F1A" },
      { name: "warning", className: "bg-warning", value: "#F5A623" },
      { name: "warning-text", className: "bg-warning-text", value: "#855709" },
      { name: "warning-dark", className: "bg-warning-dark", value: "#D27A43" },
      { name: "warning-border", className: "bg-warning-border", value: "#EB925B" },
      { name: "warning-muted", className: "bg-warning-muted", value: "#F5A6231A" },
      { name: "danger", className: "bg-danger", value: "#E95156" },
      { name: "danger-dark", className: "bg-danger-dark", value: "#E05252" },
      { name: "danger-text", className: "bg-danger-text", value: "#B83237" },
      { name: "danger-subtle", className: "bg-danger-subtle", value: "danger 5% + white" },
      { name: "payroll-yellow", className: "bg-payroll-yellow", value: "#FFC600" },
    ],
  },
];

export const colorTokens = colorTokenGroups.flatMap((group) => group.tokens);
