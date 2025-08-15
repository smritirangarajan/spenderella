import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageHeader?: ReactNode;
  /** "glam" = gradient + glass + sparkles, "plain" = subtle panel */
  variant?: "glam" | "plain";
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the inner container (max-width wrapper) */
  innerClassName?: string;
}

const PageHeader = ({
  title,
  subtitle,
  rightAction,
  renderPageHeader,
  variant = "glam",
  className,
  innerClassName,
}: PageHeaderProps) => {
  // Make the header create a stacking context and stay above page content.
  const baseWrapper =
    "relative z-20 pointer-events-auto w-full px-5 lg:px-0 py-6 lg:py-8 border-b border-border";
  const glamStyles = "castle-gradient card-glass spenderella-sparkle";
  const plainStyles = "bg-[var(--bg-color)] dark:bg-background";

  return (
    <div
      className={cn(
        baseWrapper,
        variant === "glam" ? glamStyles : plainStyles,
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          "relative z-20 w-full max-w-[var(--max-width)] mx-auto",
          "pointer-events-auto",
          innerClassName
        )}
      >
        {renderPageHeader ? (
          <Fragment>{renderPageHeader}</Fragment>
        ) : (
          <div className="w-full flex flex-col gap-4 items-start justify-start lg:flex-row lg:items-center lg:justify-between">
            {(title || subtitle) && (
              <div className="space-y-1">
                {title && (
                  <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight brand-spenderella">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
            {rightAction && (
              <div className="flex items-center gap-2">{rightAction}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
