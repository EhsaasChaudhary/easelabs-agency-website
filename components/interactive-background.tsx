"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  // Current velocity (may be perturbed by the cursor).
  vx: number
  vy: number
  // Persistent slow drift — particles always float, even when idle.
  baseVx: number
  baseVy: number
  r: number
}

// Terracotta brand color, light + dark variants (mirrors --brand-coral tokens).
const COLOR_LIGHT = "#b3623f"
const COLOR_DARK = "#d18260"

// Constellation links — lines appear only between particles closer than this.
const LINK_DISTANCE = 100
// Upper bound on link opacity (10% more than the previous 0.2 default).
const MAX_LINK_ALPHA = 0.22
// Cursor glow stays small and soft — does not attract or erase, only repels.
const CURSOR_RADIUS = 90

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "")
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export function InteractiveBackground() {
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

    // ---- State
    const pointer = { x: -9999, y: -9999, active: false }
    let particles: Particle[] = []

    const initParticles = () => {
      const count = Math.min(80, Math.floor((width * height) / 22000))
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        // Slow, varied base speed so the field always feels alive.
        const speed = 0.12 + Math.random() * 0.18
        const baseVx = Math.cos(angle) * speed
        const baseVy = Math.sin(angle) * speed
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          r: 1.3 + Math.random() * 2.2,
        }
      })
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

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    window.addEventListener("resize", resize)
    resize()

    // ---- Cursor glow (always a circle, gentle radial bloom)
    const drawGlow = (px: number, py: number, accentRgb: string) => {
      const r = CURSOR_RADIUS
      const g = ctx.createRadialGradient(px, py, 0, px, py, r)
      g.addColorStop(0, `rgba(${accentRgb}, 0.18)`)
      g.addColorStop(1, `rgba(${accentRgb}, 0)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // ---- Renderer
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const colorRgb = hexToRgb(isDark ? COLOR_DARK : COLOR_LIGHT)

      // Update particles: gentle persistent drift + cursor repulsion.
      for (const p of particles) {
        // Cursor repulsion — does not attract or erase, only nudges outward.
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 0.5) {
            const d = Math.sqrt(d2)
            const t = 1 - d / CURSOR_RADIUS
            const force = t * 0.9
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }

        // Ease current velocity back toward the particle's base drift,
        // so it always floats slowly even with no cursor interaction.
        p.vx += (p.baseVx - p.vx) * 0.03
        p.vy += (p.baseVy - p.vy) * 0.03

        // Slowly rotate the base drift vector — organic wandering motion.
        const rot = (Math.random() - 0.5) * 0.04
        const cos = Math.cos(rot)
        const sin = Math.sin(rot)
        const nbx = p.baseVx * cos - p.baseVy * sin
        const nby = p.baseVx * sin + p.baseVy * cos
        p.baseVx = nbx
        p.baseVy = nby

        // Clamp peak speed so cursor impulses can't fling particles too far.
        const speed = Math.hypot(p.vx, p.vy)
        const maxSpeed = 1.6
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap edges so the field never empties.
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
      }

      // Constellation links — appear only between particles inside LINK_DISTANCE.
      // Closer pairs = more visible lines, capped at MAX_LINK_ALPHA.
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK_DISTANCE * LINK_DISTANCE) {
            const t = 1 - Math.sqrt(d2) / LINK_DISTANCE
            const alpha = t * MAX_LINK_ALPHA
            ctx.strokeStyle = `rgba(${colorRgb}, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Particle dots.
      for (const p of particles) {
        ctx.fillStyle = `rgba(${colorRgb}, 0.6)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Cursor glow last so it sits over the field.
      if (pointer.active) {
        drawGlow(pointer.x, pointer.y, colorRgb)
      }
    }

    // ---- Animation loop
    let rafId: number | null = null
    const tick = () => {
      render()
      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick)
      }
    }

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
      tick()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  )
}
