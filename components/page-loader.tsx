"use client"

import { useEffect, useRef, useState } from "react"

const SEEN_KEY = "easelabs_loader_seen"

type Phase = "wordmark" | "disperse" | "done"

/* ----------------------------------------------------------------------------
 * PageLoader
 * --------------------------------------------------------------------------
 * Combined entry/exit loading screen:
 *
 *   PHASE 1 — wordmark:
 *     A terracotta bar sweeps top→bottom, revealing the EaseLabs serif
 *     wordmark behind it. A mono caption fades in below.
 *
 *   PHASE 2 — disperse:
 *     The wordmark is sampled into a grid of points. Each point spawns a
 *     terracotta particle in-place. Particles drift outward with strong
 *     acceleration so they spread across the FULL viewport, while a
 *     decoupled background layer fades its opacity from 1 → 0 over the
 *     full dispersal duration. The result: the wordmark visually shatters
 *     into a field of particles that scatter into every corner of the page,
 *     gracefully blending into the live interactive background underneath.
 *
 * Coordination:
 *   - Initial React state is "wordmark", so the loader is included in the
 *     server-rendered HTML and appears before the main page is visible.
 *   - A blocking inline script in <head> (see app/layout.tsx) adds the
 *     `loader-skip` class to <html> on already-seen sessions; CSS hides the
 *     loader instantly, so repeat visits don't flicker.
 *   - Force-show the loader at any time with ?loader=show.
 * -------------------------------------------------------------------------- */
export function PageLoader() {
  const [phase, setPhase] = useState<Phase>("wordmark")
  const [reduced, setReduced] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // -------------------------------------------------------- timing controller
  useEffect(() => {
    if (typeof window === "undefined") return

    // Already seen this session and no override → dismiss without animating.
    const params = new URLSearchParams(window.location.search)
    const forced = params.get("loader") === "show" || params.get("loader") === "1"
    let alreadySeen = false
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1"
    } catch {}

    if (alreadySeen && !forced) {
      setPhase("done")
      document.documentElement.classList.remove("loader-skip")
      return
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setReduced(reducedMotion)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Phase 1: wipe reveal (1100ms) + hold (600ms)
    const WORDMARK_DURATION = reducedMotion ? 500 : 1700
    // Phase 2: slow floating-leaves dispersal + overlay fade
    const DISPERSE_DURATION = reducedMotion ? 0 : 2800

    const enterDisperse = window.setTimeout(() => {
      if (reducedMotion) {
        finish()
      } else {
        setPhase("disperse")
      }
    }, WORDMARK_DURATION)

    const finishTimer = window.setTimeout(
      finish,
      WORDMARK_DURATION + DISPERSE_DURATION + 100,
    )

    function finish() {
      setPhase("done")
      try {
        sessionStorage.setItem(SEEN_KEY, "1")
      } catch {}
      document.body.style.overflow = previousOverflow
    }

    return () => {
      clearTimeout(enterDisperse)
      clearTimeout(finishTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // ----------------------------------------------------- disperse canvas FX
  useEffect(() => {
    if (phase !== "disperse") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let cancelled = false

    const run = async () => {
      // Wait briefly for the serif so sampled letterforms match the wordmark.
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 200)),
        ])
      } catch {}
      if (cancelled) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Sample the wordmark into target points.
      const sampleW = 1400
      const sampleH = 350
      const s = document.createElement("canvas")
      s.width = sampleW
      s.height = sampleH
      const sctx = s.getContext("2d")
      if (!sctx) return
      sctx.fillStyle = "#000"
      sctx.textAlign = "center"
      sctx.textBaseline = "middle"
      sctx.font = `400 250px 'Instrument Serif', 'Times New Roman', serif`
      sctx.fillText("EaseLabs", sampleW / 2, sampleH / 2)
      const img = sctx.getImageData(0, 0, sampleW, sampleH).data

      const pts: { x: number; y: number }[] = []
      const step = 5
      for (let y = 0; y < sampleH; y += step) {
        for (let x = 0; x < sampleW; x += step) {
          const i = (y * sampleW + x) * 4
          if (img[i + 3] > 128) pts.push({ x, y })
        }
      }

      // Match the wordmark's on-screen position so particles spawn exactly
      // where the letters just were.
      const targetW = Math.min(width * 0.78, 1100)
      const targetH = targetW * (sampleH / sampleW)
      const offX = (width - targetW) / 2
      const offY = (height - targetH) / 2

      // Bounded dispersal — particles spread within a soft radius around the
      // wordmark, not across the entire viewport. The radius is sized to the
      // wordmark itself so the effect feels anchored to the letters.
      const MAX_RADIUS = Math.max(targetW, targetH) * 0.28

      type P = {
        x: number
        y: number
        startX: number
        startY: number
        angle: number
        // Per-particle target distance from spawn. Distributed with sqrt for
        // uniform area density → fills the disk evenly instead of a ring.
        target: number
        size: number
        delay: number
        // Per-particle life multiplier. Values > 1 linger past the global
        // duration; values < 1 fade earlier. Creates an organic, layered
        // dissolve where some particles stay near the wordmark center.
        life: number
      }

      type Particle = P & {
        // Per-particle sway parameters — give each leaf a unique slow drift
        // so the field doesn't move in lockstep.
        swayAmp: number
        swayFreq: number
        swayPhase: number
      }
      const particles: Particle[] = pts.map((p) => {
        const x = offX + (p.x / sampleW) * targetW
        const y = offY + (p.y / sampleH) * targetH

        // Uniform-area distribution across a filled disk. sqrt(random()) gives
        // each radius band equal particle density, so the spread looks like a
        // filled expanding circle rather than a donut.
        const t = Math.sqrt(Math.random()) * MAX_RADIUS

        return {
          x,
          y,
          startX: x,
          startY: y,
          angle: Math.random() * Math.PI * 2,
          target: t,
          size: 1.1 + Math.random() * 1.3,
          delay: Math.random() * 400,
          // Most particles fade with the global timeline; some linger longer
          // and some fade slightly early, mixing the dissolve naturally.
          life: 0.7 + Math.random() * 0.7,
          swayAmp: 3 + Math.random() * 6,
          swayFreq: 0.6 + Math.random() * 0.8,
          swayPhase: Math.random() * Math.PI * 2,
        }
      })

      // Resolve the brand-coral CSS variable so disperse particles match the
      // live background field they're "merging into".
      let fillColor = "#b3623f"
      try {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--brand-coral")
          .trim()
        if (raw) fillColor = raw
      } catch {}

      const startTime = performance.now()
      // Long duration + sine drift below = floating-leaves motion. Particles
      // crawl outward slowly rather than firing off in a single pulse.
      const DURATION = 2600

      // easeOutQuint — pronounced early ease so particles start almost still,
      // then drift outward and settle softly toward their target distance.
      const easeOut = (k: number) => 1 - Math.pow(1 - k, 5)

      const frame = (now: number) => {
        if (cancelled) return
        const elapsed = now - startTime
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = fillColor

        for (const p of particles) {
          const local = Math.max(0, elapsed - p.delay)
          const k = Math.min(local / DURATION, 1)
          const eased = easeOut(k)

          // Position is interpolated from spawn outward to target distance.
          // Every particle has a different target → the field is a filled
          // disk that expands and softens with time. A small perpendicular
          // sine drift adds a leaf-like sway as the particle floats outward.
          const r = p.target * eased
          const tSec = local / 1000
          const sway = Math.sin(tSec * p.swayFreq + p.swayPhase) * p.swayAmp
          p.x =
            p.startX + Math.cos(p.angle) * r + Math.cos(p.angle + Math.PI / 2) * sway
          p.y =
            p.startY + Math.sin(p.angle) * r + Math.sin(p.angle + Math.PI / 2) * sway

          // Alpha: hold for the first ~45% of life, then taper to zero by
          // the end of the particle's life. The per-particle life multiplier
          // staggers the fade so some particles linger naturally.
          const lifeK = Math.min(local / (DURATION * p.life), 1)
          let alpha: number
          if (lifeK < 0.45) {
            alpha = 0.85
          } else {
            alpha = 0.85 * (1 - (lifeK - 0.45) / 0.55)
          }
          if (alpha <= 0) continue

          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (elapsed < DURATION + 800) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }
    run()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [phase])

  if (phase === "done") return null

  return (
    <div
      data-page-loader
      role="presentation"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Decoupled background layer — opacity fades smoothly from 1 → 0 as
          the particles disperse, so the cream surface dissolves in concert
          with the wordmark scattering rather than blinking off. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-background"
        style={{
          opacity: phase === "disperse" ? 0 : 1,
          transition: "opacity 2600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <div className="relative">
        {reduced ? (
          <h1 className="font-serif text-6xl tracking-tight md:text-8xl">
            EaseLabs
          </h1>
        ) : phase === "wordmark" ? (
          <WordmarkContent />
        ) : null}
      </div>

      {phase === "disperse" && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block"
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Phase 1 — Wordmark wipe reveal                                              */
/* -------------------------------------------------------------------------- */
function WordmarkContent() {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <h1
          className="whitespace-nowrap font-serif leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(3.25rem, 12vw, 11rem)",
            clipPath: "inset(0 0 100% 0)",
            animation:
              "easelabs-text-reveal 1100ms cubic-bezier(0.65,0,0.35,1) forwards",
          }}
        >
          EaseLabs
        </h1>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[-4%] right-[-4%] h-1.5 rounded-full bg-brand-coral"
          style={{
            top: "0%",
            animation:
              "easelabs-wipe-bar 1100ms cubic-bezier(0.65,0,0.35,1) forwards",
          }}
        />
      </div>

      <p
        className="mt-10 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground"
        style={{
          opacity: 0,
          animation: "easelabs-caption 700ms 800ms ease-out forwards",
        }}
      >
        [ Studio · Est. 2023 ]
      </p>

      <style>{`
        @keyframes easelabs-text-reveal {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes easelabs-wipe-bar {
          0%   { top: 0%;   opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes easelabs-caption {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
