"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type RevealVariant = "up" | "in" | "left" | "right" | "scale"

type RevealProps = {
  as?: ElementType
  variant?: RevealVariant
  /** ms delay before this element starts animating after entering view */
  delay?: number
  /** If false, re-animates every time the element leaves and re-enters. */
  once?: boolean
  /** 0–1, how much of the element must be visible to trigger. */
  threshold?: number
  className?: string
  children: ReactNode
  style?: CSSProperties
  // Allow any extra HTML attributes to pass through.
  [key: string]: unknown
}

/**
 * Scroll-triggered reveal wrapper.
 *
 * - Renders any element type via `as` (default: <div>).
 * - Uses IntersectionObserver to animate in on first appearance.
 * - Respects prefers-reduced-motion (renders content immediately).
 * - Falls back to visible if IO is unsupported.
 * - For JS-disabled visitors, a CSS @media (scripting:none) fallback in
 *   globals.css ensures content is rendered at rest.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  once = true,
  threshold = 0,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Respect reduced-motion preference.
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mql.matches) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    // Graceful fallback when IO isn't available.
    if (!("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }

    // Trigger as soon as any pixel of the element enters the viewport — no
    // delay, no scroll-threshold. Elements already in view on initial mount
    // animate in immediately.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin: "0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const initial: Record<RevealVariant, string> = {
    up: "opacity-0 translate-y-6",
    in: "opacity-0",
    left: "opacity-0 -translate-x-6",
    right: "opacity-0 translate-x-6",
    scale: "opacity-0 scale-[0.96]",
  }

  const settled = "opacity-100 translate-x-0 translate-y-0 scale-100"

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal=""
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out will-change-transform",
        visible ? settled : initial[variant],
        className
      )}
      style={{
        ...(style || {}),
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
