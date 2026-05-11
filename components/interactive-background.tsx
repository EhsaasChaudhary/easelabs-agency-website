"use client"

import { useEffect, useRef } from "react"

export type BackgroundVariant =
  | "particles"
  | "dotGrid"
  | "hatching"
  | "flowField"
  | "ripples"

interface InteractiveBackgroundProps {
  variant: BackgroundVariant
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  maxLife: number
}

interface Ripple {
  x: number
  y: number
  r: number
  max: number
  alpha: number
}

// Brand colors per variant, light + dark.
// These mirror the brown brand tokens in globals.css (terracotta / caramel / sand).
const PALETTE: Record<
  BackgroundVariant,
  { primaryLight: string; primaryDark: string; accentLight: string; accentDark: string }
> = {
  particles: {
    primaryLight: "#b3623f", // terracotta
    primaryDark: "#d18260",
    accentLight: "#a17a55",
    accentDark: "#c9a888",
  },
  dotGrid: {
    primaryLight: "#a17a55", // caramel
    primaryDark: "#c9a888",
    accentLight: "#b3623f",
    accentDark: "#d18260",
  },
  hatching: {
    primaryLight: "#c9a878", // sand
    primaryDark: "#e6d2b0",
    accentLight: "#b3623f",
    accentDark: "#d18260",
  },
  flowField: {
    primaryLight: "#b3623f",
    primaryDark: "#d18260",
    accentLight: "#a17a55",
    accentDark: "#c9a888",
  },
  ripples: {
    primaryLight: "#a17a55",
    primaryDark: "#c9a888",
    accentLight: "#b3623f",
    accentDark: "#d18260",
  },
}

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "")
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export function InteractiveBackground({ variant }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // ---- Theme tracking
    let isDark = document.documentElement.classList.contains("dark")
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark")
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // ---- Sizing
    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // ---- Pointer state
    const pointer = { x: -9999, y: -9999, active: false }
    const ripples: Ripple[] = []
    let particles: Particle[] = []
    let hatchOffset = 0

    const initParticles = () => {
      if (variant === "particles") {
        const count = Math.min(70, Math.floor((width * height) / 26000))
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.4 + Math.random() * 2.4,
          life: 0,
          maxLife: 0,
        }))
      } else if (variant === "flowField") {
        const count = Math.min(110, Math.floor((width * height) / 18000))
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          r: 1.3,
          life: Math.random() * 240,
          maxLife: 220 + Math.random() * 240,
        }))
      } else {
        particles = []
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    // ---- Event handlers
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }
    const onDown = (e: PointerEvent) => {
      if (variant === "ripples") {
        ripples.push({ x: e.clientX, y: e.clientY, r: 0, max: 260, alpha: 0.55 })
      }
    }

    let lastRippleAt = 0
    const onMoveRipple = (e: PointerEvent) => {
      if (variant !== "ripples") return
      const now = performance.now()
      if (now - lastRippleAt < 220) return
      lastRippleAt = now
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, max: 140, alpha: 0.3 })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointermove", onMoveRipple, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("resize", resize)
    resize()

    // ---- Renderers
    const getColors = () => {
      const p = PALETTE[variant]
      return {
        primary: hexToRgb(isDark ? p.primaryDark : p.primaryLight),
        accent: hexToRgb(isDark ? p.accentDark : p.accentLight),
      }
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height)
      const { primary } = getColors()

      for (const p of particles) {
        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const d2 = dx * dx + dy * dy
          const radius = 200
          if (d2 < radius * radius && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (1 - d / radius) * 0.04
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy *= 0.985
        // gentle drift baseline
        p.vx += (Math.random() - 0.5) * 0.01
        p.vy += (Math.random() - 0.5) * 0.01
        // wrap
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
      }

      // constellation lines
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          const max = 130
          if (d2 < max * max) {
            const alpha = (1 - Math.sqrt(d2) / max) * 0.18
            ctx.strokeStyle = `rgba(${primary}, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // dots
      for (const p of particles) {
        ctx.fillStyle = `rgba(${primary}, 0.55)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const renderDotGrid = () => {
      ctx.clearRect(0, 0, width, height)
      const { primary, accent } = getColors()
      const spacing = 34
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      const radius = 150

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * spacing
          const baseY = j * spacing
          let r = 1.1
          let alpha = 0.16
          let ox = 0
          let oy = 0
          let color = primary

          if (pointer.active) {
            const dx = pointer.x - baseX
            const dy = pointer.y - baseY
            const d2 = dx * dx + dy * dy
            if (d2 < radius * radius) {
              const d = Math.sqrt(d2) || 1
              const t = 1 - d / radius
              r = 1.1 + t * 3.6
              alpha = 0.16 + t * 0.55
              ox = (dx / d) * t * 5
              oy = (dy / d) * t * 5
              if (t > 0.6) color = accent
            }
          }
          ctx.fillStyle = `rgba(${color}, ${alpha})`
          ctx.beginPath()
          ctx.arc(baseX + ox, baseY + oy, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const renderHatching = () => {
      ctx.clearRect(0, 0, width, height)
      const { primary, accent } = getColors()
      hatchOffset = (hatchOffset + 0.18) % 28
      const spacing = 28
      const diag = width + height

      // draw all diagonal lines
      ctx.lineWidth = 1
      ctx.strokeStyle = `rgba(${primary}, 0.2)`
      ctx.save()
      ctx.translate(0, hatchOffset)
      for (let b = -height; b < diag; b += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, b)
        ctx.lineTo(width, b + width)
        ctx.stroke()
      }
      ctx.restore()

      // cursor erases + adds warm glow
      if (pointer.active) {
        const px = pointer.x
        const py = pointer.y
        const radius = 170

        // erase
        const erase = ctx.createRadialGradient(px, py, 0, px, py, radius)
        erase.addColorStop(0, "rgba(0,0,0,1)")
        erase.addColorStop(0.65, "rgba(0,0,0,0.35)")
        erase.addColorStop(1, "rgba(0,0,0,0)")
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = erase
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"

        // warm glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, radius)
        glow.addColorStop(0, `rgba(${accent}, 0.22)`)
        glow.addColorStop(1, `rgba(${accent}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const renderFlowField = (t: number) => {
      // trail effect — translucent fill that matches theme bg
      ctx.fillStyle = isDark ? "rgba(20, 14, 10, 0.08)" : "rgba(246, 235, 220, 0.1)"
      ctx.fillRect(0, 0, width, height)
      const { primary, accent } = getColors()
      const time = t * 0.0002

      for (const p of particles) {
        // pseudo-noise angle
        const angle =
          Math.sin(p.x * 0.005 + time) + Math.cos(p.y * 0.005 - time * 1.2)
        p.vx = Math.cos(angle * Math.PI) * 0.7
        p.vy = Math.sin(angle * Math.PI) * 0.7

        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          const radius = 180
          if (d2 < radius * radius && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (1 - d / radius) * 1.4
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }
        p.x += p.vx
        p.y += p.vy
        p.life++
        if (
          p.x < 0 ||
          p.x > width ||
          p.y < 0 ||
          p.y > height ||
          p.life > p.maxLife
        ) {
          p.x = Math.random() * width
          p.y = Math.random() * height
          p.life = 0
        }
        const alpha = Math.min(0.45, (1 - p.life / p.maxLife) * 0.55)
        // alternate accent for a small portion
        const color = p.maxLife > 380 ? accent : primary
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const renderRipples = () => {
      ctx.clearRect(0, 0, width, height)
      const { primary, accent } = getColors()

      // soft ambient horizon
      const ambient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.85,
        40,
        width * 0.5,
        height * 0.85,
        Math.max(width, height) * 0.7
      )
      ambient.addColorStop(0, `rgba(${primary}, 0.1)`)
      ambient.addColorStop(1, `rgba(${primary}, 0)`)
      ctx.fillStyle = ambient
      ctx.fillRect(0, 0, width, height)

      // cursor halo
      if (pointer.active) {
        const halo = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          110
        )
        halo.addColorStop(0, `rgba(${accent}, 0.22)`)
        halo.addColorStop(1, `rgba(${accent}, 0)`)
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, 110, 0, Math.PI * 2)
        ctx.fill()
      }

      // expanding ripples
      ctx.lineWidth = 1
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.r += 1.6
        r.alpha *= 0.985
        if (r.r > r.max || r.alpha < 0.02) {
          ripples.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `rgba(${primary}, ${r.alpha})`
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // ---- Animation loop
    let rafId: number | null = null
    const tick = (t: number) => {
      switch (variant) {
        case "particles":
          renderParticles()
          break
        case "dotGrid":
          renderDotGrid()
          break
        case "hatching":
          renderHatching()
          break
        case "flowField":
          renderFlowField(t)
          break
        case "ripples":
          renderRipples()
          break
      }
      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick)
      }
    }

    // visibility pause
    const onVisibility = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      } else if (rafId === null && !reducedMotion) {
        rafId = requestAnimationFrame(tick)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    if (reducedMotion) {
      // render a single static frame
      tick(0)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointermove", onMoveRipple)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      themeObserver.disconnect()
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  )
}
