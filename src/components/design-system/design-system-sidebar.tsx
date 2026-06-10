import { designSystemNav, type DesignSystemNavItem } from "@/lib/design-system-nav";
import { cn } from "@/lib/utils";

type DesignSystemSidebarProps = {
  activeId?: string;
};

function NavList({
  activeId,
  depth = 0,
  items,
}: {
  activeId?: string;
  depth?: number;
  items: DesignSystemNavItem[];
}) {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ul
      className={cn(
        "m-0 flex list-none flex-col gap-0 p-0",
        depth > 0 ? "mt-0 pl-2" : "mt-1",
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={cn(
              "ds-notes w-full cursor-pointer border-l-2 py-0.5 pl-2 text-left transition-colors",
              activeId === item.id
                ? "border-brand text-brand"
                : "border-transparent text-subtle hover:border-border hover:text-brand",
            )}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
          {item.children ? (
            <NavList activeId={activeId} depth={depth + 1} items={item.children} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function DesignSystemSidebar({ activeId }: DesignSystemSidebarProps) {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="Design system" className="flex flex-col gap-3">
      {designSystemNav.map((group) => (
        <div key={group.id}>
          <button
            type="button"
            className={cn(
              "ds-notes w-full cursor-pointer py-0 text-left font-semibold text-ink transition-colors",
              activeId === group.id ? "text-brand" : "hover:text-brand",
            )}
            onClick={() => scrollToSection(group.id)}
          >
            {group.label}
          </button>
          {group.children ? <NavList activeId={activeId} items={group.children} /> : null}
        </div>
      ))}
    </nav>
  );
}
