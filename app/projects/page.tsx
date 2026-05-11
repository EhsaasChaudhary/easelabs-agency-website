import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata = {
  title: "Projects — EaseLabs",
  description:
    "A selection of recent work. Apps, sites, brands, and tools we've shipped with great teams.",
}

const projects = [
  {
    title: "Finch",
    client: "Finch · 2026",
    category: "Fintech / Mobile App",
    summary:
      "A consumer banking app rebuilt from the ground up. Sharper transactions, calmer charts, and a brand that finally feels like a bank you'd choose.",
    image: "/projects/finch-banking.jpg",
    color: "bg-brand-cyan/25",
    tags: ["Strategy", "iOS", "Android", "Brand"],
    span: "lg:col-span-7",
  },
  {
    title: "Orbit AI",
    client: "Orbit · 2026",
    category: "AI / SaaS",
    summary:
      "An AI workspace for research teams. We designed the chat surface, the agent runtime, and the sleepy-Sunday-morning empty states.",
    image: "/projects/orbit-ai.jpg",
    color: "bg-brand-coral/25",
    tags: ["AI", "Product Design", "Web App"],
    span: "lg:col-span-5",
  },
  {
    title: "Mossy",
    client: "Mossy · 2025",
    category: "CMS / Dashboard",
    summary:
      "A headless CMS for editorial teams. Less Notion, more newsroom. We rebuilt the dashboard, the editor, and the publishing pipeline.",
    image: "/projects/mossy-cms.jpg",
    color: "bg-brand-yellow/40",
    tags: ["Dashboard", "DX", "Brand"],
    span: "lg:col-span-5",
  },
  {
    title: "Atlas Commerce",
    client: "Atlas · 2025",
    category: "Commerce / Web",
    summary:
      "A storefront that feels like a magazine. Editorial layouts, fast checkout, custom CMS — built to scale across 14 markets.",
    image: "/projects/atlas-commerce.jpg",
    color: "bg-brand-cyan/25",
    tags: ["Commerce", "Engineering", "i18n"],
    span: "lg:col-span-7",
  },
  {
    title: "Nimbus",
    client: "Nimbus · 2025",
    category: "B2B SaaS",
    summary:
      "An analytics platform for product teams. We replaced the dashboard, simplified the data model, and made the empty state actually delightful.",
    image: "/projects/nimbus-saas.jpg",
    color: "bg-brand-yellow/40",
    tags: ["Dashboard", "Charts", "Engineering"],
    span: "lg:col-span-7",
  },
  {
    title: "Halo",
    client: "Halo · 2024",
    category: "Health / Mobile",
    summary:
      "A fitness app that doesn't shame you into using it. Quiet UI, soft motion, and a brand that finally treats rest as a feature.",
    image: "/projects/halo-fitness.jpg",
    color: "bg-brand-coral/25",
    tags: ["Mobile", "Brand", "Motion"],
    span: "lg:col-span-5",
  },
]

const filters = ["All", "Web", "Mobile", "AI", "Brand", "Dashboard"]

export default function ProjectsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-10 lg:pt-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ Selected work · 2024–2026 ]
        </p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
          Things we&apos;ve <span className="italic text-brand-coral">built</span>
          <br />
          for great teams.
        </h1>
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground lg:col-span-7">
            A small slice of recent projects. Each one started as a sharp question
            and ended as a real product in real hands. We&apos;re proud of the work,
            and prouder of the teams we made it with.
          </p>
          <div className="flex flex-wrap items-center gap-2 lg:col-span-5 lg:justify-end">
            {filters.map((f, i) => (
              <button
                key={f}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  i === 0
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`col-span-full ${p.span} group flex flex-col`}
            >
              <Link href="#" className="block">
                <div className={`relative aspect-[16/10] overflow-hidden rounded-3xl ${p.color}`}>
                  <Image
                    src={p.image}
                    alt={`${p.title} — ${p.category}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                    Case study
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                    {p.title}
                    <span className="text-brand-coral">.</span>
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {p.client}
                  </span>
                </div>
                <p className="max-w-2xl text-pretty text-muted-foreground">{p.summary}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <figure className="rounded-3xl bg-foreground p-10 text-background md:p-16">
          <p className="font-mono text-xs uppercase tracking-widest text-background/70">
            [ A kind word ]
          </p>
          <blockquote className="mt-6 font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
            <span className="italic text-brand-coral">&ldquo;</span>
            EaseLabs is the rare studio that ships software you actually want to
            keep. They left us with code our team is proud to maintain — and a
            product our users tell us they love.
            <span className="italic text-brand-coral">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-background/15 pt-6 text-sm">
            <div>
              <p>Lena Park</p>
              <p className="text-background/60">Co-founder &amp; CTO, Finch</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-brand-coral hover:text-background"
            >
              Work with us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </figcaption>
        </figure>
      </section>
    </>
  )
}
