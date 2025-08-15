"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-2xl text-sm font-medium whitespace-nowrap",
    // base colors
    "bg-transparent text-foreground",
    // icons
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // transitions
    "transition-colors duration-150",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
    // invalid
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    // focus ring (spenderella)
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // pressed/on state (generic)
    "data-[state=on]:text-accent-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent",
        // ✨ Spenderella specials
        princess:
          [
            "border border-border/60",
            "bg-card/60 backdrop-blur-md shadow-sm",
            "hover:bg-card/80",
            // on = dreamy gradient + soft glow
            "data-[state=on]:bg-[radial-gradient(120px_80px_at_30%_-10%,oklch(0.98_0.03_300)/.9,transparent_60%),linear-gradient(135deg,oklch(0.96_0.04_300)/.7,oklch(0.96_0.06_200)/.7)]",
            "data-[state=on]:text-foreground",
            "data-[state=on]:shadow-lg data-[state=on]:shadow-primary/20",
            "data-[state=on]:ring-1 data-[state=on]:ring-ring/60",
          ].join(" "),
        tiara:
          [
            "border border-border",
            "bg-[oklch(1_0_0)/.8] dark:bg-[oklch(0.19_0.006_286)/.4] backdrop-blur",
            "hover:bg-muted",
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          ].join(" "),
        ghost:
          "hover:bg-transparent hover:text-primary data-[state=on]:bg-transparent data-[state=on]:text-primary",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8 text-[13px]",
        lg: "h-10 px-4 min-w-10 text-base",
      },
      // optional shape if you want pill buttons
      shape: {
        rounded: "rounded-2xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "princess",
      size: "default",
      shape: "rounded",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  shape,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
