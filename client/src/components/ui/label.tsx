"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Base layout & typography
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        // Spenderella theme enhancements
        "tracking-wide text-foreground/90",
        "transition-colors duration-200",
        // Hover/focus soft accent glow
        "hover:text-accent-foreground focus-within:text-accent-foreground",
        // Disabled states
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
