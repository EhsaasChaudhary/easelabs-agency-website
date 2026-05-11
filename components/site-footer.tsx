import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      {/* Big wordmark */}
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ Let&apos;s build ]
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Have an idea worth <span className="italic text-brand-coral">easing</span> into reality?
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-brand-coral"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Studio
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-brand-coral">About</Link></li>
                <li><Link href="/services" className="hover:text-brand-coral">Services</Link></li>
                <li><Link href="/projects" className="hover:text-brand-coral">Projects</Link></li>
                <li><Link href="/contact" className="hover:text-brand-coral">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Social
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-coral">Twitter / X</a></li>
                <li><a href="#" className="hover:text-brand-coral">LinkedIn</a></li>
                <li><a href="#" className="hover:text-brand-coral">Dribbble</a></li>
                <li><a href="#" className="hover:text-brand-coral">GitHub</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Reach us
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="mailto:hello@easelabs.in" className="hover:text-brand-coral">hello@easelabs.in</a></li>
                <li className="text-muted-foreground">Bengaluru · Remote</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="mt-16 select-none overflow-hidden text-[18vw] leading-none font-serif tracking-tighter text-foreground/90"
        >
          easelabs<span className="italic text-brand-coral">.</span>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EaseLabs Studio. All rights reserved.</p>
          <p className="font-mono uppercase tracking-widest">
            easelabs.in · v1.0
          </p>
        </div>
      </div>
    </footer>
  )
}
