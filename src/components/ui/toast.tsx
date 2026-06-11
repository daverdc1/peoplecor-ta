import { useCallback, useEffect, useRef, useState } from "react";
import { AlertBadgeIcon } from "@/components/icons/alert-badge-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

const DISSOLVE_MS = 200;
const AUTO_DISMISS_MS = 5000;

export type ToastAction = "approved" | "unapproved" | "approval-blocked";

const materialToastIcons = {
  approved: {
    icon: "check_circle",
    iconClassName: "text-success",
    filled: true,
  },
  unapproved: {
    icon: "undo",
    iconClassName: "text-warning",
    filled: false,
  },
} as const;

type ToastProps = {
  action: ToastAction;
  message: string;
  onDismiss: () => void;
  onUndo?: () => void;
};

export function Toast({ action, message, onDismiss, onUndo }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) {
      return;
    }

    dismissedRef.current = true;
    setVisible(false);
    window.setTimeout(onDismiss, DISSOLVE_MS);
  }, [onDismiss]);

  const handleUndo = () => {
    onUndo?.();
    dismiss();
  };

  useEffect(() => {
    dismissedRef.current = false;
    setVisible(false);

    const enterFrame = requestAnimationFrame(() => {
      setVisible(true);
    });
    const timeoutId = window.setTimeout(dismiss, AUTO_DISMISS_MS);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(timeoutId);
    };
  }, [action, dismiss, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      {...inspectorProps(inspectorRegistry.TST)}
      className={cn(
        "fixed bottom-6 left-1/2 z-50 flex min-w-[420px] -translate-x-1/2 items-center justify-between gap-3 rounded-sm bg-black px-4 py-2.5 text-sm text-white shadow-md transition-opacity duration-200 ease-in-out",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2.5">
        {action === "approval-blocked" ? (
          <AlertBadgeIcon size={20} />
        ) : (
          <MaterialIcon
            name={materialToastIcons[action].icon}
            className={materialToastIcons[action].iconClassName}
            filled={materialToastIcons[action].filled}
            size={20}
          />
        )}
        {message}
      </span>
      {onUndo ? (
        <button
          type="button"
          className="shrink-0 cursor-pointer text-sm font-semibold text-white hover:underline"
          onClick={handleUndo}
        >
          Undo
        </button>
      ) : null}
      <button
        type="button"
        aria-label="Close notification"
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-white/70 hover:bg-white/10 hover:text-white"
        onClick={dismiss}
      >
        <MaterialIcon name="close" size={16} />
      </button>
    </div>
  );
}
