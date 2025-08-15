import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // soft glassy pill container
        "inline-flex w-fit items-center justify-center gap-1.5",
        "rounded-full p-1",
        "bg-card/70 backdrop-blur-md ring-1 ring-border/60 shadow-sm",
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // base
        "relative inline-flex select-none items-center justify-center gap-1.5",
        "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
        "transition-[color,background,box-shadow,transform]",
        "text-foreground/80 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        // icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // inactive look
        "bg-transparent",
        // active: dreamy gradient + soft glow
        "data-[state=active]:text-foreground",
        "data-[state=active]:shadow-sm data-[state=active]:shadow-primary/20",
        "data-[state=active]:ring-1 data-[state=active]:ring-ring/50",
        "data-[state=active]:bg-[radial-gradient(120px_80px_at_30%_-10%,oklch(0.98_0.03_300)/.9,transparent_60%),linear-gradient(135deg,oklch(0.98_0.02_300)/.8,oklch(0.98_0.03_210)/.8)]",
        // dark tweak so it’s not too bright
        "dark:data-[state=active]:bg-[radial-gradient(120px_80px_at_30%_-10%,oklch(0.25_0.05_300)/.5,transparent_60%),linear-gradient(135deg,oklch(0.22_0.05_300)/.6,oklch(0.22_0.06_210)/.6)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        // calm content surface if you want a panel feel under the tabs
        // remove this if your contents already render in cards
        // "mt-2 rounded-2xl bg-card/60 backdrop-blur-md ring-1 ring-border/60 p-4",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
