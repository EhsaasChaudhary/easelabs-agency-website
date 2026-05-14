import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Clock } from "lucide-react"
import { Reveal } from "@/components/reveal"

export const metadata = {
  title: "Contact — EaseLabs",
  description:
    "Tell us about your project, your team, or just say hi. We read every message.",
}

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@easelabs.in",
    href: "mailto:hello@easelabs.in",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Indiranagar, Bengaluru 560038",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri · 10:00–19:00 IST",
    href: "#",
  },
]

const faqs = [
  {
    q: "How quickly will I hear back?",
    a: "Within one working day. Usually faster.",
  },
  {
    q: "What size projects do you take?",
    a: "Engagements typically start at ₹15L for a sprint, ₹50L+ for full studio builds.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes — happily. We can send ours, or sign yours.",
  },
]

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-10 lg:pt-24">
        <Reveal as="p" variant="up" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ Contact ]
        </Reveal>
        <Reveal
          as="h1"
          variant="up"
          delay={120}
          className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-9xl"
        >
          Tell us what you&apos;re <span className="italic text-brand-coral">making</span>.
        </Reveal>
        <Reveal
          as="p"
          variant="up"
          delay={240}
          className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          A new product, a tired site, a brand that needs sharpening, or a
          half-baked idea — we&apos;d love to hear it. No long forms, no
          discovery call labyrinth. Just send us a note.
        </Reveal>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Form */}
          <Reveal variant="left" className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
              <ContactForm />
            </div>
          </Reveal>

          {/* Side info */}
          <Reveal as="aside" variant="right" delay={120} className="space-y-8 lg:col-span-5">
            <Reveal
              variant="up"
              delay={200}
              className="rounded-3xl bg-brand-coral p-8 text-background hover-lift"
            >
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">
                [ Prefer email? ]
              </p>
              <p className="mt-3 font-serif text-3xl leading-tight">
                Drop us a line at{" "}
                <a
                  href="mailto:hello@easelabs.in"
                  className="italic hover-underline"
                >
                  hello@easelabs.in
                </a>
              </p>
              <p className="mt-4 text-sm opacity-90">
                We read every message. New projects, press, partnerships,
                friendly hellos — all welcome.
              </p>
            </Reveal>

            <Reveal variant="up" delay={280}>
              <ul className="overflow-hidden rounded-3xl border border-border bg-background">
                {channels.map(({ icon: Icon, ...c }, i) => (
                  <Reveal
                    as="li"
                    key={c.label}
                    variant="up"
                    delay={320 + i * 80}
                    className="flex items-center gap-4 border-b border-border px-6 py-5 last:border-b-0 transition-colors hover:bg-secondary/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-brand-coral group-hover:text-background">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </p>
                      <a href={c.href} className="font-serif text-lg hover-coral">
                        {c.value}
                      </a>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Reveal>

            <Reveal
              variant="up"
              delay={400}
              className="rounded-3xl bg-brand-yellow/40 p-8 hover-lift"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                [ Response time ]
              </p>
              <p className="mt-3 font-serif text-3xl leading-tight">
                Usually under <span className="italic">24 hours</span>.
              </p>
              <p className="mt-3 text-sm text-foreground/70">
                We answer messages once a day, in batches, so we can give each
                one real attention.
              </p>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal variant="up">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            [ Before you write ]
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
            A few <span className="italic text-brand-coral">quick</span> answers.
          </h2>
        </Reveal>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <Reveal
              key={f.q}
              variant="up"
              delay={i * 100}
              className="grid grid-cols-12 items-baseline gap-4 py-6 transition-colors hover:bg-secondary/40"
            >
              <dt className="col-span-12 font-serif text-2xl leading-tight tracking-tight md:col-span-5">
                {f.q}
              </dt>
              <dd className="col-span-12 text-muted-foreground md:col-span-7">{f.a}</dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  )
}
