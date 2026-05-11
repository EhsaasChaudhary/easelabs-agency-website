"use client"

import { useEffect, useRef } from "react"

export type GlowShape = "circle" | "square" | "diamond" | "hexagon" | "ring"

interface InteractiveBackgroundProps {
  glowShape: GlowShape
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

// Terracotta brand color, light + dark variants (mirrors --brand-coral tokens).
const COLOR_LIGHT = "#b3623f"
const COLOR_DARK = "#d18260"

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "")
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export function InteractiveBackground({ glowShape }: InteractiveBackgroundProps) {
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

    // Cursor glow stays small and soft — does not attract or erase, only repels.
    const CURSOR_RADIUS = 90
    // Constellation link distance — lines only appear between nearby particles.
    const LINK_DISTANCE = 130

    const initParticles = () => {
      const count = Math.min(80, Math.floor((width * height) / 22000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.3 + Math.random() * 2.2,
      }))
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

    // ---- Cursor glow shape painters
    const drawGlow = (px: number, py: number, accentRgb: string) => {
      const r = CURSOR_RADIUS
      // Light, soft glow — same color, just gentle bloom.
      ctx.save()

      switch (glowShape) {
        case "circle": {
          const g = ctx.createRadialGradient(px, py, 0, px, py, r)
          g.addColorStop(0, `rgba(${accentRgb}, 0.18)`)
          g.addColorStop(1, `rgba(${accentRgb}, 0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
          break
        }
        case "square": {
          // Rounded square clipped to the same radial falloff for a soft bloom.
          const size = r * 1.6
          ctx.translate(px, py)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
          grad.addColorStop(0, `rgba(${accentRgb}, 0.2)`)
          grad.addColorStop(1, `rgba(${accentRgb}, 0)`)
          ctx.fillStyle = grad
          const radius = 14
          ctx.beginPath()
          ctx.moveTo(-size / 2 + radius, -size / 2)
          ctx.arcTo(size / 2, -size / 2, size / 2, size / 2, radius)
          ctx.arcTo(size / 2, size / 2, -size / 2, size / 2, radius)
          ctx.arcTo(-size / 2, size / 2, -size / 2, -size / 2, radius)
          ctx.arcTo(-size / 2, -size / 2, size / 2, -size / 2, radius)
          ctx.closePath()
          ctx.fill()
          break
        }
        case "diamond": {
          const size = r * 1.4
          ctx.translate(px, py)
          ctx.rotate(Math.PI / 4)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
          grad.addColorStop(0, `rgba(${accentRgb}, 0.2)`)
          grad.addColorStop(1, `rgba(${accentRgb}, 0)`)
          ctx.fillStyle = grad
          ctx.fillRect(-size / 2, -size / 2, size, size)
          break
        }
        case "hexagon": {
          const size = r
          ctx.translate(px, py)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
          grad.addColorStop(0, `rgba(${accentRgb}, 0.2)`)
          grad.addColorStop(1, `rgba(${accentRgb}, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6
            const x = Math.cos(a) * size
            const y = Math.sin(a) * size
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          break
        }
        case "ring": {
          // Hollow ring — soft outline glow rather than filled bloom.
          const inner = r * 0.55
          const outer = r
          const grad = ctx.createRadialGradient(px, py, inner * 0.6, px, py, outer)
          grad.addColorStop(0, `rgba(${accentRgb}, 0)`)
          grad.addColorStop(0.55, `rgba(${accentRgb}, 0.28)`)
          grad.addColorStop(1, `rgba(${accentRgb}, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(px, py, outer, 0, Math.PI * 2)
          ctx.fill()
          break
        }
      }

      ctx.restore()
    }

    // ---- Renderer
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const colorRgb = hexToRgb(isDark ? COLOR_DARK : COLOR_LIGHT)

      // Update particles: gentle drift + cursor repulsion.
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 0.5) {
            const d = Math.sqrt(d2)
            // Falloff: strongest at center, fades to 0 at edge.
            const t = 1 - d / CURSOR_RADIUS
            const force = t * 0.9
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }

        p.x += p.vx
        p.y += p.vy

        // Mild friction + tiny random walk so motion stays alive.
        p.vx *= 0.96
        p.vy *= 0.96
        p.vx += (Math.random() - 0.5) * 0.008
        p.vy += (Math.random() - 0.5) * 0.008

        // Clamp max drift speed so repelled particles ease back down.
        const speed = Math.hypot(p.vx, p.vy)
        const maxSpeed = 1.6
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        // Wrap edges.
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
      }

      // Constellation links — only between particles within LINK_DISTANCE.
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK_DISTANCE * LINK_DISTANCE) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DISTANCE) * 0.2
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
  }, [glowShape])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  )
}
