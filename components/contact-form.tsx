"use client"

import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"

const budgets = ["< €20k", "€20–60k", "€60–150k", "€150k+"]
const services = ["Strategy", "Design", "Engineering", "Brand", "AI", "Mobile"]
const timelines = ["ASAP", "1–3 months", "3–6 months", "Just exploring"]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [budget, setBudget] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<string | null>(null)

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("[v0] Contact form submitted", {
      selectedServices,
      budget,
      timeline,
      form: new FormData(e.currentTarget),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-6 py-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-coral text-background">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="font-serif text-4xl leading-tight tracking-tight">
          Message sent. <span className="italic text-brand-coral">Thank you</span>.
        </h2>
        <p className="max-w-md text-muted-foreground">
          We&apos;ll get back to you within one working day — usually faster.
          In the meantime, take a look at our recent work.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setSelectedServices([])
            setBudget(null)
            setTimeline(null)
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" placeholder="Ada Lovelace" required />
        <Field id="email" label="Email" type="email" placeholder="ada@example.com" required />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="company" label="Company" placeholder="EaseLabs" />
        <Field id="role" label="Role" placeholder="Founder, PM, Designer..." />
      </div>

      {/* Services */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          What do you need?
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => {
            const active = selectedServices.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleService(s)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Budget range
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {budgets.map((b) => {
            const active = budget === b
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-brand-coral bg-brand-coral text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {b}
              </button>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Timeline
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {timelines.map((t) => {
            const active = timeline === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTimeline(t)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What are you building, what's working, what's stuck?"
          className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="max-w-xs text-xs text-muted-foreground">
          By sending, you agree we may reply to you. We won&apos;t share your
          message with anyone.
        </p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-brand-coral"
        >
          Send message
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="text-brand-coral"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
      />
    </div>
  )
}
