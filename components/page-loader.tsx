"use client"

import { useEffect, useRef, useState } from "react"

type LoaderVariant = "wordmark" | "particles"

const SEEN_KEY = "easelabs_loader_seen"
const LAST_KEY = "easelabs_loader_last"
const REPLAY_DISMISSED_KEY = "easelabs_replay_dismissed"

/* ----------------------------------------------------------------------------
 * PageLoader
 * --------------------------------------------------------------------------
 * Renders one of two pre-page-load screens on first session entry:
 *   - "wordmark":  serif EaseLabs reveals behind a terracotta wipe bar
 *   - "particles": coral particles ease in and form the EaseLabs wordmark
 *
 * Behavior:
 *   - Shows once per session by default (sessionStorage flag)
 *   - Override via URL: ?loader=wordmark or ?loader=particles (won't set flag)
 *   - Respects prefers-reduced-motion: shows a brief static wordmark instead
 *   - Locks body scroll while visible, restores on unmount
 *   - After exit, mounts a small floating button to replay the OTHER variant
 *     for easy A/B comparison (dismissible)
 * -------------------------------------------------------------------------- */
export function PageLoader() {
  const [variant, setVariant] = useState<LoaderVariant | null>(null)
  const [lastVariant, setLastVariant] = useState<LoaderVariant | null>(null)
  const [exiting, setExiting] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const override = params.get("loader")
    const isValidOverride = override === "wordmark" || override === "particles"

    let chosen: LoaderVariant | null = null
    if (isValidOverride) {
      chosen = override as LoaderVariant
    } else {
      let seen: string | null = null
      try {
        seen = sessionStorage.getItem(SEEN_KEY)
      } catch {}
      if (!seen) chosen = "wordmark"
    }

    if (!chosen) {
      // No loader this load — but check if a prior loader ran this session so
      // we can offer the replay toggle to compare the other variant.
      try {
        const last = sessionStorage.getItem(LAST_KEY) as LoaderVariant | null
        if (last === "wordmark" || last === "particles") setLastVariant(last)
      } catch {}
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setReduced(prefersReducedMotion)
    setVariant(chosen)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const showDuration = prefersReducedMotion ? 500 : 2000
    const fadeDuration = prefersReducedMotion ? 250 : 700

    const exitTimer = window.setTimeout(() => setExiting(true), showDuration)
    const unmountTimer = window.setTimeout(() => {
      setVariant(null)
      setLastVariant(chosen)
      try {
        sessionStorage.setItem(SEEN_KEY, "1")
        sessionStorage.setItem(LAST_KEY, chosen!)
      } catch {}
      document.body.style.overflow = previousOverflow
    }, showDuration + fadeDuration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(unmountTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  if (variant) {
    return (
      <div
        role="presentation"
        aria-hidden="true"
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
          exiting ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {reduced ? (
          <h1 className="font-serif text-6xl tracking-tight md:text-8xl">
            EaseLabs
          </h1>
        ) : variant === "wordmark" ? (
          <WordmarkLoader />
        ) : (
          <ParticleLoader />
        )}
      </div>
    )
  }

  if (lastVariant) {
    return <LoaderReplayButton lastVariant={lastVariant} />
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* Variant 1 — Typographic wipe reveal                                         */
/* -------------------------------------------------------------------------- */
function WordmarkLoader() {
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

/* -------------------------------------------------------------------------- */
/* Variant 2 — Particle convergence                                            */
/* -------------------------------------------------------------------------- */
function ParticleLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let cancelled = false

    const setup = () => {
      if (cancelled) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let width = window.innerWidth
      let height = window.innerHeight

      const resize = () => {
        width = window.innerWidth
        height = window.innerHeight
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      resize()

      // Sample the wordmark into a grid of target points.
      const sampleW = 1400
      const sampleH = 350
      const sampleCanvas = document.createElement("canvas")
      sampleCanvas.width = sampleW
      sampleCanvas.height = sampleH
      const sctx = sampleCanvas.getContext("2d")
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

      // Map sample coords to screen-centered coords.
      const targetW = Math.min(width * 0.78, 1100)
      const targetH = targetW * (sampleH / sampleW)
      const offX = (width - targetW) / 2
      const offY = (height - targetH) / 2

      type P = {
        tx: number
        ty: number
        sx: number
        sy: number
        size: number
        delay: number
      }
      const particles: P[] = pts.map((p) => {
        // Start positions: launched from outside the viewport edge in a random
        // direction so they appear to "rush in" toward their target.
        const angle = Math.random() * Math.PI * 2
        const r = Math.max(width, height) * (0.6 + Math.random() * 0.6)
        return {
          tx: offX + (p.x / sampleW) * targetW,
          ty: offY + (p.y / sampleH) * targetH,
          sx: width / 2 + Math.cos(angle) * r,
          sy: height / 2 + Math.sin(angle) * r,
          size: 1.1 + Math.random() * 1.3,
          delay: Math.random() * 220,
        }
      })

      // Resolve brand-coral from CSS vars. Modern canvases accept oklch().
      let fillColor = "#c2643c"
      try {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--brand-coral")
          .trim()
        if (raw) fillColor = raw
      } catch {}

      const startTime = performance.now()
      const FORM = 1200

      const frame = (now: number) => {
        if (cancelled) return
        const elapsed = now - startTime
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = fillColor

        for (const p of particles) {
          const local = Math.max(0, elapsed - p.delay)
          const t = Math.min(local / FORM, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          const x = p.sx + (p.tx - p.sx) * eased
          const y = p.sy + (p.ty - p.sy) * eased
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)

      const onResize = () => resize()
      window.addEventListener("resize", onResize)

      return () => {
        window.removeEventListener("resize", onResize)
      }
    }

    let cleanupResize: (() => void) | undefined

    // Wait briefly for Instrument Serif so sampled letterforms match the
    // wordmark variant — but never block longer than 400ms.
    const start = async () => {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 400)),
        ])
      } catch {}
      if (cancelled) return
      cleanupResize = setup() as (() => void) | undefined
    }
    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cleanupResize?.()
    }
  }, [])

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <p
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground"
        style={{
          opacity: 0,
          animation: "easelabs-particle-caption 700ms 1400ms ease-out forwards",
        }}
      >
        [ Studio · Est. 2023 ]
      </p>
      <style>{`
        @keyframes easelabs-particle-caption {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Replay toggle — for A/B comparison while choosing between the two           */
/* -------------------------------------------------------------------------- */
function LoaderReplayButton({ lastVariant }: { lastVariant: LoaderVariant }) {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(REPLAY_DISMISSED_KEY) === "1") {
        setDismissed(true)
      }
    } catch {}
  }, [])

  if (!mounted || dismissed) return null

  const other: LoaderVariant =
    lastVariant === "wordmark" ? "particles" : "wordmark"

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur-md">
      <a
        href={`?loader=${other}`}
        className="rounded-full bg-brand-coral px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:opacity-90"
      >
        Try {other} version →
      </a>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(REPLAY_DISMISSED_KEY, "1")
          } catch {}
          setDismissed(true)
        }}
        aria-label="Dismiss replay toggle"
        className="flex h-7 w-7 items-center justify-center rounded-full text-base text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        ×
      </button>
    </div>
  )
}
