import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // shape & layout
        "relative aspect-square size-4 shrink-0 rounded-full outline-none",
        // glassy surface
        "bg-background/80 dark:bg-input/30 backdrop-blur-[2px]",
        // border & ring
        "border border-input shadow-xs transition-all",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // states
        "data-[state=checked]:border-primary data-[state=checked]:shadow-primary/20",
        // subtle hover lift
        "hover:shadow-sm",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* soft glow when checked */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full",
          "opacity-0 transition-opacity",
          "data-[state=checked]:opacity-100",
          "data-[state=checked]:ring-2 data-[state=checked]:ring-primary/30"
        )}
      />
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "relative flex size-full items-center justify-center",
          // tiny pulse/pop on check
          "data-[state=checked]:animate-[spenderella-pop_160ms_ease-out]"
        )}
      >
        <CircleIcon className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 text-primary fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
