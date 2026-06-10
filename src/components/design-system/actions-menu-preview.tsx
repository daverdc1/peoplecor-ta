import { MaterialIcon } from "@/components/icons/material-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";
import { cn } from "@/lib/utils";

type ActionsMenuPreviewProps = {
  className?: string;
  defaultOpen?: boolean;
  prepMode?: boolean;
  showTrigger?: boolean;
  variant?: "full" | "approve" | "standard" | "adjustments" | "destructive" | "trigger";
};

function menuPanelClassName(className?: string) {
  return cn(
    "min-w-[200px] rounded-lg border border-border bg-white p-1 text-ink shadow-[0_8px_16px_rgba(0,0,0,0.16)]",
    className,
  );
}

function menuItemClassName(className?: string) {
  return cn(
    "flex h-8 items-center gap-1.5 rounded-sm px-2 text-sm",
    className,
  );
}

function ActionsMenuPanel({
  className,
  prepMode,
}: {
  className?: string;
  prepMode: boolean;
}) {
  return (
    <div className={menuPanelClassName(className)}>
      <div
        className={menuItemClassName("font-semibold text-success-dark")}
        {...inspectorProps(inspectorRegistry["DS-MNU-01"])}
      >
        <MaterialIcon name="check_circle" className="text-success-dark" filled size={14} />
        Approve timesheet
      </div>
      <div className={menuItemClassName()} {...inspectorProps(inspectorRegistry["DS-MNU-02"])}>
        <MaterialIcon name="verified" className="text-muted" size={14} />
        Verify labor
      </div>
      <div className={menuItemClassName()} {...inspectorProps(inspectorRegistry["DS-MNU-03"])}>
        <MaterialIcon name="download" className="text-muted" size={14} />
        Download timesheet
      </div>

      <div className="flex h-2 items-center px-0">
        <div className="h-px w-full bg-border" />
      </div>

      <div className={menuItemClassName()} {...inspectorProps(inspectorRegistry["DS-MNU-04"])}>
        <MaterialIcon name="edit" className="text-muted" size={14} />
        Edit timesheet
      </div>

      {prepMode ? (
        <>
          <div className="flex h-2 items-center px-0">
            <div className="h-px w-full bg-border" />
          </div>
          <div className="flex h-7 items-center px-2 text-xs font-semibold text-subtle">
            Create Adjustment
          </div>
          <div className={menuItemClassName()} {...inspectorProps(inspectorRegistry["DS-MNU-05"])}>
            <MaterialIcon name="add_circle" className="text-muted" size={14} />
            One-Time Addition
          </div>
          <div className={menuItemClassName()} {...inspectorProps(inspectorRegistry["DS-MNU-06"])}>
            <MaterialIcon name="remove_circle" className="text-muted" size={14} />
            Recurring Deduction
          </div>
        </>
      ) : null}

      <div className="flex h-2 items-center px-0">
        <div className="h-px w-full bg-border" />
      </div>

      <div
        className={menuItemClassName("text-danger-text")}
        {...inspectorProps(inspectorRegistry["DS-MNU-07"])}
      >
        <MaterialIcon name="close" className="text-danger-text" size={14} />
        Delete timesheet
      </div>
    </div>
  );
}

export function ActionsMenuPreview({
  className,
  defaultOpen = false,
  prepMode = true,
  showTrigger = true,
  variant = "full",
}: ActionsMenuPreviewProps) {
  if (variant === "trigger") {
    return (
      <button
        type="button"
        className={cn(
          "flex size-8 items-center justify-center rounded-sm text-ink",
          className,
        )}
      >
        <MaterialIcon name="more_vert" size={20} />
      </button>
    );
  }

  if (variant === "approve") {
    return (
      <div className={menuPanelClassName(className)}>
        <div className={menuItemClassName("font-semibold text-success-dark")}>
          <MaterialIcon name="check_circle" className="text-success-dark" filled size={14} />
          Approve timesheet
        </div>
      </div>
    );
  }

  if (variant === "standard") {
    return (
      <div className={menuPanelClassName(className)}>
        <div className={menuItemClassName()}>
          <MaterialIcon name="verified" className="text-muted" size={14} />
          Verify labor
        </div>
        <div className={menuItemClassName()}>
          <MaterialIcon name="download" className="text-muted" size={14} />
          Download timesheet
        </div>
      </div>
    );
  }

  if (variant === "adjustments") {
    return (
      <div className={menuPanelClassName(className)}>
        <div className="flex h-7 items-center px-2 text-xs font-semibold text-subtle">
          Create Adjustment
        </div>
        <div className={menuItemClassName()}>
          <MaterialIcon name="add_circle" className="text-muted" size={14} />
          One-Time Addition
        </div>
        <div className={menuItemClassName()}>
          <MaterialIcon name="remove_circle" className="text-muted" size={14} />
          Recurring Deduction
        </div>
      </div>
    );
  }

  if (variant === "destructive") {
    return (
      <div className={menuPanelClassName(className)}>
        <div className={menuItemClassName("text-danger-text")}>
          <MaterialIcon name="close" className="text-danger-text" size={14} />
          Delete timesheet
        </div>
      </div>
    );
  }

  if (defaultOpen) {
    return (
      <div className={cn("inline-flex items-start gap-3", className)}>
        {showTrigger ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="flex size-8 items-center justify-center rounded-sm bg-surface-muted text-ink"
          >
            <MaterialIcon name="more_vert" size={20} />
          </button>
        ) : null}
        <ActionsMenuPanel prepMode={prepMode} />
      </div>
    );
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      {showTrigger ? (
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-sm text-ink hover:bg-surface-muted data-[state=open]:bg-surface-muted"
          >
            <MaterialIcon name="more_vert" size={20} />
          </button>
        </DropdownMenuTrigger>
      ) : (
        <span className="sr-only">
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        </span>
      )}
      <DropdownMenuContent align="start" className="min-w-[200px]">
        <DropdownMenuItem className="font-semibold text-success-dark focus:bg-success-muted focus:text-success-dark data-[highlighted]:bg-success-muted data-[highlighted]:text-success-dark">
          <MaterialIcon name="check_circle" className="text-success-dark" filled size={14} />
          Approve timesheet
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="verified" className="text-muted" size={14} />
          Verify labor
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MaterialIcon name="download" className="text-muted" size={14} />
          Download timesheet
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <MaterialIcon name="edit" className="text-muted" size={14} />
          Edit timesheet
        </DropdownMenuItem>

        {prepMode ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Create Adjustment</DropdownMenuLabel>
            <DropdownMenuItem>
              <MaterialIcon name="add_circle" className="text-muted" size={14} />
              One-Time Addition
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon name="remove_circle" className="text-muted" size={14} />
              Recurring Deduction
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-danger-text focus:bg-danger/5 focus:text-danger-text data-[highlighted]:bg-danger/5 data-[highlighted]:text-danger-text">
          <MaterialIcon name="close" className="text-danger-text" size={14} />
          Delete timesheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
