import { useEffect } from "react";
import { DesignSystemButton } from "@/components/design-system/design-system-button";

const MONO_FONTS = [
  "Anonymous Pro",
  "B612 Mono",
  "Courier Prime",
  "Cutive Mono",
  "DM Mono",
  "Fira Code",
  "IBM Plex Mono",
  "Inconsolata",
  "JetBrains Mono",
  "Nova Mono",
  "Overpass Mono",
  "PT Mono",
  "Red Hat Mono",
  "Roboto Mono",
  "Share Tech Mono",
  "Source Code Pro",
  "Space Mono",
  "Ubuntu Mono",
] as const;

const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${MONO_FONTS.map(
  (font) => `family=${font.replace(/ /g, "+")}`,
).join("&")}&display=swap`;

type MonoFontComparisonPageProps = {
  onClose: () => void;
};

export function MonoFontComparisonPage({ onClose }: MonoFontComparisonPageProps) {
  useEffect(() => {
    const linkId = "mono-font-comparison-stylesheet";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    link.href = GOOGLE_FONTS_URL;

    return () => {
      link?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-10 lg:py-12">
      <header className="mb-16 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="ds-notes m-0 text-muted">Temporary comparison</p>
          <h1 className="ds-heading m-0 mt-2 text-2xl font-semibold tracking-tight text-ink">
            Google Mono Fonts
          </h1>
          <p className="ds-notes m-0 mt-3 max-w-xl text-subtle">
            {MONO_FONTS.length} monospace families from Google Fonts. Each sample shows
            Foundations in sentence case and uppercase.
          </p>
        </div>
        <DesignSystemButton onClick={onClose}>Close</DesignSystemButton>
      </header>

      <div className="flex flex-col gap-20">
        {MONO_FONTS.map((fontFamily) => (
          <section key={fontFamily} className="border-b border-border pb-20 last:border-0">
            <p className="ds-notes m-0 mb-6 text-muted">{fontFamily}</p>
            <div className="flex flex-col gap-4">
              <p
                className="m-0 text-2xl font-semibold tracking-tight text-ink"
                style={{ fontFamily: `"${fontFamily}", monospace` }}
              >
                Foundations
              </p>
              <p
                className="m-0 text-2xl font-semibold uppercase tracking-tight text-ink"
                style={{ fontFamily: `"${fontFamily}", monospace` }}
              >
                Foundations
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
