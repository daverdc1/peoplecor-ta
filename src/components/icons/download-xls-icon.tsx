import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

export function DownloadXlsIcon({ className }: { className?: string }) {
  return (
    <MaterialIcon
      name="download"
      className={cn("text-brand", className)}
      size={16}
    />
  );
}
