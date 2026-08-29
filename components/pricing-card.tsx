'use client'

import { Check } from 'lucide-react'

const DISCORD_URL = 'https://discord.gg/ZCWxPCyc7B'

export interface PricingCardProps {
  name: string
  description?: string
  price: string
  pricePeriod?: string
  priceUsd?: string
  features: string[]
  highlight?: boolean
  badge?: string
  ctaLabel?: string
  delay?: number
}

export function PricingCard({
  name,
  description,
  price,
  pricePeriod,
  priceUsd,
  features,
  highlight,
  badge,
  ctaLabel = 'Comprar Agora',
  delay = 0,
}: PricingCardProps) {
  return (
    <div
      className={`reveal reveal-up hover-lift relative flex flex-col rounded-2xl border p-6 sm:p-7 transition-all ${
        highlight
          ? 'border-zinc-700 bg-[#141418] shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
          : 'border-zinc-800 bg-[#0e0e11] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-950 shadow-md">
          {badge}
        </span>
      )}

      <div className="mb-5">
        <h3 className="text-lg font-bold text-zinc-100">{name}</h3>
        {description && (
          <p className="mt-1 text-xs text-zinc-400">{description}</p>
        )}
      </div>

      <div className="mb-6 flex items-baseline gap-1.5">
        <span
          className="text-3xl sm:text-4xl font-black text-white tabular-nums"
          style={{ fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}
        >
          {price}
        </span>
        {pricePeriod && (
          <span className="text-sm text-zinc-400">{pricePeriod}</span>
        )}
      </div>

      {priceUsd && (
        <p className="-mt-4 mb-5 text-[11px] text-zinc-500">≈ {priceUsd}</p>
      )}

      <ul className="mb-7 flex flex-col gap-2.5 text-sm text-zinc-300">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Check className="h-2.5 w-2.5 text-white" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`button-shine group mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-[0.97] ${
          highlight
            ? 'bg-white text-zinc-950 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]'
            : 'border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:text-white hover:bg-zinc-700'
        }`}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
