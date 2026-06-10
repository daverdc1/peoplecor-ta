export type InspectorEntry = {
  code: string;
  name: string;
  file?: string;
  parentCode?: string;
  sourcePath?: string;
};

function entry(
  code: string,
  name: string,
  sourcePath: string,
  parentCode?: string,
): InspectorEntry {
  const file = sourcePath.split("/").pop();
  return { code, name, file, parentCode, sourcePath };
}

function instance(
  parentCode: string,
  suffix: string,
  name: string,
  sourcePath: string,
): InspectorEntry {
  return entry(`${parentCode}-${suffix}`, name, sourcePath, parentCode);
}

export const inspectorRegistry: Record<string, InspectorEntry> = {
  "PG-TA": entry("PG-TA", "Time & Attendance Page", "src/components/time-attendance/time-attendance-page.tsx"),
  HDR: entry("HDR", "App Header", "src/components/layout/app-header.tsx"),
  "HDR-MOR": entry("HDR-MOR", "Header Nav / More", "src/components/layout/app-header.tsx", "HDR"),
  STS: entry("STS", "Stats Bar", "src/components/layout/stats-bar.tsx"),
  SEC: entry("SEC", "Section Header", "src/components/layout/section-header.tsx"),
  PPT: entry("PPT", "Pay Period Toolbar", "src/components/time-attendance/pay-period-toolbar.tsx"),
  "PPT-PER": entry("PPT-PER", "Pay Period Selector", "src/components/time-attendance/pay-period-toolbar.tsx", "PPT"),
  "PPT-PREP": entry("PPT-PREP", "Prep for Payroll Toggle", "src/components/time-attendance/pay-period-toolbar.tsx", "PPT"),
  "PPT-GOP": entry("PPT-GOP", "Go To Payroll Button", "src/components/time-attendance/pay-period-toolbar.tsx", "PPT"),
  FLT: entry("FLT", "Filter Bar", "src/components/time-attendance/filter-bar.tsx"),
  "FLT-SRH": entry("FLT-SRH", "Employee Search", "src/components/time-attendance/filter-bar.tsx", "FLT"),
  "FLT-VIW": entry("FLT-VIW", "View Mode Toggle", "src/components/time-attendance/filter-bar.tsx", "FLT"),
  "FLT-EMP": entry("FLT-EMP", "Employment Status Filter", "src/components/time-attendance/filter-bar.tsx", "FLT"),
  SEL: entry("SEL", "Selection Bar", "src/components/time-attendance/selection-bar.tsx"),
  "SEL-APR": entry("SEL-APR", "Approve Selected", "src/components/time-attendance/selection-bar.tsx", "SEL"),
  "SEL-UNA": entry("SEL-UNA", "Unapprove Selected", "src/components/time-attendance/selection-bar.tsx", "SEL"),
  TBL: entry("TBL", "Employee Table", "src/components/time-attendance/employee-table.tsx"),
  "TBL-HDR": entry("TBL-HDR", "Table Headers", "src/components/time-attendance/employee-table.tsx", "TBL"),
  "TBL-CHK-ALL": entry("TBL-CHK-ALL", "Select All Checkbox", "src/components/time-attendance/employee-table.tsx", "TBL-HDR"),
  "TBL-CHK": entry("TBL-CHK", "Row Checkbox", "src/components/time-attendance/employee-table.tsx", "TBL"),
  "TBL-ALR": entry("TBL-ALR", "Alert Cell", "src/components/time-attendance/employee-table.tsx", "TBL"),
  "TBL-TIP-ALR": entry("TBL-TIP-ALR", "On-going Shift Tooltip", "src/components/time-attendance/employee-table.tsx", "TBL-ALR"),
  "TBL-TIP-REC": entry("TBL-TIP-REC", "Recurring Tooltip", "src/components/time-attendance/employee-table.tsx", "TBL"),
  "TBL-TIP-WAGE": entry("TBL-TIP-WAGE", "Wage Change Tooltip", "src/components/time-attendance/wage-change-tooltip.tsx", "TBL"),
  "TBL-STS": entry("TBL-STS", "Status Column", "src/components/time-attendance/employee-table.tsx", "TBL"),
  ACT: entry("ACT", "Actions Menu", "src/components/time-attendance/employee-actions-menu.tsx"),
  "ACT-APR": entry("ACT-APR", "Approve Timesheet", "src/components/time-attendance/employee-actions-menu.tsx", "ACT"),
  "ACT-UNA": entry("ACT-UNA", "Unapprove Timesheet", "src/components/time-attendance/employee-actions-menu.tsx", "ACT"),
  "PIL-PND": entry("PIL-PND", "Pending Pill", "src/components/time-attendance/employee-approval-pill.tsx", "TBL-STS"),
  "PIL-APR": entry("PIL-APR", "Approved Pill", "src/components/time-attendance/employee-approval-pill.tsx", "TBL-STS"),
  TST: entry("TST", "Toast", "src/components/ui/toast.tsx"),
  "DS-PG": entry("DS-PG", "Design System Page", "src/components/design-system/design-system-page.tsx"),
  "DS-FND": entry("DS-FND", "Foundations", "src/components/design-system/foundations-showcase.tsx", "DS-PG"),
  "DS-CLR": entry("DS-CLR", "Colors", "src/components/design-system/foundations-showcase.tsx", "DS-FND"),
  "DS-TYP": entry("DS-TYP", "Typography", "src/components/design-system/foundations-showcase.tsx", "DS-FND"),
  "DS-CMP": entry("DS-CMP", "Components", "src/components/design-system/ui-components-showcase.tsx", "DS-PG"),
  "DS-BTN": entry("DS-BTN", "Buttons", "src/components/design-system/ui-components-showcase.tsx", "DS-CMP"),
  "DS-INP": entry("DS-INP", "Input", "src/components/ui/input.tsx", "DS-CMP"),
  "DS-CHK": entry("DS-CHK", "Checkbox", "src/components/ui/checkbox.tsx", "DS-CMP"),
  "DS-SWG": entry("DS-SWG", "Switch", "src/components/ui/switch.tsx", "DS-CMP"),
  "DS-BDG": entry("DS-BDG", "Badges", "src/components/design-system/ui-components-showcase.tsx", "DS-CMP"),
  "DS-PIL": entry("DS-PIL", "Status Pills", "src/components/design-system/ui-components-showcase.tsx", "DS-CMP"),
  "DS-PAT": entry("DS-PAT", "Patterns", "src/components/design-system/patterns-showcase.tsx", "DS-PG"),
  "DS-HDR": entry("DS-HDR", "App Header (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-STS": entry("DS-STS", "Stats Bar (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-SEC": entry("DS-SEC", "Section Header (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-PPT": entry("DS-PPT", "Pay Period Toolbar (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-FLT": entry("DS-FLT", "Filter Bar (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-SEL": entry("DS-SEL", "Selection Bar (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-TBL": entry("DS-TBL", "Employee Table (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-PAT"),
  "DS-TBL-HDR": entry("DS-TBL-HDR", "Table Headers (preview)", "src/components/design-system/page-components-showcase.tsx", "DS-TBL"),
  "DS-MNU": entry("DS-MNU", "Actions Menu (preview)", "src/components/design-system/patterns-showcase.tsx", "DS-PAT"),
  "DS-TIP": entry("DS-TIP", "Tooltips (preview)", "src/components/design-system/patterns-showcase.tsx", "DS-PAT"),
  "DS-TIP-01": instance("DS-TIP", "01", "Actions Tooltip", "src/components/ui/hover-tooltip.tsx"),
  "DS-TIP-02": instance("DS-TIP", "02", "On-going Shift Tooltip", "src/components/ui/hover-tooltip.tsx"),
  "DS-TIP-03": instance("DS-TIP", "03", "Recurring Tooltip", "src/components/ui/hover-tooltip.tsx"),
  "DS-TIP-04": instance("DS-TIP", "04", "Wage Change Tooltip", "src/components/time-attendance/wage-change-tooltip.tsx"),
  "DS-TST": entry("DS-TST", "Toasts (preview)", "src/components/design-system/patterns-showcase.tsx", "DS-PAT"),
  "DS-TST-01": instance("DS-TST", "01", "Success Toast", "src/components/design-system/patterns-showcase.tsx"),
  "DS-TST-02": instance("DS-TST", "02", "Alert Toast", "src/components/design-system/patterns-showcase.tsx"),
  "DS-BTN-01": instance("DS-BTN", "01", "Primary Button", "src/components/ui/button.tsx"),
  "DS-BTN-02": instance("DS-BTN", "02", "Brand Outline Button", "src/components/ui/button.tsx"),
  "DS-BTN-03": instance("DS-BTN", "03", "Ghost Button", "src/components/ui/button.tsx"),
  "DS-BTN-04": instance("DS-BTN", "04", "Success Button", "src/components/ui/button.tsx"),
  "DS-BTN-05": instance("DS-BTN", "05", "Payroll Button", "src/components/ui/button.tsx"),
  "DS-BTN-06": instance("DS-BTN", "06", "Disabled Button", "src/components/ui/button.tsx"),
  "DS-INP-01": instance("DS-INP", "01", "Search Input", "src/components/ui/input.tsx"),
  "DS-CHK-01": instance("DS-CHK", "01", "Checkbox", "src/components/ui/checkbox.tsx"),
  "DS-SWG-01": instance("DS-SWG", "01", "Switch", "src/components/ui/switch.tsx"),
  "DS-BDG-01": instance("DS-BDG", "01", "Badge / 12 In", "src/components/ui/badge.tsx"),
  "DS-BDG-02": instance("DS-BDG", "02", "Badge / Performance Notes", "src/components/ui/badge.tsx"),
  "DS-BDG-03": instance("DS-BDG", "03", "Badge / Verified", "src/components/ui/badge.tsx"),
  "DS-PIL-01": instance("DS-PIL", "01", "Pending Pill", "src/components/ui/status-pill.tsx"),
  "DS-PIL-02": instance("DS-PIL", "02", "Approved Pill", "src/components/ui/status-pill.tsx"),
  "DS-PIL-03": instance("DS-PIL", "03", "Draft Pill", "src/components/ui/status-pill.tsx"),
  "DS-MNU-01": instance("DS-MNU", "01", "Approve Timesheet", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-02": instance("DS-MNU", "02", "Verify Labor", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-03": instance("DS-MNU", "03", "Download Timesheet", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-04": instance("DS-MNU", "04", "Edit Timesheet", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-05": instance("DS-MNU", "05", "One-Time Addition", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-06": instance("DS-MNU", "06", "Recurring Deduction", "src/components/time-attendance/employee-actions-menu.tsx"),
  "DS-MNU-07": instance("DS-MNU", "07", "Delete Timesheet", "src/components/time-attendance/employee-actions-menu.tsx"),
};

export const sectionInspectorCode: Record<string, string> = {
  "ds-foundations": "DS-FND",
  "ds-colors": "DS-CLR",
  "ds-typography": "DS-TYP",
  "ds-components": "DS-CMP",
  "ds-section-button": "DS-BTN",
  "ds-section-input": "DS-INP",
  "ds-section-checkbox": "DS-CHK",
  "ds-section-switch": "DS-SWG",
  "ds-section-badge": "DS-BDG",
  "ds-section-pill": "DS-PIL",
  "ds-patterns": "DS-PAT",
  "page-app-header": "DS-HDR",
  "page-stats-bar": "DS-STS",
  "page-section-header": "DS-SEC",
  "page-pay-period-toolbar": "DS-PPT",
  "page-filter-bar": "DS-FLT",
  "page-selection-bar": "DS-SEL",
  "page-employee-table": "DS-TBL",
  "page-table-headers": "DS-TBL-HDR",
  "ds-section-menu": "DS-MNU",
  "ds-section-tooltip": "DS-TIP",
  "ds-section-toast": "DS-TST",
};

export function getInspectorEntry(code: string) {
  return inspectorRegistry[code];
}

export function getInspectorParent(entry: InspectorEntry) {
  if (!entry.parentCode) {
    if (entry.code.startsWith("TBL-R")) {
      return inspectorRegistry.TBL;
    }

    return undefined;
  }

  return inspectorRegistry[entry.parentCode];
}

export function getInspectorEntryForSection(sectionId: string) {
  const code = sectionInspectorCode[sectionId];
  return code ? inspectorRegistry[code] : undefined;
}

const inspectorCodeToSection = Object.fromEntries(
  Object.entries(sectionInspectorCode).map(([sectionId, code]) => [code, sectionId]),
) as Record<string, string>;

const appInspectorCodeToSection: Record<string, string> = {
  HDR: "page-app-header",
  "HDR-MOR": "page-app-header",
  STS: "page-stats-bar",
  SEC: "page-section-header",
  PPT: "page-pay-period-toolbar",
  "PPT-PER": "page-pay-period-toolbar",
  "PPT-GOP": "page-pay-period-toolbar",
  FLT: "page-filter-bar",
  "FLT-VIW": "page-filter-bar",
  "FLT-EMP": "page-filter-bar",
  SEL: "page-selection-bar",
  "SEL-APR": "page-selection-bar",
  "SEL-UNA": "page-selection-bar",
  ACT: "ds-section-menu",
  "ACT-APR": "ds-section-menu",
  "ACT-UNA": "ds-section-menu",
  "PIL-PND": "ds-section-pill",
  "PIL-APR": "ds-section-pill",
  TST: "ds-section-toast",
  TBL: "page-employee-table",
  "TBL-HDR": "page-table-headers",
  "TBL-CHK": "ds-section-checkbox",
  "TBL-CHK-ALL": "ds-section-checkbox",
  "TBL-ALR": "page-employee-table",
  "TBL-TIP-ALR": "ds-section-tooltip",
  "TBL-TIP-REC": "ds-section-tooltip",
  "TBL-TIP-WAGE": "ds-section-tooltip",
  "DS-TIP-01": "ds-section-tooltip",
  "DS-TIP-02": "ds-section-tooltip",
  "DS-TIP-03": "ds-section-tooltip",
  "DS-TIP-04": "ds-section-tooltip",
  "TBL-STS": "page-employee-table",
  "PPT-PREP": "ds-section-switch",
  "FLT-SRH": "ds-section-input",
};

export function getDesignSystemSectionForInspectorCode(code: string) {
  const direct =
    inspectorCodeToSection[code] ?? appInspectorCodeToSection[code];

  if (direct) {
    return direct;
  }

  const entry = getInspectorEntry(code);
  if (entry?.parentCode) {
    return getDesignSystemSectionForInspectorCode(entry.parentCode);
  }

  return undefined;
}

export function getInspectorEntryForRow(rowNumber: number) {
  const padded = String(rowNumber).padStart(2, "0");
  return {
    code: `TBL-R${padded}`,
    name: `Employee Row ${rowNumber}`,
    file: "employee-table.tsx",
    parentCode: "TBL",
    sourcePath: "src/components/time-attendance/employee-table.tsx",
  };
}
