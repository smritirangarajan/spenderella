import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base layout
        "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base md:text-sm shadow-xs outline-none transition-[color,box-shadow,border] duration-200",
        "bg-transparent dark:bg-input/30 border-input file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        
        // Spenderella polish
        "backdrop-blur-sm", // subtle blur for depth
        "hover:border-accent focus-visible:border-accent focus-visible:ring-accent/40",
        "focus-visible:ring-[3px] focus-visible:shadow-md",
        
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }
