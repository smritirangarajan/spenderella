import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./components/account.form";

const Account = () => {
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="account-title"
        className="card-princess spenderella-sparkle p-6"
      >
        <header className="mb-3">
          <h3 id="account-title" className="text-xl font-semibold brand-spenderella">
            Account
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your <span className="font-medium">Spenderella</span> profile details.
          </p>
        </header>



       <Separator className="my-4 bg-[var(--border)]/80" />

        <div className="space-y-4 [&_input]:input-fairy [&_select]:input-fairy [&_textarea]:input-fairy">
        <AccountForm />
        </div>
      </section>
    </div>
  );
};

export default Account;
