import { ActionsMenuPreview } from "@/components/design-system/actions-menu-preview";
import { MaterialIcon } from "@/components/icons/material-icon";
import { WageChangeIcon } from "@/components/icons/wage-change-icon";
import { ComponentSection } from "@/components/design-system/component-section";
import { PageComponentsShowcase } from "@/components/design-system/page-components-showcase";
import { WageChangeTooltip } from "@/components/time-attendance/wage-change-tooltip";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

const sampleWageChange = {
  type: "increase" as const,
  oldWage: "$10.00/hr",
  newWage: "$10.50/hr",
  delta: "+$0.50",
  effectiveOn: "Jan 31, 2026",
  changedBy: "Jimmy Johnson",
  changedOn: "Jan 1, 2026",
};

export function PatternsShowcase() {
  return (
    <div className="flex flex-col gap-14">
      <div>
        <h3 className="ds-heading m-0 text-xs font-bold uppercase tracking-wider text-muted">
          Page layout
        </h3>
        <div className="mt-4">
          <PageComponentsShowcase />
        </div>
      </div>

      <div>
        <h3 className="ds-heading m-0 text-xs font-bold uppercase tracking-wider text-muted">
          Interaction
        </h3>
        <div className="mt-4 flex flex-col gap-2">
          <ComponentSection
            contentClassName="overflow-visible"
            sectionId="ds-section-menu"
            title="Actions Menu"
          >
            <div className="min-h-[340px] overflow-visible">
              <ActionsMenuPreview defaultOpen prepMode />
            </div>
          </ComponentSection>

          <ComponentSection sectionId="ds-section-tooltip" title="Tooltips">
            <div className="flex flex-wrap items-center gap-6">
              <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-TIP-01"])}>
                <HoverTooltip label="Actions">
                  <button
                    type="button"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-sm border border-border hover:bg-surface-muted"
                  >
                    <MaterialIcon name="more_vert" size={20} />
                  </button>
                </HoverTooltip>
              </span>

              <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-TIP-02"])}>
                <HoverTooltip label="On-going shift">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer flex-col items-center"
                  >
                    <span className="text-xs font-semibold text-danger-text">1</span>
                    <WageChangeIcon type="increase" />
                  </button>
                </HoverTooltip>
              </span>

              <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-TIP-03"])}>
                <HoverTooltip label="Recurring">
                  <span className="inline-flex cursor-pointer rounded-sm p-1 hover:bg-surface-muted">
                    <MaterialIcon name="autorenew" className="text-muted" size={14} />
                  </span>
                </HoverTooltip>
              </span>

              <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-TIP-04"])}>
                <WageChangeTooltip wageChange={sampleWageChange}>
                  <button
                    type="button"
                    className="flex size-6 cursor-pointer items-center justify-center rounded-sm border border-border"
                  >
                    <WageChangeIcon type="increase" />
                  </button>
                </WageChangeTooltip>
              </span>
            </div>
          </ComponentSection>

          <ComponentSection sectionId="ds-section-toast" title="Toasts">
            <div className="flex flex-col gap-3">
              <div
                className="inline-flex max-w-md items-center gap-2 rounded-sm bg-black px-4 py-2.5 text-sm text-white"
                {...inspectorProps(inspectorRegistry["DS-TST-01"])}
              >
                <MaterialIcon name="check_circle" className="text-success" filled size={20} />
                3 timesheets approved
              </div>
              <div
                className="inline-flex max-w-md items-center gap-2 rounded-sm bg-black px-4 py-2.5 text-sm text-white"
                {...inspectorProps(inspectorRegistry["DS-TST-02"])}
              >
                <MaterialIcon name="warning" className="text-danger" size={20} />
                2 timesheets could not be approved due to alerts
              </div>
            </div>
          </ComponentSection>
        </div>
      </div>
    </div>
  );
}
