import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        // pastel gradient ring + soft shadow
        "ring-[2px] ring-transparent bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200 p-[2px] shadow-[0_2px_6px_rgba(180,120,200,0.15)]",
        "before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-tr before:from-pink-300/50 before:to-purple-200/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        "border border-white/40"
      , className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // pastel shimmer background
        "flex size-full items-center justify-center rounded-full text-xs font-medium text-white",
        "bg-[linear-gradient(135deg,oklch(0.82_0.08_330)_0%,oklch(0.78_0.09_290)_100%)]",
        "animate-pulse shadow-inner shadow-pink-200/30",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
