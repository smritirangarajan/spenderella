import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
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
import TransactionForm from "./transaction-form";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => setOpen(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="!cursor-pointer text-primary-foreground bg-primary hover:bg-primary/90">
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </DrawerTrigger>

      {/* ⬇️ Bump z-index so popups inside aren't hidden behind the drawer overlay */}
      <DrawerContent
        className={cn(
          "z-[60]", // <-- important: above Radix overlay (~z-50)
          "max-w-md w-full bg-background shadow-lg border-l",
          "overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        )}
      >
        <DrawerHeader className="relative px-5 py-4 border-b bg-muted/10">
          <div>
            <DrawerTitle className="text-xl font-semibold tracking-tight">
              Add Transaction
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground mt-0.5">
              Add a new transaction to track your finances
            </DrawerDescription>
          </div>
          <DrawerClose
            className={cn(
              "absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <XIcon className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>

        <div className="px-5 py-4">
          {/* Inside TransactionForm, set SelectContent/PopoverContent to z-[70] + position='popper' */}
          <TransactionForm onCloseDrawer={onCloseDrawer} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddTransactionDrawer;
