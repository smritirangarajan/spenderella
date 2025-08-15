import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
  } from "@/components/ui/drawer";
  import TransactionForm from "./transaction-form";
  import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
  import { cn } from "@/lib/utils";
  
  const EditTransactionDrawer = () => {
    const { open, transactionId, onCloseDrawer } = useEditTransactionDrawer();
  
    return (
      <Drawer open={open} onOpenChange={onCloseDrawer} direction="right">
        <DrawerContent
          className={cn(
            "max-w-md w-full bg-background shadow-lg border-l",
            "overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          )}
        >
          <DrawerHeader className="px-5 py-4 border-b bg-muted/10">
            <DrawerTitle className="text-xl font-semibold tracking-tight">
              Edit Transaction
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground mt-0.5">
              Update details to keep your records accurate
            </DrawerDescription>
          </DrawerHeader>
  
          <div className="px-5 py-4">
            <TransactionForm
              isEdit
              transactionId={transactionId}
              onCloseDrawer={onCloseDrawer}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default EditTransactionDrawer;
  