import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { Marquee } from "@/components/marquee"
import { Reveal } from "@/components/reveal"

const stats = [
  { value: "60+", label: "Products shipped" },
  { value: "12", label: "Industries served" },
  { value: "9.4", label: "Avg. client rating" },
  { value: "8 yrs", label: "Independent studio" },
]

const featured = [
  {
    title: "Finch",
    category: "Fintech · Mobile App",
    image: "/projects/finch-banking.jpg",
    color: "bg-brand-cyan/20",
  },
  {
    title: "Orbit AI",
    category: "AI · SaaS Platform",
    image: "/projects/orbit-ai.jpg",
    color: "bg-brand-coral/20",
  },
  {
    title: "Mossy",
    category: "CMS · Web Dashboard",
    image: "/projects/mossy-cms.jpg",
    color: "bg-brand-yellow/30",
  },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 lg:px-10 lg:pt-24">
          <Reveal variant="up" className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
              Available · Q3 2026
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:inline">
              Studio of 9 — Bengaluru &amp; Remote
            </span>
          </Reveal>

          <Reveal
            as="h1"
            variant="up"
            delay={120}
            className="mt-8 font-serif text-[14vw] leading-[0.9] tracking-tight md:text-[8.5rem] lg:text-[10rem]"
          >
            Software <span className="italic text-brand-coral">crafted</span>
            <br />
            with <span className="italic">curiosity</span>.
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal
              as="p"
              variant="up"
              delay={240}
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:col-span-6"
            >
              EaseLabs is an independent creative studio. We design and build digital
              products, websites, and tools for ambitious teams who want their
              software to feel as good as it works.
            </Reveal>

            <Reveal
              variant="up"
              delay={360}
              className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-brand-coral"
              >
                See our work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm transition-colors hover:bg-secondary"
              >
                Start a project
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee
        items={[
          "Product Design",
          "Web Engineering",
          "Brand Systems",
          "Mobile Apps",
          "AI Interfaces",
          "Design Sprints",
        ]}
      />

      {/* FEATURED HERO BLOCK */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal
            variant="up"
            className="relative col-span-full overflow-hidden rounded-3xl bg-brand-coral p-8 text-background sm:p-12 lg:col-span-7 lg:row-span-2 hover-lift"
          >
            <Sparkles className="h-6 w-6" />
            <p className="mt-8 font-mono text-xs uppercase tracking-widest opacity-80">
              [ Manifesto ]
            </p>
            <p className="mt-3 font-serif text-3xl leading-tight text-balance md:text-5xl">
              We believe great software is a creative act —
              <span className="italic"> built slowly, with taste, in tight loops.</span>
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm hover-underline"
            >
              Read our manifesto
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal
            variant="up"
            delay={120}
            className="col-span-full overflow-hidden rounded-3xl bg-brand-cyan/30 p-8 lg:col-span-5 hover-lift"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/70">
              [ What we do ]
            </p>
            <ul className="mt-6 space-y-4 font-serif text-2xl">
              <li className="flex items-baseline justify-between border-b border-foreground/15 pb-3 transition-colors hover:text-brand-coral">
                <span>Product Design</span>
                <span className="font-sans text-xs text-foreground/60">01</span>
              </li>
              <li className="flex items-baseline justify-between border-b border-foreground/15 pb-3 transition-colors hover:text-brand-coral">
                <span>Web Engineering</span>
                <span className="font-sans text-xs text-foreground/60">02</span>
              </li>
              <li className="flex items-baseline justify-between border-b border-foreground/15 pb-3 transition-colors hover:text-brand-coral">
                <span>Brand &amp; Identity</span>
                <span className="font-sans text-xs text-foreground/60">03</span>
              </li>
              <li className="flex items-baseline justify-between transition-colors hover:text-brand-coral">
                <span>AI &amp; Prototypes</span>
                <span className="font-sans text-xs text-foreground/60">04</span>
              </li>
            </ul>
          </Reveal>

          <Reveal
            variant="up"
            delay={240}
            className="col-span-full overflow-hidden rounded-3xl bg-brand-yellow/40 p-8 lg:col-span-5 hover-lift"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/70">
              [ By the numbers ]
            </p>
            <div className="mt-6 grid grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <Reveal key={s.label} variant="up" delay={300 + i * 80}>
                  <div className="font-serif text-4xl tracking-tight">{s.value}</div>
                  <div className="mt-1 text-xs text-foreground/60">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="flex items-end justify-between">
          <Reveal variant="up">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ Selected work ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Recently <span className="italic text-brand-coral">shipped</span>.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={120} className="hidden md:block">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
            >
              All projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal
              key={p.title}
              variant="up"
              delay={i * 120}
              className="group"
            >
              <Link href="/projects" className="block">
                <div
                  className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${p.color} hover-zoom`}
                >
                  <Image
                    src={p.image}
                    alt={`${p.title} — ${p.category}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-2xl tracking-tight transition-colors group-hover:text-brand-coral">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal variant="up">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            [ In good company ]
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 border-y border-border/60 py-10 sm:grid-cols-3 md:grid-cols-6">
          {["Finch", "Mossy", "Orbit", "Atlas", "Nimbus", "Halo"].map((name, i) => (
            <Reveal
              key={name}
              variant="up"
              delay={i * 60}
              className="font-serif text-2xl tracking-tight text-muted-foreground transition-colors hover:text-foreground"
            >
              {name}
              <span className="text-brand-coral">.</span>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
