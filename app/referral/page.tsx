import { ReferralForm } from "@/components/referral-form"
import { ArrowUpRight, Share2, Handshake, Gift, Users, Sparkles, Wallet } from "lucide-react"
import { Reveal } from "@/components/reveal"

export const metadata = {
  title: "Referral Program — EaseLabs",
  description:
    "Introduce us to a team building something good. When they ship with us, we share the reward.",
}

const steps = [
  {
    n: "01",
    icon: Share2,
    title: "Introduce",
    body: "Send us a warm intro — a founder, a product team, a friend with an idea. One email is enough.",
  },
  {
    n: "02",
    icon: Handshake,
    title: "We take it from here",
    body: "We meet, scope, and decide together if there is a fit. No pressure on either side.",
  },
  {
    n: "03",
    icon: Gift,
    title: "Share the reward",
    body: "When the engagement signs, you get a cash referral fee or studio credit — your choice.",
  },
]

const rewards = [
  {
    icon: Wallet,
    title: "10% of the engagement",
    body: "Paid as cash once the project kicks off. No cap, no fine print.",
    color: "bg-brand-coral",
    fg: "text-background",
  },
  {
    icon: Sparkles,
    title: "Or studio credit",
    body: "Swap your fee for design and engineering hours on your own work.",
    color: "bg-brand-cyan/30",
    fg: "text-foreground",
  },
  {
    icon: Users,
    title: "Long-tail bonus",
    body: "Stays in the family — referrals that renew earn you a bonus, every time.",
    color: "bg-brand-yellow/40",
    fg: "text-foreground",
  },
]

const faqs = [
  {
    q: "Who can join the program?",
    a: "Anyone. Former clients, friends in product, agency partners, fellow founders. If you know good teams who need good software, we want to talk.",
  },
  {
    q: "Do I have to be a previous client?",
    a: "Not at all. Many of our best referrals come from designers, engineers, and operators we have never worked with directly.",
  },
  {
    q: "How much can I earn?",
    a: "Our standard fee is 10% of the first engagement — typically ₹1.5L–₹5L for a Studio build. There is no upper limit, and renewals earn additional bonuses.",
  },
  {
    q: "When do I get paid?",
    a: "Within 14 days of the engagement starting. Credit can be drawn down anytime within 24 months.",
  },
  {
    q: "What makes a good referral?",
    a: "A team that treats their product as a craft, has a real budget, and is open to a tight weekly working rhythm. We will tell you fast if a lead is not a fit.",
  },
  {
    q: "Can I refer myself or my own company?",
    a: "We love hearing from you directly — just use the contact page instead. The referral program is for introducing other teams.",
  },
]

export default function ReferralPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-16 lg:px-10 lg:pt-24">
        <Reveal as="p" variant="up" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [ Referral program ]
        </Reveal>
        <Reveal
          as="h1"
          variant="up"
          delay={120}
          className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-9xl"
        >
          Share the <span className="italic text-brand-coral">good</span> work.
        </Reveal>
        <Reveal
          as="p"
          variant="up"
          delay={240}
          className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Most of our best projects start with a warm intro. If you know a team
          building something thoughtful, send them our way — and we will share the
          reward when it turns into real work.
        </Reveal>
      </section>

      {/* WHAT IT IS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal variant="up" className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ What it is ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              A simple <span className="italic text-brand-coral">thank-you</span>.
            </h2>
          </Reveal>
          <Reveal
            as="p"
            variant="up"
            delay={140}
            className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:col-span-7"
          >
            Our referral program is the way we say thank you to the people who
            keep our studio busy with the right kind of work. There are no
            tiers, no portals, no chasing — just a clear introduction, a fair
            fee, and a long-term relationship.
          </Reveal>
        </div>

        {/* STEPS */}
        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, ...s }, i) => (
            <Reveal
              as="li"
              key={s.n}
              variant="up"
              delay={i * 120}
              className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-card p-8 hover-lift"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {s.n}
                </span>
                <Icon
                  className="h-6 w-6 text-brand-coral transition-transform duration-500 group-hover:rotate-12"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-serif text-3xl leading-tight tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* REWARDS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal variant="up">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            [ The reward ]
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
            Three ways to <span className="italic">say thanks</span>.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {rewards.map(({ icon: Icon, ...r }, i) => (
            <Reveal
              as="article"
              key={r.title}
              variant="up"
              delay={i * 120}
              className={`group relative flex flex-col gap-6 overflow-hidden rounded-3xl ${r.color} ${r.fg} p-8 hover-lift`}
            >
              <Icon
                className="h-6 w-6 transition-transform duration-500 group-hover:rotate-12"
                aria-hidden="true"
              />
              <h3 className="font-serif text-3xl leading-tight tracking-tight">
                {r.title}
              </h3>
              <p className="text-sm leading-relaxed opacity-90">{r.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10" id="join">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Form */}
          <Reveal variant="left" className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                [ Join the program ]
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Tell us about <span className="italic text-brand-coral">you</span>.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Drop your details once and we will keep you in the loop. You
                can introduce a team now or any time later — no quotas.
              </p>
              <div className="mt-8">
                <ReferralForm />
              </div>
            </div>
          </Reveal>

          {/* Side info */}
          <Reveal as="aside" variant="right" delay={120} className="space-y-6 lg:col-span-5">
            <Reveal
              variant="up"
              delay={200}
              className="rounded-3xl bg-brand-coral p-8 text-background hover-lift"
            >
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">
                [ Standard fee ]
              </p>
              <p className="mt-3 font-serif text-5xl leading-[1] tracking-tight">
                10<span className="italic">%</span>
              </p>
              <p className="mt-4 text-sm opacity-90">
                Of the first engagement, paid within 14 days of kickoff. Renewals
                earn additional bonus payouts.
              </p>
            </Reveal>

            <Reveal
              variant="up"
              delay={280}
              className="rounded-3xl border border-border bg-card p-8 hover-lift"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                [ Already have a lead? ]
              </p>
              <p className="mt-3 font-serif text-2xl leading-tight">
                Send the intro to{" "}
                <a
                  href="mailto:referrals@easelabs.in"
                  className="italic hover-underline hover-coral"
                >
                  referrals@easelabs.in
                </a>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Cc your contact. We will reply to both of you within one
                working day.
              </p>
            </Reveal>

            <Reveal
              variant="up"
              delay={360}
              className="rounded-3xl bg-brand-yellow/40 p-8 hover-lift"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                [ The fine print ]
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                <li className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                  No cap on referral count or earnings.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                  Fees apply to first engagement and renewals within 24 months.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                  We always disclose the relationship to the referred team.
                </li>
              </ul>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal variant="up" className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ Common questions ]
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Quick <span className="italic text-brand-coral">answers</span>.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Cannot find what you are after? Write to{" "}
              <a
                href="mailto:referrals@easelabs.in"
                className="underline underline-offset-4 hover-coral"
              >
                referrals@easelabs.in
              </a>{" "}
              and we will get back to you.
            </p>
          </Reveal>
          <dl className="divide-y divide-border border-y border-border lg:col-span-8">
            {faqs.map((f, i) => (
              <Reveal
                key={f.q}
                variant="up"
                delay={i * 80}
                className="grid grid-cols-12 gap-4 py-6 transition-colors hover:bg-secondary/40"
              >
                <dt className="col-span-12 font-serif text-2xl leading-tight tracking-tight md:col-span-5">
                  {f.q}
                </dt>
                <dd className="col-span-12 text-muted-foreground md:col-span-7">
                  {f.a}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal
          variant="scale"
          className="overflow-hidden rounded-3xl bg-foreground p-10 text-background sm:p-16"
        >
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">
            [ Ready to share ]
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Know a team worth introducing? Let us{" "}
            <span className="italic text-brand-coral">return the favor</span>.
          </h2>
          <a
            href="#join"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            Join the referral program
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </section>
    </>
  )
}
