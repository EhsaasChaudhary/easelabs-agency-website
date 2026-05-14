"use client"

import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"

const relationships = [
  "Former client",
  "Industry peer",
  "Designer / Engineer",
  "Investor",
  "Friend",
  "Other",
]

const payouts = ["Cash fee", "Studio credit", "Decide later"]

export function ReferralForm() {
  const [submitted, setSubmitted] = useState(false)
  const [relationship, setRelationship] = useState<string | null>(null)
  const [payout, setPayout] = useState<string | null>(null)
  const [hasLead, setHasLead] = useState<boolean>(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("[v0] Referral form submitted", {
      relationship,
      payout,
      hasLead,
      form: new FormData(e.currentTarget),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-6 py-8" id="join">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-coral text-background">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="font-serif text-4xl leading-tight tracking-tight">
          You&apos;re in. <span className="italic text-brand-coral">Welcome</span>.
        </h3>
        <p className="max-w-md text-muted-foreground">
          We&apos;ll send you a welcome note within one working day with everything
          you need — a short brief on how we work and a referrals inbox to use
          any time.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setRelationship(null)
            setPayout(null)
            setHasLead(false)
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit} id="join">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" placeholder="Ada Lovelace" required />
        <Field id="email" label="Email" type="email" placeholder="ada@example.com" required />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="company" label="Company / Role" placeholder="Founder at Mossy" />
        <Field id="link" label="Website or LinkedIn" placeholder="https://..." />
      </div>

      {/* Relationship */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          How do you know us?
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {relationships.map((r) => {
            const active = relationship === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRelationship(r)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {r}
              </button>
            )
          })}
        </div>
      </div>

      {/* Payout preference */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Preferred reward
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {payouts.map((p) => {
            const active = payout === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPayout(p)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-brand-coral bg-brand-coral text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>

      {/* Has a lead now */}
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Have someone in mind already?
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { value: true, label: "Yes — share details below" },
            { value: false, label: "Not yet" },
          ].map((opt) => {
            const active = hasLead === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setHasLead(opt.value)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Conditional lead block */}
      {hasLead && (
        <div className="grid gap-6 rounded-2xl border border-dashed border-border bg-background/60 p-6 sm:grid-cols-2">
          <Field id="leadName" label="Their name / company" placeholder="Mossy Inc." />
          <Field id="leadContact" label="Their contact (optional)" placeholder="hello@mossy.io" />
        </div>
      )}

      {/* Note */}
      <div className="space-y-2">
        <label
          htmlFor="note"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          Anything else?
        </label>
        <textarea
          id="note"
          name="note"
          rows={5}
          placeholder="Context, the kind of teams you can introduce, questions..."
          className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="max-w-xs text-xs text-muted-foreground">
          By joining, you agree we may contact you about referrals. We won&apos;t
          share your details with anyone.
        </p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-brand-coral"
        >
          Join referral program
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
