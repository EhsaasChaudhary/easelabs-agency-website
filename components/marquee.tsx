import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: string[]
  className?: string
  separator?: string
}

export function Marquee({ items, className, separator = "✦" }: MarqueeProps) {
  // Duplicate items so the loop is seamless
  const doubled = [...items, ...items]

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden border-y border-border/60 bg-background",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex min-w-full shrink-0 animate-marquee items-center gap-8 py-4 pr-8">
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-8">
            <span className="font-serif text-2xl tracking-tight md:text-3xl">{item}</span>
            <span className="font-serif text-xl text-brand-coral">{separator}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
