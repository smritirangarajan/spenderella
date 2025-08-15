import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";

export default function Transactions() {
  return (
    <PageLayout
      title="Spenderella · All Transactions"
      subtitle="Every pumpkin turns into savings by midnight ✨"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          {/* If these components accept className/triggerClassName, pass the princess buttons through.
             If not, omit the props and style their internal trigger instead. */}
          <ImportTransactionModal
            // @ts-expect-error (only if supported)
            triggerClassName="btn-outline-rose"
          />
          <AddTransactionDrawer
            // @ts-expect-error (only if supported)
            triggerClassName="btn-princess"
          />
        </div>
      }
      // If PageLayout supports a headerClassName, uncomment the next line:
      // headerClassName="castle-gradient card-glass spenderella-sparkle"
    >
      {/* Glassy content card with subtle sparkles */}
      <Card className="card-princess spenderella-sparkle border-0 shadow-none">
        <CardContent className="pt-2">
          {/* If TransactionTable doesn’t expose a className for its table element,
              wrap it so we can apply the frosted look + rounded corners */}
          <div className="table-frosted overflow-hidden">
            <TransactionTable pageSize={20} />
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
