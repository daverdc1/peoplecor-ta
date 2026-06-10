import { MaterialIcon } from "@/components/icons/material-icon";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EMPLOYMENT_STATUSES,
  type EmploymentStatus,
} from "@/data/employees";
import { cn } from "@/lib/utils";

type EmploymentStatusFilterProps = {
  employmentStatusFilter: EmploymentStatus[];
  onEmploymentStatusFilterChange: (statuses: EmploymentStatus[]) => void;
};

export function EmploymentStatusFilter({
  employmentStatusFilter,
  onEmploymentStatusFilterChange,
}: EmploymentStatusFilterProps) {
  const activeCount = employmentStatusFilter.length;
  const isFilterActive = activeCount > 0;
  const allExplicitlySelected = activeCount === EMPLOYMENT_STATUSES.length;

  const toggleEmploymentStatus = (status: EmploymentStatus) => {
    if (employmentStatusFilter.includes(status)) {
      onEmploymentStatusFilterChange(
        employmentStatusFilter.filter((item) => item !== status),
      );
      return;
    }

    onEmploymentStatusFilterChange([...employmentStatusFilter, status]);
  };

  const handleHeaderAction = () => {
    if (allExplicitlySelected) {
      onEmploymentStatusFilterChange([]);
      return;
    }

    onEmploymentStatusFilterChange([...EMPLOYMENT_STATUSES]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8 cursor-pointer items-center gap-0.5 rounded-sm border px-2 text-xs font-bold uppercase transition-colors",
            isFilterActive
              ? "border-brand bg-row-selected text-ink hover:bg-row-selected"
              : "border-transparent bg-surface-muted text-ink hover:bg-[#dde4e9]",
          )}
        >
          {isFilterActive
            ? `Employment Status (${activeCount})`
            : "Employment Status"}
          <MaterialIcon name="arrow_drop_down" size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[13.5rem] rounded-md border-border p-0 py-2 shadow-[0_24px_48px_rgba(0,0,0,0.16)]"
        sideOffset={6}
      >
        <div className="flex items-start justify-between px-3 pb-1">
          <span className="text-xs font-semibold leading-4 text-muted">
            Filter by
          </span>
          <button
            type="button"
            className="cursor-pointer text-xs leading-4 text-ink underline"
            onClick={handleHeaderAction}
          >
            {allExplicitlySelected ? "Deselect all" : "Select all"}
          </button>
        </div>
        {EMPLOYMENT_STATUSES.map((status) => {
          const isChecked = employmentStatusFilter.includes(status);

          return (
            <button
              key={status}
              type="button"
              className="group flex h-8 w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-left outline-none hover:bg-page"
              onClick={() => toggleEmploymentStatus(status)}
            >
              <Checkbox
                aria-hidden
                tabIndex={-1}
                className="pointer-events-none shrink-0"
                checked={isChecked}
              />
              <span className="min-w-0 flex-1 text-sm leading-5 text-ink">
                {status}
              </span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
