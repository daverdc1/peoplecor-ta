import { cn } from "@/lib/utils";

export type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  weight?: number;
};

export function MaterialIcon({
  name,
  className,
  filled = false,
  size = 20,
  weight = 400,
}: MaterialIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "material-symbols-rounded inline-block shrink-0 align-middle leading-none",
        className,
      )}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
