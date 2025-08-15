import { cn } from "@/lib/utils";
import PageHeader from "./page-header";

interface PropsType {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  showHeader?: boolean;
  addMarginTop?: boolean;
  renderPageHeader?: React.ReactNode;
  /** Pass "glam" for gradient sparkle, "plain" for neutral header */
  headerVariant?: "glam" | "plain";
  /** Extra classes for header wrapper */
  headerClassName?: string;
}

const PageLayout = ({
  children,
  className,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
  renderPageHeader,
  headerVariant = "glam",
  headerClassName,
}: PropsType) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          renderPageHeader={renderPageHeader}
          variant={headerVariant}
          className={headerClassName}
        />
      )}
      <div
        className={cn(
          "w-full max-w-[var(--max-width)] mx-auto px-5 lg:px-0 pt-30",
          addMarginTop && "-mt-20 relative z-10",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
