import { MaterialIcon } from "@/components/icons/material-icon";
import { PeopleCorLogo } from "@/components/icons/peoplecor-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard" },
  { label: "Employees" },
  { label: "Time & Attendance", active: true, dropdown: true },
  { label: "Payroll", dropdown: true },
  { label: "Reports" },
  { label: "Communication", dropdown: true },
  { label: "Resources" },
];

const siteNameButtonClass =
  "flex items-center gap-1 rounded-sm px-1.5 py-1.5 text-white transition-colors hover:bg-white/10";

export function AppHeader() {
  return (
    <header className="flex h-[48px] items-center justify-between bg-brand px-6 text-white">
      <div className="flex items-center">
        <div className="mr-3 flex items-center pr-3">
          <PeopleCorLogo />
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex h-8 items-center gap-1 rounded-sm px-2 text-sm font-semibold text-white transition-colors hover:bg-white/10",
                item.active && "bg-brand-dark",
              )}
            >
              {item.label}
              {item.dropdown ? (
                <MaterialIcon
                  name="keyboard_arrow_down"
                  className="opacity-90"
                  size={20}
                />
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className={cn(siteNameButtonClass, "text-sm")}>
          <span>XYZ Dairy</span>
          <MaterialIcon name="keyboard_arrow_down" size={20} />
        </button>
        <Button variant="outline" size="default">
          Sign Out
        </Button>
      </div>
    </header>
  );
}
