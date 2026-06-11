import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { EmployeeSearchField } from "@/components/time-attendance/employee-search-field";
import { EmploymentStatusFilter } from "@/components/time-attendance/employment-status-filter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { EmploymentStatus } from "@/data/employees";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  viewMode: "name" | "team";
  onViewModeChange: (mode: "name" | "team") => void;
  employmentStatusFilter: EmploymentStatus[];
  onEmploymentStatusFilterChange: (statuses: EmploymentStatus[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: "name" | "team";
  onViewModeChange: (mode: "name" | "team") => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLButtonElement>(null);
  const teamRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [enableTransition, setEnableTransition] = useState(false);

  const updateIndicator = () => {
    const container = containerRef.current;
    const activeItem = viewMode === "name" ? nameRef.current : teamRef.current;

    if (!container || !activeItem) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();

    setIndicator({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [viewMode]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setEnableTransition(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-8 items-center rounded-sm bg-surface-muted p-1"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 rounded-[2px] bg-brand-dark shadow-sm",
          enableTransition && "transition-[left,width] duration-200 ease-out",
        )}
        style={{ left: indicator.left, width: indicator.width }}
      />
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => {
          if (value === "name" || value === "team") {
            onViewModeChange(value);
          }
        }}
        className="relative z-10 h-6 bg-transparent p-0"
      >
        <ToggleGroupItem ref={nameRef} value="name" aria-label="Name view">
          <MaterialIcon name="person" filled size={16} />
          Name
        </ToggleGroupItem>
        <ToggleGroupItem ref={teamRef} value="team" aria-label="Team view">
          <MaterialIcon name="groups" filled size={16} />
          Team
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function FilterBar({
  viewMode,
  onViewModeChange,
  employmentStatusFilter,
  onEmploymentStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: FilterBarProps) {
  return (
    <div className="mt-4 px-6 pb-3" {...inspectorProps(inspectorRegistry.FLT)}>
      <div className="flex h-8 items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div {...inspectorProps(inspectorRegistry["FLT-VIW"])}>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        </div>

        <div {...inspectorProps(inspectorRegistry["FLT-EMP"])}>
        <EmploymentStatusFilter
          employmentStatusFilter={employmentStatusFilter}
          onEmploymentStatusFilterChange={onEmploymentStatusFilterChange}
        />
        </div>

        {employmentStatusFilter.length > 0 ? (
          <button
            type="button"
            className="cursor-pointer text-xs font-normal text-brand-dark hover:underline"
            onClick={() => onEmploymentStatusFilterChange([])}
          >
            Remove filters
          </button>
        ) : null}
      </div>

      <div {...inspectorProps(inspectorRegistry["FLT-SRH"])}>
        <EmployeeSearchField
          onValueChange={onSearchQueryChange}
          value={searchQuery}
        />
      </div>
      </div>
    </div>
  );
}
