import { MaterialIcon } from "@/components/icons/material-icon";

type EmployeeSearchEmptyStateProps = {
  onClearSearch: () => void;
};

export function EmployeeSearchEmptyState({
  onClearSearch,
}: EmployeeSearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <MaterialIcon name="search_off" className="text-muted" size={48} />
      <p className="m-0 mt-4 text-sm text-ink">No results found</p>
      <button
        type="button"
        className="mt-2 cursor-pointer text-xs font-normal text-brand hover:underline"
        onClick={onClearSearch}
      >
        Clear search
      </button>
    </div>
  );
}
