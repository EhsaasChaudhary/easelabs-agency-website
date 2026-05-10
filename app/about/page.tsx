import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Marquee } from "@/components/marquee"

export const metadata = {
  title: "About — Looplab",
  description:
    "We are a small, opinionated studio building thoughtful software for teams that care about craft.",
}

const principles = [
  {
    n: "01",
    title: "Small loops, real progress.",
    body: "We work in tight, weekly cycles. Every loop ends with something real you can click, ship, or share — never a pile of slides.",
  },
  {
    n: "02",
    title: "Craft as a default.",
    body: "Pixel-pushing isn't a luxury. The micro-interactions, the empty states, the typography — that's where products become memorable.",
  },
  {
    n: "03",
    title: "Strong opinions, lightly held.",
    body: "We bring a point of view to every project. Then we listen, prototype, and let the work argue for itself.",
  },
  {
    n: "04",
    title: "Built to last, not to ship.",
    body: "We write software the way we'd want it written if we had to maintain it for a decade. Because someone will.",
  },
]

const team = [
  { name: "Maya Okonkwo", role: "Studio Director · Strategy", color: "bg-brand-coral/30" },
  { name: "Ren Takahashi", role: "Principal Engineer", color: "bg-brand-cyan/30" },
  { name: "Sofia Marques", role: "Design Lead", color: "bg-brand-yellow/40" },
  { name: "Eli Rosenfeld", role: "Brand & Motion", color: "bg-brand-coral/30" },
  { name: "Priya Anand", role: "Product Engineer", color: "bg-brand-cyan/30" },
  { name: "Jonas Weber", role: "Operations", color: "bg-brand-yellow/40" },
]

const timeline = [
  { year: "2018", event: "Looplab founded above a bakery in Lisbon." },
  { year: "2020", event: "First product launch reaches 1M users." },
  { year: "2022", event: "Team grows to nine. We say no to becoming an agency." },
  { year: "2024", event: "Open-sourced our internal design system." },
  { year: "2026", event: "Now: building tools for the next decade of software." },
]

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-10 lg:pt-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ About the studio ]
        </p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
          A small studio with <span className="italic text-brand-coral">big</span> opinions
          about software.
        </h1>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground lg:col-span-7">
            We&apos;re Looplab — nine designers, engineers, and writers who left bigger
            places to build smaller, sharper things. We partner with founders and
            in-house teams who treat their product as a craft, not a checklist.
          </p>
          <div className="lg:col-span-5">
            <dl className="grid grid-cols-2 gap-6 border-l border-border pl-6">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Founded</dt>
                <dd className="mt-2 font-serif text-3xl">2018</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">People</dt>
                <dd className="mt-2 font-serif text-3xl">9</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Based in</dt>
                <dd className="mt-2 font-serif text-3xl">Lisbon</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Time zones</dt>
                <dd className="mt-2 font-serif text-3xl">All</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* STUDIO IMAGE */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-secondary">
          <Image
            src="/about/studio.jpg"
            alt="The Looplab studio — a bright workspace with cream walls, a wooden desk, and colorful accents."
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <Marquee
        items={[
          "Curious",
          "Considered",
          "Independent",
          "Opinionated",
          "Patient",
          "Collaborative",
        ]}
      />

      {/* PRINCIPLES */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ How we work ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Four <span className="italic text-brand-coral">principles</span> we keep
              coming back to.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl bg-border lg:col-span-8 lg:grid-cols-2">
            {principles.map((p) => (
              <div key={p.n} className="flex flex-col gap-4 bg-background p-8">
                <span className="font-mono text-xs uppercase tracking-widest text-brand-coral">
                  {p.n}
                </span>
                <h3 className="font-serif text-2xl leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ The team ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Humans, in the <span className="italic">loop</span>.
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="group">
              <div className={`relative flex aspect-[4/5] items-end overflow-hidden rounded-3xl ${m.color} p-6`}>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(255,255,255,0.5),transparent)]"
                />
                <div className="relative">
                  <p className="font-serif text-3xl leading-tight">{m.name.split(" ")[0]}</p>
                  <p className="font-serif text-3xl italic leading-tight">
                    {m.name.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ A short history ]
        </p>
        <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
          From a bakery loft <span className="italic text-brand-coral">to here</span>.
        </h2>

        <ol className="mt-12 divide-y divide-border border-y border-border">
          {timeline.map((t) => (
            <li
              key={t.year}
              className="grid grid-cols-12 items-baseline gap-4 py-6 transition-colors hover:bg-secondary/40"
            >
              <span className="col-span-3 font-mono text-sm tracking-widest text-brand-coral md:col-span-2">
                {t.year}
              </span>
              <span className="col-span-9 font-serif text-2xl leading-tight tracking-tight md:col-span-10 md:text-3xl">
                {t.event}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-brand-coral"
          >
            See our services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm transition-colors hover:bg-secondary"
          >
            Say hello
          </Link>
        </div>
      </section>
    </>
  )
}
