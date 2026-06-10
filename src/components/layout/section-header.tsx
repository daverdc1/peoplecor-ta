import { DownloadXlsIcon } from "@/components/icons/download-xls-icon";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";

export function SectionHeader() {
  return (
    <div className="flex h-[60px] items-center justify-between bg-page px-6">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-brand text-white">
          <MaterialIcon name="schedule" className="text-white" size={14} />
        </div>
        <h1 className="text-base font-bold uppercase tracking-wide text-ink">
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
