"use client"

import { usePathname } from "next/navigation"
import { InteractiveBackground, type BackgroundVariant } from "@/components/interactive-background"

function variantFor(pathname: string): BackgroundVariant {
  if (pathname.startsWith("/about")) return "dotGrid"
  if (pathname.startsWith("/services")) return "hatching"
  if (pathname.startsWith("/projects")) return "flowField"
  if (pathname.startsWith("/contact")) return "ripples"
  return "particles" // home + fallback
}

export function BackgroundManager() {
  const pathname = usePathname() ?? "/"
  const variant = variantFor(pathname)
  // `key` forces a full remount when the variant changes so each effect
  // starts cleanly with its own state and event listeners.
  return <InteractiveBackground key={variant} variant={variant} />
}
