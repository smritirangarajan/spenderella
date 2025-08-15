import { FileSearch, LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  const Icon = icon || FileSearch;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[300px] w-full px-4",
        className
      )}
    >
      {/* Icon container */}
      {Icon && (
        <div className="bg-[var(--secondary-dark-color)] p-4 rounded-full mb-6 shadow-lg ring-1 ring-white/10">
          <Icon className="w-8 h-8 text-white opacity-90" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold tracking-tight text-white mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/70 max-w-sm text-center mb-5 leading-relaxed">
        {description}
      </p>

      {/* Accent bar */}
      <div className="h-1 w-16 bg-gradient-to-r from-[var(--primary-color)] to-white/20 rounded-full" />
    </div>
  );
};
