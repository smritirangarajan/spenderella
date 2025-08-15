import SignUpForm from "../_component/signup-form";
import spenderellaLogo from "../../assets/images/logo.png"; // Your new logo
import { cn } from "@/lib/utils";

const SignUp = () => {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background p-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-8 text-center">
        <img
          src={spenderellaLogo}
          alt="Spenderella Logo"
          className="w-24 h-24"
        />
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Spenderella</span>
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your AI-powered personal finance companion — get insights, reports,
          and smart tracking to manage your money effortlessly.
        </p>
      </div>

      {/* Sign up form */}
      <div
        className={cn(
          "w-full max-w-md p-6 rounded-xl shadow-lg border border-border bg-card"
        )}
      >
        <SignUpForm />
      </div>

      {/* Footer / CTA */}
      <p className="mt-6 text-sm text-muted-foreground text-center max-w-sm">
        Already have an account?{" "}
        <a
          href="/auth/sign-in"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUp;
