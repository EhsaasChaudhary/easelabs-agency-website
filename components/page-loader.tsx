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
 *     terracotta particle in-place which drifts outward in a random direction
 *     and fades, while the overlay background simultaneously fades out —
 *     creating the illusion that the wordmark scatters into the live
 *     interactive particle field running under the main page.
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

    // Phase 1: wipe reveal (1100ms) + hold (500ms)
    const WORDMARK_DURATION = reducedMotion ? 500 : 1700
    // Phase 2: disperse + overlay fade (1200ms)
    const DISPERSE_DURATION = reducedMotion ? 0 : 1200

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

      type P = {
        x: number
        y: number
        vx: number
        vy: number
        size: number
        delay: number
      }
      const particles: P[] = pts.map((p) => {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.6 + Math.random() * 1.6
        return {
          x: offX + (p.x / sampleW) * targetW,
          y: offY + (p.y / sampleH) * targetH,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.1 + Math.random() * 1.3,
          delay: Math.random() * 160,
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
      const DURATION = 1100

      const frame = (now: number) => {
        if (cancelled) return
        const elapsed = now - startTime
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = fillColor

        for (const p of particles) {
          const local = Math.max(0, elapsed - p.delay)
          const t = Math.min(local / DURATION, 1)
          // Drift outward, gently accelerating, then fade.
          p.x += p.vx
          p.y += p.vy
          p.vx *= 1.004
          p.vy *= 1.004
          const alpha = (1 - t) * 0.85
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (elapsed < DURATION + 200) raf = requestAnimationFrame(frame)
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
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor:
          phase === "disperse" ? "rgba(0,0,0,0)" : "var(--background)",
        transition:
          phase === "disperse"
            ? "background-color 1000ms ease-out"
            : undefined,
      }}
    >
      {reduced ? (
        <h1 className="font-serif text-6xl tracking-tight md:text-8xl">
          EaseLabs
        </h1>
      ) : phase === "wordmark" ? (
        <WordmarkContent />
      ) : (
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
