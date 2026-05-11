"use client"

import { usePathname } from "next/navigation"
import { InteractiveBackground, type GlowShape } from "@/components/interactive-background"

function glowShapeFor(pathname: string): GlowShape {
  if (pathname.startsWith("/about")) return "square"
  if (pathname.startsWith("/services")) return "diamond"
  if (pathname.startsWith("/projects")) return "hexagon"
  if (pathname.startsWith("/contact")) return "ring"
  return "circle" // home + fallback
}

export function BackgroundManager() {
  const pathname = usePathname() ?? "/"
  const glowShape = glowShapeFor(pathname)
  // `key` forces a fresh canvas mount per route so particle state resets cleanly.
  return <InteractiveBackground key={glowShape} glowShape={glowShape} />
}
