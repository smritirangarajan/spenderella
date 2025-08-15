import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "princess", // default to spenderella sparkle
  shape: "rounded",
})

function ToggleGroup({
  className,
  variant,
  size,
  shape,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(
        "group/toggle-group inline-flex w-fit items-center overflow-hidden",
        // outline variant gets a subtle shadow
        "data-[variant=outline]:shadow-xs",
        // princess variant gets a dreamy glow
        "data-[variant=princess]:shadow-sm data-[variant=princess]:shadow-primary/10",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, shape }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  shape,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const finalVariant = context.variant || variant
  const finalSize = context.size || size
  const finalShape = context.shape || shape

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={finalVariant}
      data-size={finalSize}
      data-shape={finalShape}
      className={cn(
        toggleVariants({
          variant: finalVariant,
          size: finalSize,
          shape: finalShape,
        }),
        "min-w-0 flex-1 shrink-0 shadow-none focus:z-10 focus-visible:z-10",
        // connected look
        "rounded-none first:rounded-l-[inherit] last:rounded-r-[inherit]",
        // no double borders in outline mode
        "data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        // princess mode gets gradient bleed between items
        finalVariant === "princess" &&
          "data-[state=on]:[&:not(:first-child)]:before:absolute data-[state=on]:[&:not(:first-child)]:before:left-0 data-[state=on]:[&:not(:first-child)]:before:top-0 data-[state=on]:[&:not(:first-child)]:before:bottom-0 data-[state=on]:[&:not(:first-child)]:before:w-px data-[state=on]:[&:not(:first-child)]:before:bg-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
