import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

function TruncationTooltip({
  show,
  children,
  anchorRef,
}: {
  show: boolean;
  children: string;
  anchorRef: RefObject<HTMLElement | null>;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!show || !anchorRef.current) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      setPosition({
        top: rect.top - 6,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorRef, children, show]);

  if (!show) {
    return null;
  }

  return createPortal(
    <span
      role="tooltip"
      className="pointer-events-none fixed z-[200] max-w-[220px] -translate-x-1/2 -translate-y-full rounded-sm bg-ink px-2 py-1 text-center text-xs leading-4 font-normal normal-case text-white shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </span>,
    document.body,
  );
}

export function HoverTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {children}
      <TruncationTooltip anchorRef={anchorRef} show={showTooltip}>
        {label}
      </TruncationTooltip>
    </span>
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
      onMouseEnter={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onBlur={() => setShowTooltip(false)}
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
      onMouseEnter={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => {
        if (isTruncated) {
          setShowTooltip(true);
        }
      }}
      onBlur={() => setShowTooltip(false)}
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
