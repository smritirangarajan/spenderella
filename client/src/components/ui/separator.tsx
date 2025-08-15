import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // base sizing
        "shrink-0",
        // rounded hairline + slight blur for a luxe feel
        "rounded-full backdrop-blur-[1px]",
        // gradient line that works in light/dark using tokens
        // horizontal: left→right; vertical: top→bottom
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:w-px data-[orientation=vertical]:h-full",
        // gradient uses border token in the middle, fades to transparent
        "data-[orientation=horizontal]:bg-gradient-to-r",
        "data-[orientation=vertical]:bg-gradient-to-b",
        "from-transparent via-border/80 to-transparent",
        "dark:via-border/60",
        // optional soft inner glow
        "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
