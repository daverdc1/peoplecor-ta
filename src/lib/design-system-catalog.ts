export type UsageCategory =
  | "badge"
  | "button"
  | "checkbox"
  | "input"
  | "menu"
  | "page"
  | "pill"
  | "switch"
  | "toast"
  | "tooltip";

export type UsageExample = {
  id: string;
  category: UsageCategory;
  title: string;
  description: string;
  location: string;
  file: string;
  viewHint: string;
};

export const usageCategories: { id: UsageCategory; label: string }[] = [
  { id: "page", label: "Page Components" },
  { id: "menu", label: "Actions Menu" },
  { id: "tooltip", label: "Tooltips" },
  { id: "pill", label: "Status Pills" },
  { id: "badge", label: "Badges" },
  { id: "button", label: "Buttons" },
  { id: "input", label: "Input" },
  { id: "checkbox", label: "Checkbox" },
  { id: "switch", label: "Switch" },
  { id: "toast", label: "Toasts" },
];

export const usageCatalog: UsageExample[] = [
  {
    id: "page-app-header",
    category: "page",
    title: "App Header",
    description: "Global top navigation with logo, primary nav links, and site selector.",
    location: "Top of every page",
    file: "app-header.tsx",
    viewHint: "Visible at the top of the Time & Attendance page.",
  },
  {
    id: "page-stats-bar",
    category: "page",
    title: "Stats Bar",
    description: "Dark stats strip with site selector, activity counts, and quick filters.",
    location: "Below app header",
    file: "stats-bar.tsx",
    viewHint: "See the dark bar below the header with In/Out counts and badges.",
  },
  {
    id: "page-section-header",
    category: "page",
    title: "Section Header",
    description: "Page title row with module icon and View All Activities action.",
    location: "Below stats bar",
    file: "section-header.tsx",
    viewHint: "Look for the Time & Attendance title row.",
  },
  {
    id: "page-pay-period-toolbar",
    category: "page",
    title: "Pay Period Toolbar",
    description: "Pay period dropdown, Prep for Payroll switch, and Go To Payroll CTA.",
    location: "Top of main content",
    file: "pay-period-toolbar.tsx",
    viewHint: "Use the toolbar above the employee table.",
  },
  {
    id: "page-filter-bar",
    category: "page",
    title: "Filter Bar",
    description: "Search field, name/team toggle, and employment status filters.",
    location: "Above employee table",
    file: "filter-bar.tsx",
    viewHint: "Visible when no employees are selected.",
  },
  {
    id: "page-selection-bar",
    category: "page",
    title: "Selection Bar",
    description: "Bulk approve/unapprove actions when rows are selected.",
    location: "Above employee table",
    file: "selection-bar.tsx",
    viewHint: "Select one or more employees to replace the filter bar.",
  },
  {
    id: "page-employee-table",
    category: "page",
    title: "Employee Table",
    description: "Sortable employee grid with row selection, alerts, hour columns, and prep-mode adjustments.",
    location: "Main content area",
    file: "employee-table.tsx",
    viewHint: "Scroll to the employee table below the filter or selection bar.",
  },
  {
    id: "menu-trigger",
    category: "menu",
    title: "Actions trigger",
    description:
      "⋮ icon button that opens the employee row flyout menu. Shows an Actions tooltip on hover when closed.",
    location: "Employee table → Status column",
    file: "employee-actions-menu.tsx",
    viewHint: "Click or hover the ⋮ button on any employee row.",
  },
  {
    id: "menu-approve-timesheet",
    category: "menu",
    title: "Approve timesheet",
    description:
      "Primary success action at the top of the menu when the timesheet is pending.",
    location: "Employee table → Actions menu",
    file: "employee-actions-menu.tsx",
    viewHint: "Open ⋮ on a pending employee and choose Approve timesheet.",
  },
  {
    id: "menu-unapprove-timesheet",
    category: "menu",
    title: "Unapprove timesheet",
    description:
      "Warning-styled action shown when the timesheet is already approved.",
    location: "Employee table → Actions menu",
    file: "employee-actions-menu.tsx",
    viewHint: "Approve an employee first, then open ⋮ to see Unapprove timesheet.",
  },
  {
    id: "menu-standard-items",
    category: "menu",
    title: "Standard menu items",
    description:
      "Neutral items with grey icons that turn black on hover — verify labor, download, and edit actions.",
    location: "Employee table → Actions menu",
    file: "employee-actions-menu.tsx",
    viewHint: "Open ⋮ on any row and hover Verify labor or Download timesheet.",
  },
  {
    id: "menu-adjustments",
    category: "menu",
    title: "Create Adjustment section",
    description:
      "Prep-mode-only block with a section label and add/remove adjustment items.",
    location: "Employee table → Actions menu",
    file: "employee-actions-menu.tsx",
    viewHint: "Turn on Prep for Payroll, open ⋮, and scroll to Create Adjustment.",
  },
  {
    id: "menu-destructive",
    category: "menu",
    title: "Delete timesheet",
    description: "Destructive action styled in danger red at the bottom of the menu.",
    location: "Employee table → Actions menu",
    file: "employee-actions-menu.tsx",
    viewHint: "Open ⋮ on any employee row and scroll to Delete timesheet.",
  },
  {
    id: "tooltip-actions",
    category: "tooltip",
    title: "Actions",
    description: "Simple hover tooltip on the employee row actions trigger.",
    location: "Employee table → Status column → ⋮ button",
    file: "employee-actions-menu.tsx",
    viewHint: "Hover the ⋮ button on any employee row.",
  },
  {
    id: "tooltip-approve-blocked",
    category: "tooltip",
    title: "Resolve alerts before approving",
    description:
      "Shown when Approve timesheet is blocked because the employee has alerts.",
    location: "Employee table → Actions menu → Approve timesheet",
    file: "employee-actions-menu.tsx",
    viewHint:
      "Open ⋮ on Beatriz Martinez or Teresa Branham and hover Approve timesheet.",
  },
  {
    id: "tooltip-alert",
    category: "tooltip",
    title: "On-going shift",
    description: "Alert icon tooltip for employees with active shift alerts.",
    location: "Employee table → Alerts column",
    file: "employee-table.tsx",
    viewHint: "Hover the clock-alert icon on Beatriz Martinez or Teresa Branham.",
  },
  {
    id: "tooltip-recurring",
    category: "tooltip",
    title: "Recurring",
    description: "Indicates a recurring deduction or addition.",
    location: "Employee table → Adjustment columns",
    file: "employee-table.tsx",
    viewHint: "Turn on Prep for Payroll and hover the ↻ icon on a deduction row.",
  },
  {
    id: "tooltip-wage-change",
    category: "tooltip",
    title: "Wage change (rich)",
    description:
      "Rich tooltip with old/new wage, delta badge, and audit metadata.",
    location: "Employee table → Reg column → wage arrow",
    file: "wage-change-tooltip.tsx",
    viewHint: "Hover the ↗ or ↘ arrow on Juan Aguiar's Reg cell.",
  },
  {
    id: "tooltip-go-to-payroll",
    category: "tooltip",
    title: "Employees still need approval",
    description:
      "Disabled Go to Payroll button explains how many employees are not approved.",
    location: "Pay period toolbar → Go To Payroll",
    file: "pay-period-toolbar.tsx",
    viewHint: "Turn Prep for Payroll off and hover Go To Payroll while disabled.",
  },
  {
    id: "tooltip-truncation",
    category: "tooltip",
    title: "Truncated text",
    description:
      "Auto-shown only when employee role/level text is clipped in the name column.",
    location: "Employee table → Employee name → role line",
    file: "truncated-text.tsx",
    viewHint: "Narrow the window until role text truncates, then hover it.",
  },
  {
    id: "pill-approval-pending",
    category: "pill",
    title: "Pending approval",
    description: "Read-only pending status when prep mode is off; Approve? action when prep mode is on.",
    location: "Employee table → Status column",
    file: "employee-approval-pill.tsx",
    viewHint: "Turn off Prep for Payroll to see Pending, or turn it on to see Approve?.",
  },
  {
    id: "pill-approval-approved",
    category: "pill",
    title: "Approved",
    description: "Read-only approved status when prep mode is off; clickable to unapprove when prep mode is on.",
    location: "Employee table → Status column",
    file: "employee-approval-pill.tsx",
    viewHint: "Approve an employee in prep mode to see the green Approved pill.",
  },
  {
    id: "badge-stats",
    category: "badge",
    title: "Stats bar badges",
    description: "Pill badges used in the dark stats bar for counts and filters.",
    location: "Stats bar",
    file: "stats-bar.tsx",
    viewHint: "See Performance Notes and In/Out badges below the header.",
  },
  {
    id: "button-go-to-payroll",
    category: "button",
    title: "Go To Payroll",
    description: "Primary payroll CTA with yellow enabled state.",
    location: "Pay period toolbar",
    file: "pay-period-toolbar.tsx",
    viewHint: "Turn Prep for Payroll off to reveal the button.",
  },
  {
    id: "button-approve-selected",
    category: "button",
    title: "Approve Selected",
    description: "Bulk approval action in the selection bar.",
    location: "Selection bar",
    file: "selection-bar.tsx",
    viewHint: "Select one or more employees to show the selection bar.",
  },
  {
    id: "form-prep-toggle",
    category: "switch",
    title: "Prep for Payroll switch",
    description: "Toggles prep mode and reveals adjustment columns.",
    location: "Pay period toolbar",
    file: "pay-period-toolbar.tsx",
    viewHint: "Use the Prep for Payroll switch in the top toolbar.",
  },
  {
    id: "toast-approved",
    category: "toast",
    title: "Timesheet approved",
    description: "Success toast after approving one or more timesheets.",
    location: "Page footer toast",
    file: "toast.tsx",
    viewHint: "Approve a timesheet from the actions menu.",
  },
  {
    id: "toast-approval-blocked",
    category: "toast",
    title: "Could not approve due to alerts",
    description: "Warning toast when bulk approve skips employees with alerts.",
    location: "Page footer toast",
    file: "time-attendance-page.tsx",
    viewHint:
      "Select Beatriz Martinez plus another employee, then Approve Selected.",
  },
];

export function getUsageExamplesByCategory(category: UsageCategory) {
  return usageCatalog.filter((example) => example.category === category);
}

export function getUsageExample(id: string) {
  return usageCatalog.find((example) => example.id === id);
}

export function getDesignSystemSectionId(exampleId: string) {
  const example = getUsageExample(exampleId);
  if (!example) {
    return null;
  }

  if (example.category === "page") {
    return example.id;
  }

  return `ds-section-${example.category}`;
}
