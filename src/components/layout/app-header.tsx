import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { PeopleCorLogo } from "@/components/icons/peoplecor-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type NavItem = {
  active?: boolean;
  dropdown?: boolean;
  label: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard" },
  { label: "Employees" },
  { label: "Time & Attendance", active: true, dropdown: true },
  { label: "Payroll", dropdown: true },
  { label: "Reports" },
  { label: "Communication", dropdown: true },
  { label: "Resources" },
];

const siteNameButtonClass =
  "flex cursor-pointer items-center gap-0 rounded-sm py-1.5 pl-1.5 pr-0.5 text-white transition-colors hover:bg-white/10";

const navGapPx = 4;

function NavItemButton({
  className,
  item,
  ...props
}: {
  item: NavItem;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 shrink-0 cursor-pointer items-center gap-0 rounded-sm px-2 text-sm font-semibold text-white transition-colors",
        item.active ? "bg-brand-dark hover:bg-brand-dark" : "hover:bg-nav-hover",
        className,
      )}
      {...props}
    >
      {item.label}
      {item.dropdown ? (
        <MaterialIcon name="arrow_drop_down" className="opacity-90" size={20} />
      ) : null}
    </button>
  );
}

function useResponsiveNavCount(itemCount: number) {
  const navRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(itemCount);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) {
      return;
    }

    const update = () => {
      const itemButtons = measure.querySelectorAll<HTMLElement>("[data-nav-measure-item]");
      const moreButton = measure.querySelector<HTMLElement>("[data-nav-measure-more]");
      const widths = Array.from(itemButtons).map((button) => button.offsetWidth);
      const moreWidth = moreButton?.offsetWidth ?? 0;
      const available = nav.clientWidth;

      let count = itemCount;
      while (count > 0) {
        const overflowCount = itemCount - count;
        const visibleWidth =
          widths.slice(0, count).reduce((total, width, index) => {
            return total + width + (index > 0 ? navGapPx : 0);
          }, 0) +
          (overflowCount > 0 ? moreWidth + (count > 0 ? navGapPx : 0) : 0);

        if (visibleWidth <= available) {
          break;
        }

        count -= 1;
      }

      setVisibleCount(count);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(nav);

    return () => observer.disconnect();
  }, [itemCount]);

  return { measureRef, navRef, visibleCount };
}

export function AppHeader() {
  const { measureRef, navRef, visibleCount } = useResponsiveNavCount(navItems.length);
  const visibleItems = navItems.slice(0, visibleCount);
  const overflowItems = navItems.slice(visibleCount);

  return (
    <header
      className="flex h-[48px] items-center justify-between gap-4 bg-brand-dark px-6 text-white"
      {...inspectorProps(inspectorRegistry.HDR)}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <div className="mr-3 flex shrink-0 items-center pr-3">
          <PeopleCorLogo />
        </div>

        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute flex items-center gap-1"
        >
          {navItems.map((item) => (
            <NavItemButton key={item.label} data-nav-measure-item item={item} tabIndex={-1} />
          ))}
          <NavItemButton
            data-nav-measure-more
            item={{ label: "More", dropdown: true }}
            tabIndex={-1}
          />
        </div>

        <nav ref={navRef} className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          {visibleItems.map((item) => (
            <NavItemButton key={item.label} item={item} />
          ))}

          {overflowItems.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 shrink-0 cursor-pointer items-center gap-0 rounded-sm px-2 text-sm font-semibold text-white transition-colors hover:bg-nav-hover data-[state=open]:bg-nav-hover"
                  {...inspectorProps(inspectorRegistry["HDR-MOR"])}
                >
                  More
                  <MaterialIcon name="arrow_drop_down" className="opacity-90" size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                {overflowItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    className={cn(
                      item.active && "bg-brand-muted-on-white font-semibold text-brand",
                    )}
                  >
                    {item.label}
                    {item.dropdown ? (
                      <MaterialIcon name="arrow_drop_down" className="ml-auto text-muted" size={18} />
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button type="button" className={cn(siteNameButtonClass, "text-sm")}>
          <span>XYZ Dairy</span>
          <MaterialIcon name="arrow_drop_down" size={20} />
        </button>
        <Button variant="outline" size="default">
          Sign Out
        </Button>
      </div>
    </header>
  );
}
