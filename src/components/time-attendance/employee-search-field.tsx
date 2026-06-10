import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type EmployeeSearchFieldProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function EmployeeSearchField({
  value: controlledValue,
  onValueChange,
}: EmployeeSearchFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue ?? uncontrolledValue;
  const isExpanded = isFocused || value.length > 0;

  const setValue = (nextValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const clearSearch = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative shrink-0 transition-[width] duration-200 ease-out",
        isExpanded ? "w-[240px]" : "w-[180px]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 bg-muted"
        style={{
          maskImage: "url(/search-icon.png)",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "contain",
          WebkitMaskImage: "url(/search-icon.png)",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
        }}
      />
      <Input
        ref={inputRef}
        aria-label="Search employees"
        className={cn("pl-7", value.length > 0 && "pr-8")}
        onBlur={() => setIsFocused(false)}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search employees"
        value={value}
      />
      {value.length > 0 ? (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer rounded-full text-muted transition-colors hover:text-ink"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearSearch}
        >
          <MaterialIcon name="cancel" filled size={16} />
        </button>
      ) : null}
    </div>
  );
}
