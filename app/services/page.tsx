import Link from "next/link"
import { ArrowUpRight, Compass, Code2, Palette, Bot, Boxes, Rocket } from "lucide-react"

export const metadata = {
  title: "Services — EaseLabs",
  description:
    "Strategy, design, engineering, and brand. The full creative-software loop, end to end.",
}

const services = [
  {
    n: "01",
    icon: Compass,
    title: "Product Strategy",
    color: "bg-brand-coral",
    fg: "text-background",
    summary:
      "Sharpen the idea. Audit the product. Decide what to build, ship, and skip — together.",
    deliverables: [
      "Discovery & user research",
      "Product roadmaps",
      "Information architecture",
      "Concept prototypes",
    ],
  },
  {
    n: "02",
    icon: Palette,
    title: "Product & UX Design",
    color: "bg-brand-cyan/30",
    fg: "text-foreground",
    summary:
      "Interfaces that feel inevitable. From sketch to spec, with motion and detail baked in.",
    deliverables: [
      "UI / UX systems",
      "Design systems & tokens",
      "Interaction & motion",
      "Accessibility reviews",
    ],
  },
  {
    n: "03",
    icon: Code2,
    title: "Web Engineering",
    color: "bg-brand-yellow/40",
    fg: "text-foreground",
    summary:
      "Fast, accessible, beautifully maintained sites and apps in Next.js, React, and TypeScript.",
    deliverables: [
      "Marketing & content sites",
      "Web apps & dashboards",
      "Headless CMS integration",
      "Performance audits",
    ],
  },
  {
    n: "04",
    icon: Boxes,
    title: "Mobile Apps",
    color: "bg-foreground",
    fg: "text-background",
    summary:
      "Native-feeling apps with a single codebase. Built for the long tail of polish.",
    deliverables: [
      "iOS & Android (React Native)",
      "Offline-first architecture",
      "App Store launch prep",
      "Analytics & telemetry",
    ],
  },
  {
    n: "05",
    icon: Bot,
    title: "AI Interfaces",
    color: "bg-brand-coral/30",
    fg: "text-foreground",
    summary:
      "Make AI feel useful. Chat surfaces, agents, copilots, and assistants worth using twice.",
    deliverables: [
      "AI chat & assistants",
      "Agentic workflows",
      "Prompt & eval pipelines",
      "RAG & knowledge bases",
    ],
  },
  {
    n: "06",
    icon: Rocket,
    title: "Brand & Identity",
    color: "bg-brand-cyan",
    fg: "text-background",
    summary:
      "A voice, a logo, a system. Identity that scales from a button to a billboard.",
    deliverables: [
      "Visual identity",
      "Brand voice & messaging",
      "Logo & wordmarks",
      "Launch campaigns",
    ],
  },
]

const process = [
  {
    n: "Week 1",
    title: "Discover",
    body: "Workshops, interviews, audits. We surface the real problem, not the brief.",
  },
  {
    n: "Week 2–3",
    title: "Define",
    body: "We pick a sharp angle, draft the architecture, and prototype the riskiest bit first.",
  },
  {
    n: "Week 4–8",
    title: "Build",
    body: "Tight weekly loops. Real software in your hands every Friday — no big reveals.",
  },
  {
    n: "Week 9+",
    title: "Launch & loop",
    body: "We ship, watch, and iterate. Then we hand over a product your team is proud to own.",
  },
]

const engagements = [
  {
    title: "Sprint",
    price: "From ₹15L",
    duration: "2 weeks",
    desc: "Concept, prototype, or audit. A focused dive on a single, gnarly question.",
    includes: ["Discovery workshop", "Clickable prototype", "Strategy doc"],
    color: "bg-secondary",
  },
  {
    title: "Studio",
    price: "From ₹50L",
    duration: "8–12 weeks",
    desc: "Our most popular engagement. End-to-end design and build of a real product.",
    includes: ["Strategy + design + build", "Weekly demos", "Production handover"],
    color: "bg-brand-coral",
    fg: "text-background",
    featured: true,
  },
  {
    title: "Embedded",
    price: "Monthly",
    duration: "3+ months",
    desc: "We become a part of your team — design, engineering, or both — for the long arc.",
    includes: ["Dedicated pod", "Quarterly reviews", "On-call craft"],
    color: "bg-secondary",
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-16 lg:px-10 lg:pt-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ Services ]
        </p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
          The full creative-software <span className="italic text-brand-coral">loop</span>.
        </h1>
        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          We&apos;re a one-stop studio: strategy, design, engineering, and brand,
          held together by a small team that&apos;s spent years working this way.
          Pick a slice — or hand us the whole loop.
        </p>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, ...s }) => (
            <article
              key={s.n}
              className={`group relative flex flex-col gap-6 overflow-hidden rounded-3xl ${s.color} ${s.fg} p-8 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                  {s.n}
                </span>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-3xl leading-tight tracking-tight">{s.title}</h2>
              <p className="text-sm leading-relaxed opacity-90">{s.summary}</p>
              <ul className="mt-auto space-y-2 border-t border-current/15 pt-4 text-sm">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center justify-between gap-3 opacity-90">
                    <span>{d}</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ How an engagement runs ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              A weekly <span className="italic text-brand-coral">rhythm</span>.
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Every Friday you see new work. Every Monday we plan the next loop.
              No surprises, no theatre, no big reveals at the end.
            </p>
          </div>
          <ol className="lg:col-span-8">
            {process.map((p, i) => (
              <li
                key={p.title}
                className="grid grid-cols-12 items-baseline gap-4 border-t border-border py-6 last:border-b"
              >
                <span className="col-span-3 font-mono text-xs uppercase tracking-widest text-brand-coral md:col-span-2">
                  {p.n}
                </span>
                <div className="col-span-9 md:col-span-10">
                  <h3 className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
                <span aria-hidden className="hidden font-mono text-xs text-muted-foreground md:col-span-1 md:inline">
                  0{i + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ Ways to work together ]
        </p>
        <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
          Pick the <span className="italic">shape</span> that fits.
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {engagements.map((e) => (
            <article
              key={e.title}
              className={`relative flex flex-col gap-6 overflow-hidden rounded-3xl ${e.color} ${e.fg ?? ""} p-8`}
            >
              {e.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground">
                  Most picked
                </span>
              )}
              <div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-70">
                  {e.duration}
                </p>
                <h3 className="mt-2 font-serif text-4xl leading-tight tracking-tight">
                  {e.title}
                </h3>
              </div>
              <p className="font-serif text-2xl">{e.price}</p>
              <p className="text-sm leading-relaxed opacity-90">{e.desc}</p>
              <ul className="mt-auto space-y-2 border-t border-current/15 pt-4 text-sm">
                {e.includes.map((i) => (
                  <li key={i} className="opacity-90">— {i}</li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors ${
                  e.featured
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:bg-brand-coral"
                }`}
              >
                Start a {e.title.toLowerCase()}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ FAQ ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Quick answers.
            </h2>
          </div>
          <dl className="divide-y divide-border border-y border-border lg:col-span-8">
            {[
              {
                q: "Do you work with early-stage startups?",
                a: "Yes — about half our work is with founders pre- or post-seed. We tailor scope to the stage.",
              },
              {
                q: "Can you join an existing team?",
                a: "Absolutely. We embed with in-house product, design, and engineering teams all the time.",
              },
              {
                q: "What stack do you use?",
                a: "Next.js, React, TypeScript, and Tailwind on the front. Postgres, Supabase, and Vercel for infra. We're stack-curious, not stack-loyal.",
              },
              {
                q: "How fast can we start?",
                a: "Usually within 2–3 weeks. For tighter timelines, drop us a line and we'll see what's possible.",
              },
            ].map((f) => (
              <div key={f.q} className="grid grid-cols-12 gap-4 py-6">
                <dt className="col-span-12 font-serif text-2xl leading-tight tracking-tight md:col-span-5">
                  {f.q}
                </dt>
                <dd className="col-span-12 text-muted-foreground md:col-span-7">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
