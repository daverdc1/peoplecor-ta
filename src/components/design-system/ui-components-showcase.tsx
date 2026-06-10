import { MaterialIcon } from "@/components/icons/material-icon";
import { ComponentSection } from "@/components/design-system/component-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { Switch } from "@/components/ui/switch";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

export function UiComponentsShowcase() {
  return (
    <div className="flex flex-col gap-2">
      <ComponentSection sectionId="ds-section-button" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-01"])}>
            <Button type="button">Primary</Button>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-02"])}>
            <Button type="button" variant="brandOutline">
              Brand Outline
            </Button>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-03"])}>
            <Button type="button" variant="ghost">
              Ghost
            </Button>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-04"])}>
            <Button type="button" variant="success">
              Success
            </Button>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-05"])}>
            <Button
              type="button"
              className="border-0 bg-payroll-yellow text-ink hover:bg-payroll-yellow/90"
            >
              Payroll
            </Button>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BTN-06"])}>
            <Button type="button" disabled>
              Disabled
            </Button>
          </span>
        </div>
      </ComponentSection>

      <ComponentSection sectionId="ds-section-input" title="Input">
        <div className="max-w-md" {...inspectorProps(inspectorRegistry["DS-INP-01"])}>
          <Input placeholder="Search employees..." />
        </div>
      </ComponentSection>

      <ComponentSection sectionId="ds-section-checkbox" title="Checkbox">
        <label
          className="flex max-w-md items-center gap-2 text-sm text-ink"
          {...inspectorProps(inspectorRegistry["DS-CHK-01"])}
        >
          <Checkbox defaultChecked />
          Checkbox
        </label>
      </ComponentSection>

      <ComponentSection sectionId="ds-section-switch" title="Switch">
        <label
          className="flex max-w-md items-center gap-2 text-sm text-ink"
          {...inspectorProps(inspectorRegistry["DS-SWG-01"])}
        >
          <Switch defaultChecked />
          Switch
        </label>
      </ComponentSection>

      <ComponentSection sectionId="ds-section-badge" title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BDG-01"])}>
            <Badge>12 In</Badge>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BDG-02"])}>
            <Badge
              icon={<MaterialIcon name="warning" className="text-white" filled size={14} />}
            >
              Performance Notes
            </Badge>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-BDG-03"])}>
            <Badge
              variant="success"
              icon={<MaterialIcon name="check" className="text-white" size={14} />}
            >
              Verified
            </Badge>
          </span>
        </div>
      </ComponentSection>

      <ComponentSection sectionId="ds-section-pill" title="Status Pills">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-PIL-01"])}>
            <StatusPill
              icon={<MaterialIcon name="hourglass_top" className="text-warning-text" size={12} />}
              variant="warning"
            >
              Pending
            </StatusPill>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-PIL-02"])}>
            <StatusPill
              icon={<MaterialIcon name="check" className="text-white" filled size={12} />}
              variant="success"
            >
              Approved
            </StatusPill>
          </span>
          <span className="inline-flex" {...inspectorProps(inspectorRegistry["DS-PIL-03"])}>
            <StatusPill
              icon={<MaterialIcon name="info" className="text-subtle" size={12} />}
              variant="neutral"
            >
              Draft
            </StatusPill>
          </span>
        </div>
      </ComponentSection>
    </div>
  );
}
