"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export function ThemeToggle({ className }: Props) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary",
        className,
      )}
    >
      {/* Render both icons; hide one via dark variant to avoid hydration mismatch */}
      <Sun className={cn("h-4 w-4 transition-opacity", mounted && isDark ? "opacity-0" : "opacity-100")} />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-opacity",
          mounted && isDark ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  )
}
