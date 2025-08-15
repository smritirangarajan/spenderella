import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="panel-fairy rounded-2xl border border-gray-100 dark:border-border !shadow-none">
      <CardHeader className="!pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Showing all recent transactions
            </CardDescription>
          </div>
          <CardAction>
            <Button
              asChild
              variant="link"
              className="!text-primary dark:!text-primary-light font-normal"
            >
              <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
            </Button>
          </CardAction>
        </div>
        <Separator className="mt-3 !bg-gray-100 dark:!bg-gray-800" />
      </CardHeader>
      <CardContent className="pt-0">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
