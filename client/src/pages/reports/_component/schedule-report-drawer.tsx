import { useState } from "react";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import ScheduleReportForm from "./schedule-report-form";

type ScheduleReportDrawerProps = {
  /** Optional class to style the trigger button from parent */
  triggerClassName?: string;
  /** Optional custom title/description */
  title?: string;
  description?: string;
};

const ScheduleReportDrawer = ({
  triggerClassName,
  title = "Report Settings",
  description = "Enable or disable monthly financial report emails",
}: ScheduleReportDrawerProps) => {
  const [open, setOpen] = useState(false);
  const onCloseDrawer = () => setOpen(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn("btn-princess gilded-focus gap-2", triggerClassName)}
          aria-expanded={open}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Report Settings</span>
        </Button>
      </DrawerTrigger>

      {/* right-side sheet: keep solid, rounded left edge, tidy scroll */}
      <DrawerContent className="ml-auto w-full max-w-md panel-fairy rounded-l-2xl overflow-y-auto">
        <DrawerHeader className="relative pb-2">
          <div>
            <DrawerTitle className="text-xl font-semibold brand-spenderella">
              {title}
            </DrawerTitle>
            <DrawerDescription className="-mt-1">
              {description}
            </DrawerDescription>
          </div>
          <DrawerClose
            className="absolute right-4 top-4 rounded-full p-1 transition hover:bg-muted focus-visible:outline-none gilded-focus"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>

        {/* content */}
        <div className="px-4 pb-6">
          <div className="panel-fairy p-4">
            <ScheduleReportForm onCloseDrawer={onCloseDrawer} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ScheduleReportDrawer;
