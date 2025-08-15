import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // layout
        "relative overflow-hidden flex flex-col gap-6 rounded-2xl py-6",
        // frosted surface + soft shadow
        "bg-card/80 text-card-foreground backdrop-blur-md border border-border/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
        // delicate gradient frame (Spenderella ✨)
        "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:p-[1px]",
        "before:bg-gradient-to-br before:from-pink-200/60 before:via-fuchsia-200/40 before:to-indigo-200/40",
        "dark:before:from-pink-400/10 dark:before:via-fuchsia-400/10 dark:before:to-indigo-400/10",
        // hover glow
        "transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:border-primary/40",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold leading-none",
        // Spenderella gradient title
        "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500",
        "dark:from-pink-300 dark:via-fuchsia-300 dark:to-indigo-300",
        "text-lg sm:text-xl tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 [.border-t]:pt-6",
        // tiny top highlight for footer edge
        "relative before:absolute before:left-6 before:right-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
