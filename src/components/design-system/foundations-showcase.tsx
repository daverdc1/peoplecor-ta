import { colorTokenGroups } from "@/lib/design-tokens";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

function Swatch({
  className,
  name,
  value,
}: {
  className: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-12 rounded-sm border border-border", className)} />
      <div>
        <p className="ds-heading m-0 text-sm font-medium text-ink">{name}</p>
        <p className="ds-notes m-0 text-muted">{value}</p>
      </div>
    </div>
  );
}

export function FoundationsShowcase() {
  return (
    <div className="flex flex-col gap-14">
      <section
        className="scroll-mt-8"
        id="ds-colors"
        {...inspectorProps(inspectorRegistry["DS-CLR"])}
      >
        <h3 className="ds-heading m-0 text-lg font-semibold tracking-tight text-ink">
          Colors
        </h3>
        <div className="mt-4 rounded-md bg-ds-surface p-6">
          <div className="flex flex-col gap-10">
            {colorTokenGroups.map((group) => (
              <div key={group.label}>
                <h4 className="ds-heading m-0 text-xs font-bold uppercase tracking-wider text-subtle">
                  {group.label}
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {group.tokens.map((token) => (
                    <Swatch
                      key={token.name}
                      className={token.className}
                      name={token.name}
                      value={token.value}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-8"
        id="ds-typography"
        {...inspectorProps(inspectorRegistry["DS-TYP"])}
      >
        <h3 className="ds-heading m-0 text-lg font-semibold tracking-tight text-ink">
          Typography
        </h3>
        <div className="mt-4 flex flex-col gap-4 rounded-md bg-ds-surface p-6">
          <p className="m-0 text-2xl font-semibold text-ink">Page title / 24 semibold</p>
          <p className="m-0 text-base font-semibold text-ink">Section title / 16 semibold</p>
          <p className="m-0 text-sm leading-5 text-ink">Body / 14 regular</p>
          <p className="m-0 text-xs font-bold uppercase text-subtle">
            Label / 12 bold uppercase
          </p>
          <p className="m-0 text-[10.5px] leading-3 text-muted">
            Caption / 10.5 regular
          </p>
        </div>
      </section>
    </div>
  );
}
