import { useEffect, useState } from "react";
import { DesignSystemSidebar } from "@/components/design-system/design-system-sidebar";
import { FoundationsShowcase } from "@/components/design-system/foundations-showcase";
import { PatternsShowcase } from "@/components/design-system/patterns-showcase";
import { UiComponentsShowcase } from "@/components/design-system/ui-components-showcase";
import { DesignSystemButton } from "@/components/design-system/design-system-button";
import { PeopleCorLogo } from "@/components/icons/peoplecor-logo";
import {
  getAllDesignSystemNavIds,
  getFlatDesignSystemNavItems,
} from "@/lib/design-system-nav";
import { getDesignSystemSectionId } from "@/lib/design-system-catalog";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

type DesignSystemPageProps = {
  focusExampleId?: string | null;
  focusSectionId?: string | null;
  onClose: () => void;
};

export function DesignSystemPage({
  focusExampleId = null,
  focusSectionId = null,
  onClose,
}: DesignSystemPageProps) {
  const [activeId, setActiveId] = useState("ds-foundations");

  useEffect(() => {
    if (focusSectionId) {
      setActiveId(focusSectionId);
      return;
    }

    if (focusExampleId) {
      const sectionId = getDesignSystemSectionId(focusExampleId);
      if (sectionId) {
        setActiveId(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [focusExampleId, focusSectionId]);

  useEffect(() => {
    const sectionIds = getAllDesignSystemNavIds();
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section != null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white" {...inspectorProps(inspectorRegistry["DS-PG"])}>
      <header className="border-b border-border px-6 py-6 lg:px-10 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <PeopleCorLogo variant="ink" />
            <h1 className="ds-heading m-0 text-xs font-semibold uppercase tracking-wider text-subtle">
              Design System
            </h1>
          </div>
          <DesignSystemButton onClick={onClose}>Back to App</DesignSystemButton>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-0 hidden h-[calc(100vh-5.75rem)] w-56 shrink-0 overflow-y-auto px-4 py-6 lg:block lg:h-[calc(100vh-6.5rem)] lg:w-60 lg:px-6">
          <DesignSystemSidebar activeId={activeId} />
        </aside>

        <main className="min-w-0 flex-1 px-6 py-10 lg:px-10 lg:py-12">
          <section
            className="scroll-mt-8 pb-20"
            id="ds-foundations"
            {...inspectorProps(inspectorRegistry["DS-FND"])}
          >
            <h2 className="ds-heading m-0 text-2xl font-semibold tracking-tight text-ink">
              Foundations
            </h2>
            <div className="mt-8">
              <FoundationsShowcase />
            </div>
          </section>

          <section
            className="scroll-mt-8 border-t border-border pb-20 pt-20"
            id="ds-components"
            {...inspectorProps(inspectorRegistry["DS-CMP"])}
          >
            <h2 className="ds-heading m-0 text-2xl font-semibold tracking-tight text-ink">
              Components
            </h2>
            <div className="mt-8">
              <UiComponentsShowcase />
            </div>
          </section>

          <section
            className="scroll-mt-8 border-t border-border pt-20"
            id="ds-patterns"
            {...inspectorProps(inspectorRegistry["DS-PAT"])}
          >
            <h2 className="ds-heading m-0 text-2xl font-semibold tracking-tight text-ink">
              Patterns
            </h2>
            <div className="mt-8">
              <PatternsShowcase />
            </div>
          </section>
        </main>
      </div>

      <div className="border-t border-border px-6 py-3 lg:hidden">
        <label className="ds-notes flex flex-col gap-1 text-subtle" htmlFor="ds-mobile-nav">
          Jump to
          <select
            className="rounded-sm border border-border bg-white px-3 py-2 font-sans text-sm text-ink"
            id="ds-mobile-nav"
            value={activeId}
            onChange={(event) => {
              const sectionId = event.target.value;
              setActiveId(sectionId);
              document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {getFlatDesignSystemNavItems().map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
