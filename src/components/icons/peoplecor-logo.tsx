import { cn } from "@/lib/utils";

export function PeopleCorLogo({ className }: { className?: string }) {
  return (
    <div
      aria-label="PeopleCor"
      className={cn("flex h-[26px] w-[171.669px] shrink-0 items-center", className)}
    >
      <img
        alt=""
        className="h-[26px] w-[31.2px] shrink-0"
        src="/peoplecor-logo-mark.svg"
      />
      <img
        alt=""
        className="ml-[5px] h-[20.904px] w-[130.936px] shrink-0"
        src="/peoplecor-logo-wordmark.svg"
      />
    </div>
  );
}
