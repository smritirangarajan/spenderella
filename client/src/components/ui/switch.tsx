import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base shape
        "peer inline-flex h-[1.4rem] w-9 shrink-0 items-center rounded-full border border-transparent outline-none",
        // Glassy background
        "backdrop-blur-md bg-input/50 dark:bg-input/40 ring-1 ring-border/60 shadow-sm",
        // State colors
        "data-[state=checked]:bg-primary/80 data-[state=checked]:ring-primary/50",
        "data-[state=unchecked]:bg-input/50 dark:data-[state=unchecked]:bg-input/30",
        // Focus ring
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Smooth transitions
        "transition-[background,transform,box-shadow] duration-200 ease-out",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Base thumb
          "pointer-events-none block size-4 rounded-full shadow-sm ring-0",
          // Glassy thumb with backdrop
          "bg-background/90 dark:bg-foreground/90 backdrop-blur-sm",
          // Motion
          "transition-transform duration-200 ease-out",
          // State transform
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
