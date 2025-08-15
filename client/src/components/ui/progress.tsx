import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        // base shape & layout
        "relative h-2 w-full overflow-hidden rounded-full",
        // glassy track
        "bg-primary/10 dark:bg-primary/15 backdrop-blur-[2px]",
        // inner shadow for depth
        "shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          // primary fill
          "h-full w-full flex-1 rounded-full",
          // gradient shimmer effect
          "bg-gradient-to-r from-primary via-primary/80 to-primary",
          "animate-[spenderella-shimmer_2s_infinite_linear]",
          // smooth transition when value changes
          "transition-transform ease-out duration-500"
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
