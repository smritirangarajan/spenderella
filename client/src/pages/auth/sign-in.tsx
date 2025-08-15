import SignInForm from "../_component/signin-form";
import spenderellaLogo from "../../assets/images/logo.png"; // Your new logo
import { cn } from "@/lib/utils";

const SignIn = () => {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background p-6">
      {/* Logo + Headline */}
      <div className="flex flex-col items-center gap-4 mb-8 text-center">
        <img
          src={spenderellaLogo}
          alt="Spenderella Logo"
          className="w-24 h-24"
        />
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back to <span className="text-primary">Spenderella</span>
        </h1>
        <p className="text-muted-foreground max-w-md">
          Log in to manage your finances, track spending, and unlock AI-powered
          insights.
        </p>
      </div>

      {/* Sign in form */}
      <div
        className={cn(
          "w-full max-w-md p-6 rounded-xl shadow-lg border border-border bg-card"
        )}
      >
        <SignInForm />
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-muted-foreground text-center max-w-sm">
        Don&apos;t have an account?{" "}
        <a
          href="/auth/sign-up"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

export default SignIn;
