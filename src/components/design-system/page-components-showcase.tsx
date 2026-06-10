import { AppHeader } from "@/components/layout/app-header";
import { SectionHeader } from "@/components/layout/section-header";
import { StatsBar } from "@/components/layout/stats-bar";
import { ComponentSection } from "@/components/design-system/component-section";
import { EmployeeTablePreview } from "@/components/design-system/employee-table-preview";
import { FilterBar } from "@/components/time-attendance/filter-bar";
import { PayPeriodToolbar } from "@/components/time-attendance/pay-period-toolbar";
import { SelectionBar } from "@/components/time-attendance/selection-bar";

export function PageComponentsShowcase() {
  return (
    <div className="flex flex-col gap-2">
      <ComponentSection sectionId="page-app-header" title="App Header">
        <AppHeader />
      </ComponentSection>

      <ComponentSection sectionId="page-stats-bar" title="Stats Bar">
        <StatsBar />
      </ComponentSection>

      <ComponentSection sectionId="page-section-header" title="Section Header">
        <SectionHeader />
      </ComponentSection>

      <ComponentSection
        contentClassName="overflow-visible p-0"
        sectionId="page-pay-period-toolbar"
        title="Pay Period Toolbar"
      >
        <div className="overflow-visible px-6 py-4">
          <PayPeriodToolbar
            allEmployeesApproved={false}
            approvedCount={12}
            prepMode
            totalEmployeeCount={24}
            onPrepModeChange={() => undefined}
          />
        </div>
      </ComponentSection>

      <ComponentSection contentClassName="p-0" sectionId="page-filter-bar" title="Filter Bar">
        <div className="px-6 py-4">
          <FilterBar
            employmentStatusFilter={[]}
            searchQuery=""
            viewMode="name"
            onEmploymentStatusFilterChange={() => undefined}
            onSearchQueryChange={() => undefined}
            onViewModeChange={() => undefined}
          />
        </div>
      </ComponentSection>

      <ComponentSection contentClassName="p-0" sectionId="page-selection-bar" title="Selection Bar">
        <div className="px-6 py-4">
          <SelectionBar
            approvalById={{ a: "pending", b: "pending" }}
            selectedIds={new Set(["a", "b"])}
            onApproveSelected={() => undefined}
            onUnapproveSelected={() => undefined}
          />
        </div>
      </ComponentSection>

      <ComponentSection
        contentClassName="overflow-visible p-0"
        sectionId="page-employee-table"
        title="Employee Table"
      >
        <div className="overflow-visible py-4">
          <EmployeeTablePreview prepMode />
        </div>
      </ComponentSection>

      <ComponentSection
        contentClassName="overflow-visible p-0"
        sectionId="page-table-headers"
        title="Table Headers"
      >
        <div className="max-h-[88px] overflow-hidden py-4">
          <EmployeeTablePreview prepMode />
        </div>
      </ComponentSection>
    </div>
  );
}
