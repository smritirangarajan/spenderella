import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      duration={4200}
      closeButton
      expand
      className="toaster group"
      // Spenderella glass + tokens (works in light/dark)
      toastOptions={{
        classNames: {
          toast:
            [
              "rounded-2xl",
              "bg-[var(--toast-bg)] text-[var(--toast-fg)]",
              "backdrop-blur-md ring-1 ring-[var(--toast-ring)] shadow-sm",
              "border border-[var(--toast-border)]",
              "data-[type=success]:bg-[var(--toast-success-bg)] data-[type=success]:text-[var(--toast-success-fg)] data-[type=success]:ring-[var(--toast-success-ring)] data-[type=success]:border-[var(--toast-success-border)]",
              "data-[type=error]:bg-[var(--toast-error-bg)] data-[type=error]:text-[var(--toast-error-fg)] data-[type=error]:ring-[var(--toast-error-ring)] data-[type=error]:border-[var(--toast-error-border)]",
              "data-[type=warning]:bg-[var(--toast-warning-bg)] data-[type=warning]:text-[var(--toast-warning-fg)] data-[type=warning]:ring-[var(--toast-warning-ring)] data-[type=warning]:border-[var(--toast-warning-border)]",
              "data-[type=info]:bg-[var(--toast-info-bg)] data-[type=info]:text-[var(--toast-info-fg)] data-[type=info]:ring-[var(--toast-info-ring)] data-[type=info]:border-[var(--toast-info-border)]",
            ].join(" "),
          title: "font-semibold tracking-tight",
          description: "text-sm opacity-90",
          actionButton:
            "rounded-full px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90",
          cancelButton:
            "rounded-full px-3 py-1 text-xs font-medium bg-transparent border border-border hover:bg-muted/50",
          closeButton:
            "rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
        },
      }}
      // brandy CSS vars, token-aware (oklch friendly); tweak to your palette if you want
      style={
        {
          // base (normal)
          "--toast-bg": "oklch(1 0 0 / 0.85)",
          "--toast-fg": "var(--foreground)",
          "--toast-border": "var(--border)",
          "--toast-ring": "color-mix(in oklch, var(--ring) 40%, transparent)",
          // success
          "--toast-success-bg": "oklch(0.98 0.03 150 / 0.9)",
          "--toast-success-fg": "oklch(0.35 0.08 150)",
          "--toast-success-ring": "oklch(0.72 0.12 150 / 0.35)",
          "--toast-success-border": "oklch(0.9 0.04 150)",
          // error
          "--toast-error-bg": "oklch(0.97 0.04 25 / 0.92)",
          "--toast-error-fg": "oklch(0.45 0.14 25)",
          "--toast-error-ring": "oklch(0.67 0.14 25 / 0.35)",
          "--toast-error-border": "oklch(0.9 0.04 25)",
          // warning
          "--toast-warning-bg": "oklch(0.99 0.06 85 / 0.9)",
          "--toast-warning-fg": "oklch(0.5 0.12 85)",
          "--toast-warning-ring": "oklch(0.85 0.12 85 / 0.35)",
          "--toast-warning-border": "oklch(0.92 0.05 85)",
          // info
          "--toast-info-bg": "oklch(0.98 0.02 240 / 0.9)",
          "--toast-info-fg": "oklch(0.42 0.03 240)",
          "--toast-info-ring": "oklch(0.82 0.05 240 / 0.35)",
          "--toast-info-border": "oklch(0.9 0.03 240)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
