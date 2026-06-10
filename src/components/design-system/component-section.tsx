import { type ReactNode } from "react";
import { getInspectorEntryForSection } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type ComponentSectionProps = {
  children: ReactNode;
  contentClassName?: string;
  sectionId: string;
  title: string;
};

export function ComponentSection({
  children,
  contentClassName,
  sectionId,
  title,
}: ComponentSectionProps) {
  const inspectorEntry = getInspectorEntryForSection(sectionId);

  return (
    <section
      className="scroll-mt-8 pb-10"
      id={sectionId}
      {...(inspectorEntry ? inspectorProps(inspectorEntry) : {})}
    >
      <h3 className="ds-heading m-0 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <div
        className={cn(
          "mt-4 rounded-md bg-ds-surface p-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
