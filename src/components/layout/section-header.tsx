import { DownloadXlsIcon } from "@/components/icons/download-xls-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";
import { inspectorRegistry } from "@/lib/inspector-registry";
import { inspectorProps } from "@/lib/inspector";

export function SectionHeader() {
  return (
    <div
      className="flex h-[60px] items-center justify-between bg-page px-6"
      {...inspectorProps(inspectorRegistry.SEC)}
    >
      <div className="flex items-center gap-2">
        <MaterialIcon name="schedule" className="text-brand-dark" filled size={24} />
        <h1 className="text-base font-bold uppercase tracking-normal text-ink">
          Time &amp; Attendance
        </h1>
      </div>

      <Button variant="brandOutline" className="gap-1 px-2">
        <DownloadXlsIcon />
        View All Activities
      </Button>
    </div>
  );
}
