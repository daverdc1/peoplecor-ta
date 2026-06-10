import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type TeamSectionHeaderProps = {
  team: string;
  employeeCount: number;
  remainingColSpan: number;
  rightSectionColumnCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
};

export function TeamSectionHeader({
  team,
  employeeCount,
  remainingColSpan,
  rightSectionColumnCount,
  allSelected,
  someSelected,
  onToggleAll,
}: TeamSectionHeaderProps) {
  const countLabel =
    employeeCount === 1 ? "1 employee" : `${employeeCount} employees`;
  const sectionSpacing = "pt-4 pb-2.5";

  return (
    <tr>
      <td
        className={cn(
          "w-10 max-w-10 bg-page pl-3 pr-0 align-bottom",
          sectionSpacing,
        )}
      >
        <Checkbox
          aria-label={`Select all employees in ${team}`}
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={onToggleAll}
        />
      </td>
      <td
        className={cn(
          "bg-page pl-2 pr-2 align-bottom",
          sectionSpacing,
        )}
      >
        <div className="min-w-0">
          <p className="m-0 text-base leading-5 font-semibold text-ink">{team}</p>
          <p className="m-0 text-xs leading-4 text-muted">{countLabel}</p>
        </div>
      </td>
      <td
        colSpan={remainingColSpan}
        className={cn("bg-page", sectionSpacing)}
      />
      {rightSectionColumnCount > 0 ? (
        <td
          colSpan={rightSectionColumnCount}
          className={cn("bg-white", sectionSpacing)}
        />
      ) : null}
    </tr>
  );
}
