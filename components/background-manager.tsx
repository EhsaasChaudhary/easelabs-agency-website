"use client"

import { InteractiveBackground } from "@/components/interactive-background"

// One unified background across every page: drifting terracotta particles with
// constellation links and a small circular cursor glow that gently repels them.
export function BackgroundManager() {
  return <InteractiveBackground />
}
