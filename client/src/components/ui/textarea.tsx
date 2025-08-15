import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base md:text-sm shadow-xs outline-none transition-all",
        "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        
        // Background
        "bg-white/80 dark:bg-white/5 backdrop-blur-sm",
        
        // Borders
        "border-input focus-visible:border-transparent",
        
        // Focus glow for Spenderella
        "focus-visible:ring-[3px] focus-visible:ring-pink-300/70 focus-visible:ring-offset-1 focus-visible:ring-offset-pink-100 dark:focus-visible:ring-pink-500/50 dark:focus-visible:ring-offset-transparent",
        
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
