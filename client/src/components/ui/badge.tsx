import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // base: soft rounded pill + subtle glow + shimmer overlay
  "relative inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden " +
    "[&>svg]:size-3 [&>svg]:pointer-events-none " +
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none " +
    "transition-[transform,box-shadow,background] duration-200 " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // pastel rose → lilac gradient
        default:
          "border-transparent text-primary-foreground " +
          "bg-[linear-gradient(135deg,oklch(0.86_0.08_350)_0%,oklch(0.84_0.09_300)_100%)] " +
          "shadow-[0_2px_10px_rgba(186,104,200,0.18)] hover:brightness-[1.03]",
        // lavender glass
        secondary:
          "border border-border/40 text-secondary-foreground " +
          "bg-[linear-gradient(135deg,oklch(0.95_0.02_300)_0%,oklch(0.92_0.03_320)_100%)] " +
          "backdrop-blur-[2px] shadow-[0_2px_8px_rgba(140,120,200,0.12)] hover:brightness-[1.03]",
        // ruby glass
        destructive:
          "border-transparent text-white " +
          "bg-[linear-gradient(135deg,oklch(0.62_0.21_25)_0%,oklch(0.58_0.23_20)_100%)] " +
          "shadow-[0_2px_10px_rgba(230,60,80,0.22)] hover:brightness-[1.03] " +
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        // princess outline
        outline:
          "border border-pink-300/60 text-foreground " +
          "bg-[linear-gradient(135deg,transparent,oklch(0.97_0.02_320)/55%)] " +
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] hover:bg-[oklch(0.97_0.02_320)/70%]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
