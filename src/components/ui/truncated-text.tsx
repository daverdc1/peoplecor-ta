import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { TooltipPortal } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export { HoverTooltip } from "@/components/ui/hover-tooltip";

function TruncationTooltip({
  show,
  children,
  anchorRef,
}: {
  show: boolean;
  children: string;
  anchorRef: RefObject<HTMLElement | null>;
}) {
  return (
    <TooltipPortal
      anchorRef={anchorRef}
      className="max-w-[220px] px-2 py-1 text-center text-xs leading-4 font-normal normal-case"
      show={show}
    >
      {children}
    </TooltipPortal>
  );
}

function useTruncationObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,
  dependency: string,
) {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    checkTruncation();
    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [dependency, ref]);

  return isTruncated;
}

type TruncatedTextProps = {
  children: string;
  className?: string;
  inline?: boolean;
} & Omit<ComponentPropsWithoutRef<"p">, "children" | "className">;

type TruncatedButtonProps = {
  children: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function TruncatedText({
  children,
  className,
  inline = false,
  ...props
}: TruncatedTextProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTruncated = useTruncationObserver(textRef, children);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      ref={anchorRef}
      className={cn(
        "relative min-w-0 max-w-full",
        inline ? "inline-block" : "block",
      )}
      onBlur={() => setShowTooltip(false)}
      onFocus={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseEnter={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <p ref={textRef} className={cn("m-0 truncate", className)} {...props}>
        {children}
      </p>
      <TruncationTooltip
        anchorRef={anchorRef}
        show={isTruncated && showTooltip}
      >
        {children}
      </TruncationTooltip>
    </span>
  );
}

export function TruncatedButton({
  children,
  className,
  type = "button",
  ...props
}: TruncatedButtonProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLButtonElement>(null);
  const isTruncated = useTruncationObserver(textRef, children);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      ref={anchorRef}
      className="relative block min-w-0 max-w-full"
      onBlur={() => setShowTooltip(false)}
      onFocus={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseEnter={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        ref={textRef}
        type={type}
        className={cn("m-0 truncate", className)}
        {...props}
      >
        {children}
      </button>
      <TruncationTooltip
        anchorRef={anchorRef}
        show={isTruncated && showTooltip}
      >
        {children}
      </TruncationTooltip>
    </span>
  );
}

export function TruncatedInline({
  children,
  tooltip,
  className,
}: {
  children: ReactNode;
  tooltip: string;
  className?: string;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTruncated = useTruncationObserver(textRef, tooltip);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      ref={anchorRef}
      className="relative block min-w-0 max-w-full"
      onMouseEnter={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <p ref={textRef} className={cn("m-0 truncate", className)}>
        {children}
      </p>
      <TruncationTooltip
        anchorRef={anchorRef}
        show={isTruncated && showTooltip}
      >
        {tooltip}
      </TruncationTooltip>
    </span>
  );
}
