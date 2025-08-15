/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Info, Terminal, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type AlertVariant = "default" | "destructive" | "success" | "warning" | "info";

interface AppAlertProps {
  isError?: boolean; // legacy trigger; if true, shows and auto-hides
  message: string;
  title?: string;
  variant?: AlertVariant;
  position?:
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left"
    | "center";
  autoHideDuration?: number;
  onDismiss?: () => void;
  className?: string;
  showDismissButton?: boolean;
}

/** Spenderella glass + ring + token-aware text */
const baseGlass =
  "rounded-2xl backdrop-blur-md ring-1 ring-border/60 shadow-lg/30 shadow-sm";

const variantClasses: Record<AlertVariant, string> = {
  default:
    `${baseGlass} bg-card/85 text-foreground`,
  destructive:
    `${baseGlass} bg-[oklch(0.97_0.02_25)/92] dark:bg-[oklch(0.25_0.06_25)/50] text-[oklch(0.46_0.18_25)] dark:text-[oklch(0.78_0.12_25)] ring-[oklch(0.67_0.14_25)/35]`,
  success:
    `${baseGlass} bg-[oklch(0.98_0.03_150)/92] dark:bg-[oklch(0.25_0.05_150)/50] text-[oklch(0.38_0.12_150)] dark:text-[oklch(0.85_0.12_150)] ring-[oklch(0.72_0.15_150)/35]`,
  warning:
    `${baseGlass} bg-[oklch(0.99_0.05_85)/90] dark:bg-[oklch(0.3_0.05_85)/50] text-[oklch(0.51_0.13_85)] dark:text-[oklch(0.9_0.12_85)] ring-[oklch(0.82_0.16_85)/35]`,
  info:
    `${baseGlass} bg-[oklch(0.98_0.02_240)/92] dark:bg-[oklch(0.28_0.03_240)/50] text-[oklch(0.38_0.04_240)] dark:text-[oklch(0.9_0.03_240)] ring-[oklch(0.82_0.05_240)/35]`,
};

const iconMap: Record<AlertVariant, JSX.Element> = {
  default: <Terminal className="h-4 w-4" />,
  destructive: <AlertTriangle className="h-4 w-4" />,
  success: <Check className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

const positionClasses: Record<NonNullable<AppAlertProps["position"]>, string> = {
  top: "fixed top-4 left-1/2 -translate-x-1/2",
  "top-right": "fixed top-4 right-4",
  "top-left": "fixed top-4 left-4",
  bottom: "fixed bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "fixed bottom-4 right-4",
  "bottom-left": "fixed bottom-4 left-4",
  center:
    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export const AppAlert = ({
  isError = false,
  title = "Notice",
  message,
  variant = "destructive",
  position = "top-right",
  autoHideDuration = 5000,
  onDismiss,
  className,
  showDismissButton = true,
}: AppAlertProps) => {
  // Internal visibility (driven by isError + autoHide)
  const [visible, setVisible] = useState<boolean>(isError);

  useEffect(() => {
    if (!isError) return;
    setVisible(true);
    if (autoHideDuration > 0) {
      const t = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideDuration);
      return () => clearTimeout(t);
    }
  }, [isError, autoHideDuration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  // Accessibility: destructive/warning should announce assertively
  const ariaLive = useMemo<"polite" | "assertive">(
    () => (variant === "destructive" || variant === "warning" ? "assertive" : "polite"),
    [variant]
  );

  // If you want this component usable in "inline" mode, you can omit position prop in the parent
  const isInline = !position;

  return (
    <div
      className={cn(
        "z-50 max-w-[min(36rem,calc(100%-2rem))] w-full",
        !isInline && positionClasses[position],
        // motion
        visible
          ? "animate-in fade-in-50 slide-in-from-top-2 duration-200"
          : "pointer-events-none opacity-0 transition-opacity duration-200",
        className
      )}
      role="region"
      aria-live={ariaLive}
    >
      <Alert
        role="alert"
        className={cn(
          "relative flex items-start gap-4 pr-10 pl-4 py-3 gilded-focus",
          "brand-ring", // custom tiny golden ring on focus, if you have it
          variantClasses[variant]
        )}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {iconMap[variant]}
            <AlertTitle className="font-semibold">{title}</AlertTitle>
          </div>
          <AlertDescription className="text-sm leading-relaxed">
            {message}
          </AlertDescription>
        </div>

        {showDismissButton && (
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </Alert>
    </div>
  );
};
