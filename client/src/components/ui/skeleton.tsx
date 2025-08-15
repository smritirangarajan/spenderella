import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base shape
        "rounded-xl relative overflow-hidden isolate",
        // Background shimmer
        "bg-accent/60 dark:bg-accent/40",
        // Subtle glow
        "shadow-xs ring-1 ring-inset ring-border/20",
        // Animation magic
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
