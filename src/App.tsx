import { useState } from "react";
import { DesignSystemButton } from "@/components/design-system/design-system-button";
import { DesignSystemPage } from "@/components/design-system/design-system-page";
import { MonoFontComparisonPage } from "@/components/temporary/mono-font-comparison-page";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Inspector } from "@/components/inspector/inspector";
import { TimeAttendancePage } from "@/components/time-attendance/time-attendance-page";
import { INSPECTOR_IGNORE_ATTR } from "@/lib/inspector";
import { getInspectorEntryForSection } from "@/lib/inspector-registry";
import { cn } from "@/lib/utils";

type InspectorReturnContext = {
  designSystemFocusSection: string | null;
  designSystemScrollY: number | null;
  selectedCode: string | null;
  showDesignSystem: boolean;
};

function hasMonoFontsParam() {
  return new URLSearchParams(window.location.search).has("mono-fonts");
}

export default function App() {
  const [showMonoFontComparison, setShowMonoFontComparison] = useState(hasMonoFontsParam);
  const [showDesignSystem, setShowDesignSystem] = useState(false);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [usageHighlight, setUsageHighlight] = useState<string | null>(null);
  const [designSystemFocusSection, setDesignSystemFocusSection] = useState<string | null>(
    null,
  );
  const [designSystemFocusInspectorCode, setDesignSystemFocusInspectorCode] = useState<
    string | null
  >(null);
  const [inspectorReturnContext, setInspectorReturnContext] =
    useState<InspectorReturnContext | null>(null);
  const [restoreInspectorCode, setRestoreInspectorCode] = useState<string | null>(null);

  const handleOpenDesignSystemSection = (
    sectionId: string,
    selectedCode: string | null,
  ) => {
    setInspectorReturnContext({
      showDesignSystem,
      designSystemFocusSection,
      designSystemScrollY: showDesignSystem ? window.scrollY : null,
      selectedCode,
    });
    setDesignSystemFocusSection(sectionId);
    setDesignSystemFocusInspectorCode(
      getInspectorEntryForSection(sectionId)?.code ?? null,
    );
    setShowDesignSystem(true);
  };

  const handleGoBackFromInspector = () => {
    if (!inspectorReturnContext) {
      return;
    }

    setShowDesignSystem(inspectorReturnContext.showDesignSystem);
    setDesignSystemFocusSection(inspectorReturnContext.designSystemFocusSection);

    if (inspectorReturnContext.showDesignSystem) {
      const scrollY = inspectorReturnContext.designSystemScrollY;
      if (scrollY != null) {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY });
        });
      }
    }

    if (
      inspectorReturnContext.selectedCode &&
      !inspectorReturnContext.showDesignSystem
    ) {
      setRestoreInspectorCode(inspectorReturnContext.selectedCode);
    }

    setInspectorReturnContext(null);
  };

  const handleCloseMonoFontComparison = () => {
    setShowMonoFontComparison(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("mono-fonts");
    window.history.replaceState({}, "", url);
  };

  return (
    <>
      {showMonoFontComparison ? (
        <MonoFontComparisonPage onClose={handleCloseMonoFontComparison} />
      ) : showDesignSystem ? (
        <DesignSystemPage
          focusExampleId={usageHighlight}
          focusSectionId={designSystemFocusSection}
          onClose={() => {
            setShowDesignSystem(false);
            setDesignSystemFocusSection(null);
            setDesignSystemFocusInspectorCode(null);
            setInspectorReturnContext(null);
          }}
        />
      ) : (
        <TimeAttendancePage
          onClearUsageHighlight={() => setUsageHighlight(null)}
          onOpenDesignSystem={() => {
            setInspectorReturnContext(null);
            setShowDesignSystem(true);
          }}
          usageHighlight={usageHighlight}
        />
      )}

      {inspectorActive ? (
        <Inspector
          appViewActive={!showDesignSystem}
          canGoBack={inspectorReturnContext != null}
          focusInspectorCode={designSystemFocusInspectorCode}
          onClose={() => setInspectorActive(false)}
          onFocusInspectorComplete={() => setDesignSystemFocusInspectorCode(null)}
          onGoBack={handleGoBackFromInspector}
          onOpenDesignSystemSection={handleOpenDesignSystemSection}
          onRestoreInspectorComplete={() => setRestoreInspectorCode(null)}
          restoreInspectorCode={restoreInspectorCode}
        />
      ) : null}

      {showMonoFontComparison ? null : (
      <div
        {...{ [INSPECTOR_IGNORE_ATTR]: true }}
        className="fixed right-4 bottom-4 z-[100] flex gap-2"
      >
        <DesignSystemButton
          aria-label={inspectorActive ? "Close inspector" : "Open inspector"}
          className={cn(
            "shadow-md",
            inspectorActive &&
              "border-inspector bg-inspector text-white hover:border-inspector hover:bg-inspector",
          )}
          onClick={() => setInspectorActive((current) => !current)}
        >
          <MaterialIcon
            name={inspectorActive ? "visibility" : "visibility_off"}
            size={12}
            className={inspectorActive ? "text-white" : undefined}
          />
          Inspector
        </DesignSystemButton>
        <DesignSystemButton
          aria-label={showDesignSystem ? "Back to app" : "Open design system"}
          className="shadow-md"
          onClick={() => {
            setInspectorReturnContext(null);
            if (showDesignSystem) {
              setShowDesignSystem(false);
              setDesignSystemFocusSection(null);
              setDesignSystemFocusInspectorCode(null);
              return;
            }
            setShowDesignSystem(true);
          }}
        >
          {showDesignSystem ? "Back to App" : "Design System"}
        </DesignSystemButton>
      </div>
      )}
    </>
  );
}
