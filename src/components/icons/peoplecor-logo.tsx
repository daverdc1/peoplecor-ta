import { cn } from "@/lib/utils";

type PeopleCorLogoProps = {
  className?: string;
  variant?: "default" | "ink";
};

export function PeopleCorLogo({ className, variant = "default" }: PeopleCorLogoProps) {
  const isInk = variant === "ink";

  return (
    <div
      aria-label="PeopleCor"
      className={cn("flex h-[26px] w-[171.669px] shrink-0 items-center", className)}
    >
      <img
        alt=""
        className="h-[26px] w-[31.2px] shrink-0"
        src={isInk ? "/peoplecor-logo-mark-ink.svg" : "/peoplecor-logo-mark.svg"}
      />
      <img
        alt=""
        className="ml-[5px] h-[20.904px] w-[130.936px] shrink-0"
        src={
          isInk ? "/peoplecor-logo-wordmark-ink.svg" : "/peoplecor-logo-wordmark.svg"
        }
      />
    </div>
  );
}
