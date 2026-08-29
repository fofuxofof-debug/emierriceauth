'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, X, Shield, Headset, Clock, RefreshCw,
  Crosshair, Eye, Layers, Settings, LogOut, ChevronRight, ZoomIn, ShieldCheck,
  Plus, Minus, MessageCircle, Menu, Terminal, Sparkles
} from 'lucide-react'

export default function HomePage() {
  const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL')
  const [selectedPlan, setSelectedPlan] = useState<string>('Bypass Remote')

  // Estado do menu interativo Showcase
  const [showcaseMainTab, setShowcaseMainTab] = useState<'Combat' | 'Visuals' | 'Miscellaneous' | 'Settings'>('Combat')
  const [showcaseSubTab, setShowcaseSubTab] = useState<'Rage' | 'Legit' | 'Silent' | 'Extras'>('Rage')
  const [toggles, setToggles] = useState({
    rage: true,
    aimbotHead: true,
    precision: false,
    hsNeck: true,
    ignoreKnocked: true,
    ignoreBots: false,
    drawFov: true,
    aimDelay: false,
    boxEsp: true,
    skeletonEsp: true,
    healthBar: true,
    distanceEsp: false,
    streamMode: true,
  })
  const [maxDistance, setMaxDistance] = useState(50)
  const [fov, setFov] = useState(65)
  const [smoothing, setSmoothing] = useState(15)

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Preços e Planos (100% nativo / sem IA)
  const plans = [
    {
      num: '01',
      name: 'Bypass Básico',
      tag: 'Disponível',
      highlight: false,
      priceBRL: '300',
      priceUSD: '60',
      period: '30 dias',
      diff: 'Desenvolvido para uma rotina de uso estável e acessível, com configuração assistida e suporte durante todo o ciclo.',
      features: [
        { label: 'Telagem Manual', included: true },
        { label: 'Todos Scanners', included: true },
        { label: 'Black Security', included: false },
        { label: 'KellerGuard', included: false },
        { label: 'Fileless', included: false },
        { label: 'Reiniciar em Web', included: false },
      ]
    },
    {
      num: '02',
      name: 'Bypass Private (Painel)',
      tag: 'Disponível',
      highlight: false,
      priceBRL: '1.000',
      priceUSD: '200',
      period: '30 dias',
      diff: 'Ambiente Ring 3 com configuração individual, operação local e licença vinculada ao cliente.',
      features: [
        { label: 'Telagem Manual', included: true },
        { label: 'Todos Scanners', included: true },
        { label: 'Black Security', included: true },
        { label: 'KellerGuard', included: true },
        { label: 'Fileless', included: true },
        { label: 'Reiniciar em Web', included: false },
      ]
    },
    {
      num: '03',
      name: 'Bypass Remote',
      tag: 'Disponível',
      highlight: true,
      popularTag: 'Recomendado',
      priceBRL: '1.300',
      priceUSD: '260',
      period: '30 dias',
      diff: 'Operação temporária em memória com boot inject e proteção de driver nível Kernel.',
      features: [
        { label: 'Telagem Manual', included: true },
        { label: 'Todos Scanners', included: true },
        { label: 'Black Security', included: true },
        { label: 'KellerGuard', included: true },
        { label: 'Driver Kernel', included: true },
        { label: 'Boot Inject (Ring 0)', included: true },
        { label: 'Reiniciar em Web', included: true },
      ]
    },
    {
      num: '04',
      name: 'Bypass Único',
      tag: 'Disponível',
      highlight: false,
      popularTag: 'Mais completo',
      priceBRL: '1.600',
      priceUSD: '320',
      period: '30 dias',
      diff: 'Hipervisor windows próprio preservando seu bypass, com suporte VIP e máxima discrição.',
      features: [
        { label: 'Telagem Manual', included: true },
        { label: 'Todos Scanners', included: true },
        { label: 'Black Security', included: true },
        { label: 'KellerGuard', included: true },
        { label: 'Hipervisor (Windows Próprio)', included: true },
        { label: 'Reiniciar em Web', included: true },
      ]
    }
  ]

  const faqs = [
    {
      q: 'Quanto tempo dura cada plano?',
      a: 'Todos os planos possuem ciclo de 30 dias contados a partir da ativação confirmada.'
    },
    {
      q: 'A renovação é automática?',
      a: 'Não. Não realizamos cobranças automáticas. O cliente escolhe renovar manualmente ao fim do ciclo de 30 dias.'
    },
    {
      q: 'O suporte está incluído?',
      a: 'Sim! Todos os planos contam com ativação assistida individual e suporte dedicado durante todo o período contratado.'
    },
    {
      q: 'Posso transferir minha assinatura?',
      a: 'A licença é vinculada ao hardware (HWID) do usuário registrado. Mudanças de hardware passam por análise rápida pelo suporte.'
    }
  ]

  const marqueeItems = [
    'BYPASS', 'FILELESS', 'RING 3', 'KELLERGUARD', 'BLACK SECURITY', 'INDETECTADO', 'TELAGEM PESADA', 'MRC BYPASS'
  ]

  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
      
      {/* Floating Pill Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="relative flex w-full max-w-5xl items-center justify-between rounded-full border border-zinc-800/80 bg-[#0c0c0e]/85 py-2.5 pl-4 pr-3 shadow-2xl backdrop-blur-xl transition-all">
          <a href="#top" className="flex items-center gap-2.5 select-none group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-white font-semibold text-xs shadow-inner group-hover:border-zinc-500 transition-colors">
              M
            </div>
            <span className="font-sans text-[17px] font-semibold tracking-tight text-white">
              MRC <span className="text-zinc-400 font-normal">Bypass</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <a href="#planos" className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Planos</a>
            <a href="#showcase" className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Showcases</a>
            <a href="#referencias" className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Referências</a>
            <a href="#faq" className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-800 bg-zinc-900/60 p-0.5">
              <button
                onClick={() => setCurrency('BRL')}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase transition-all ${
                  currency === 'BRL' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                BRL
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase transition-all ${
                  currency === 'USD' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                USD
              </button>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:bg-zinc-200 transition-all shadow-md"
            >
              <span>Painel</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Floating Discord CTA */}
      <a
        href="https://discord.gg"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat da comunidade"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-white shadow-2xl backdrop-blur transition-all hover:scale-105 hover:bg-zinc-800 hover:border-zinc-500"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      <main className="relative">
        {/* ===== HERO SECTION ===== */}
        <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-16 pt-32 sm:pt-36">
          {/* Ambient Glow */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-20%] -z-10 h-[650px] w-[1000px] max-w-[100vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.16),transparent_65%)] opacity-40 blur-[130px]" />
          <div className="bg-dots absolute inset-0 -z-20 opacity-[0.14]" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 -z-20 h-[50vh] bg-gradient-to-b from-red-600/[0.05] to-transparent" aria-hidden="true" />

          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center">
            
            {/* Status Pill Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-300 backdrop-blur shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Assinaturas disponíveis
            </div>

            {/* Brand Emblem */}
            <div className="relative mb-6">
              <div className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-[50px]" aria-hidden="true" />
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <span className="font-semibold text-4xl sm:text-5xl tracking-tighter">M</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mx-auto max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-8xl text-white">
              MRC Bypass
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base font-semibold leading-relaxed text-zinc-400 sm:text-lg">
              Planos mensais com ativação assistida, suporte direto e uma experiência feita para permanecer simples do início ao fim.
            </p>

            {/* CTA Button */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#planos"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-black shadow-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Escolher plano</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Feature Pills */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-zinc-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="font-mono text-xs font-semibold text-zinc-200">30 dias</span>
                <span className="text-xs text-zinc-400">por ciclo</span>
              </div>
              <span className="hidden h-4 w-px bg-zinc-800 sm:block" />
              <div className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-red-500" />
                <span className="font-mono text-xs font-semibold text-zinc-200">Suporte</span>
                <span className="text-xs text-zinc-400">assistido</span>
              </div>
              <span className="hidden h-4 w-px bg-zinc-800 sm:block" />
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-red-500" />
                <span className="font-mono text-xs font-semibold text-zinc-200">Renovação</span>
                <span className="text-xs text-zinc-400">sob demanda</span>
              </div>
            </div>

          </div>

          <div className="mx-auto mt-16 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </section>

        {/* ===== MARQUEE TICKER ===== */}
        <div className="relative flex overflow-hidden border-y border-zinc-800/80 bg-zinc-950/60 py-4 select-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070709] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070709] to-transparent" />

          <div className="flex min-w-full shrink-0 animate-marquee items-center gap-10 pr-10">
            {Array.from({ length: 4 }).flatMap(() => marqueeItems).map((item, idx) => (
              <span key={idx} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs tracking-widest text-zinc-400 font-semibold uppercase">
                {item}
                <span className="h-1.5 w-1.5 rotate-45 bg-red-500" />
              </span>
            ))}
          </div>
        </div>

        {/* ===== PLANOS SECTION ===== */}
        <section id="planos" className="relative mx-auto w-full max-w-7xl px-5 py-24 md:py-32">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Planos mensais</span>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white">
              Escolha sua experiência
            </h2>
          </div>

          {/* Currency Switcher */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 p-1">
              <button
                onClick={() => setCurrency('BRL')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  currency === 'BRL' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                BRL
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  currency === 'USD' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                USD
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.name
              return (
                <article
                  key={p.num}
                  onClick={() => setSelectedPlan(p.name)}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
                    p.highlight
                      ? 'border-red-500/60 bg-red-950/[0.08] hover:border-red-500'
                      : isSelected
                      ? 'border-zinc-400 bg-zinc-900/80 shadow-2xl'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-400">{p.num}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        {p.tag}
                      </span>
                    </div>

                    {p.popularTag && (
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        p.highlight ? 'border border-red-500/40 bg-red-500/20 text-red-300' : 'border border-zinc-700 bg-zinc-800 text-zinc-300'
                      }`}>
                        {p.popularTag}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    Mensal · {p.period}
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{p.name}</h3>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-xs font-semibold text-zinc-400">{currency === 'BRL' ? 'R$' : '$'}</span>
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      {currency === 'BRL' ? p.priceBRL : p.priceUSD}
                    </span>
                    {currency === 'BRL' && <span className="font-mono text-sm font-semibold text-zinc-400">,00</span>}
                    <span className="ml-1 font-mono text-xs font-semibold text-zinc-400">/ 30 dias</span>
                  </div>

                  <div className="mt-4 border-t border-zinc-800/80 pt-4">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Diferencial</div>
                    <p className="mt-1.5 text-sm font-semibold leading-relaxed text-zinc-400">{p.diff}</p>
                  </div>

                  <div className="mt-4 border-t border-zinc-800/80 pt-4">
                    <div className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Informações</div>
                    <ul className="space-y-2">
                      {p.features.map((f, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm font-semibold ${f.included ? 'text-zinc-200' : 'text-zinc-400/60 line-through'}`}>
                          {f.included ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          ) : (
                            <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                          )}
                          <span>{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-6">
                    <a
                      href="https://discord.gg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                        p.highlight
                          ? 'bg-red-600/20 text-red-200 border border-red-500/40 hover:bg-red-600/30'
                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                    >
                      <span>Selecionar {p.name}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-8 text-center font-mono text-xs font-semibold text-zinc-400">
            Todos os planos são mensais. A continuidade após 30 dias depende da renovação da assinatura.
          </p>
        </section>

        {/* ===== SHOWCASE INTERATIVO IN-GAME ===== */}
        <section id="showcase" className="relative border-y border-zinc-800/80 bg-zinc-950/40 py-24 md:py-32">
          <div className="mx-auto w-full max-w-5xl px-5">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Experiência comercial</span>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white">
              Controle direto.<br />
              <span className="text-zinc-400">Interface sem excesso.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-zinc-400">
              O ambiente MRC Bypass concentra os principais controles em uma interface compacta, com resposta imediata e perfis preparados para diferentes formas de uso.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-semibold text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-semibold text-white">4</span>
                <span className="text-xs">abas</span>
              </div>
              <span className="hidden h-6 w-px bg-zinc-800 sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-semibold text-white">30d</span>
                <span className="text-xs">por ciclo</span>
              </div>
              <span className="hidden h-6 w-px bg-zinc-800 sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-semibold text-white">1:1</span>
                <span className="text-xs">ativação</span>
              </div>
            </div>

            {/* Interactive Showcase In-Game Window */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-800 bg-[#09090b] shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
              <div className="flex flex-col md:flex-row">
                
                {/* Left Sidebar */}
                <div className="w-full md:w-[200px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0c0c0e]">
                  <div className="px-5 py-5 text-center border-b border-zinc-800/60">
                    <h4 className="text-sm font-semibold tracking-tight text-white">
                      MRC <span className="font-normal text-zinc-400">Remote</span>
                    </h4>
                  </div>

                  <nav className="p-2.5">
                    <ul className="flex flex-row md:flex-col gap-1 overflow-x-auto">
                      {[
                        { id: 'Combat', icon: Crosshair },
                        { id: 'Visuals', icon: Eye },
                        { id: 'Miscellaneous', icon: Layers },
                        { id: 'Settings', icon: Settings },
                      ].map((tab) => {
                        const Icon = tab.icon
                        const active = showcaseMainTab === tab.id
                        return (
                          <li key={tab.id}>
                            <button
                              onClick={() => setShowcaseMainTab(tab.id as any)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold transition-all whitespace-nowrap ${
                                active
                                  ? 'bg-white text-black shadow-md'
                                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span>{tab.id}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>

                  <div className="hidden md:block p-2.5 mt-auto">
                    <div className="mb-2 flex items-center justify-center gap-2 rounded-lg border border-emerald-900/40 bg-emerald-950/20 px-2.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Conectado
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-5 md:p-7">
                  {/* Subtabs */}
                  <div className="mb-5 flex w-fit items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
                    {(['Rage', 'Legit', 'Silent', 'Extras'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setShowcaseSubTab(st)}
                        className={`rounded-md px-4 py-1 text-center text-xs font-semibold transition-all ${
                          showcaseSubTab === st
                            ? 'bg-white text-black shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Panel Container */}
                  <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        {showcaseMainTab} — {showcaseSubTab}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {/* Toggles */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs font-semibold text-zinc-300">Aimbot Head</span>
                          <button
                            onClick={() => toggleSwitch('aimbotHead')}
                            className={`relative h-[22px] w-[40px] rounded-full border transition-all ${
                              toggles.aimbotHead ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all ${
                                toggles.aimbotHead ? 'left-[20px] bg-black' : 'left-[2px] bg-zinc-500'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs font-semibold text-zinc-300">Precision Lock</span>
                          <button
                            onClick={() => toggleSwitch('precision')}
                            className={`relative h-[22px] w-[40px] rounded-full border transition-all ${
                              toggles.precision ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all ${
                                toggles.precision ? 'left-[20px] bg-black' : 'left-[2px] bg-zinc-500'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs font-semibold text-zinc-300">Draw FOV Circle</span>
                          <button
                            onClick={() => toggleSwitch('drawFov')}
                            className={`relative h-[22px] w-[40px] rounded-full border transition-all ${
                              toggles.drawFov ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all ${
                                toggles.drawFov ? 'left-[20px] bg-black' : 'left-[2px] bg-zinc-500'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs font-semibold text-zinc-300">Stream Mode (Anti-Obs)</span>
                          <button
                            onClick={() => toggleSwitch('streamMode')}
                            className={`relative h-[22px] w-[40px] rounded-full border transition-all ${
                              toggles.streamMode ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all ${
                                toggles.streamMode ? 'left-[20px] bg-black' : 'left-[2px] bg-zinc-500'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Sliders & Dropdown */}
                      <div className="space-y-3">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Max Distance</span>
                            <span className="font-mono text-xs font-semibold text-white">{maxDistance}m</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="300"
                            value={maxDistance}
                            onChange={(e) => setMaxDistance(Number(e.target.value))}
                            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-zinc-800 accent-white outline-none"
                          />
                        </div>

                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400">FOV Radius</span>
                            <span className="font-mono text-xs font-semibold text-white">{fov}°</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="180"
                            value={fov}
                            onChange={(e) => setFov(Number(e.target.value))}
                            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-zinc-800 accent-white outline-none"
                          />
                        </div>

                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Smoothing</span>
                            <span className="font-mono text-xs font-semibold text-white">{smoothing}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={smoothing}
                            onChange={(e) => setSmoothing(Number(e.target.value))}
                            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-zinc-800 accent-white outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-xs font-semibold text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Interface real do produto
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-xs font-semibold text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Funções organizadas por aba
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-xs font-semibold text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Controles interativos
              </div>
            </div>

          </div>
        </section>

        {/* ===== REFERÊNCIAS REAIS ===== */}
        <section id="referencias" className="relative border-t border-zinc-800/80 bg-zinc-950/30 py-24 md:py-32">
          <div className="mx-auto w-full max-w-6xl px-5">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Experiências documentadas</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-white">
              Referências reais
            </h2>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-zinc-400">
              Registros enviados por clientes, publicados com dados pessoais e identificadores estritamente protegidos.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { id: '01', desc: 'Registro de uso e bypass de scanner sem detecção' },
                { id: '02', desc: 'Referência de estabilidade em partidas competitivas' },
                { id: '03', desc: 'Feedback de comunidade com aprovação na telagem manual' },
              ].map((ref) => (
                <div
                  key={ref.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700"
                >
                  <div className="flex h-36 w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    <ShieldCheck className="h-12 w-12 opacity-40 group-hover:opacity-80 transition-opacity" />
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-relaxed text-zinc-300">{ref.desc}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-4">
                    <span className="font-mono text-xs font-semibold text-white">Registro {ref.id}</span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Dados protegidos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section id="faq" className="relative py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Informações importantes</span>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-white">
                Antes de assinar
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-400">
                Transparência no ciclo, no atendimento e na renovação.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                MRC Bypass
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 transition-all hover:border-zinc-700"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors"
                    >
                      <span className="text-base font-semibold text-zinc-100">{faq.q}</span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300">
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-zinc-800/60 px-5 pb-5 pt-3">
                        <p className="text-sm font-semibold leading-relaxed text-zinc-400">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="relative border-t border-zinc-800/80 bg-[#070709] py-14">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              <div className="col-span-2">
                <div className="flex items-center gap-2.5 select-none">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-white font-semibold text-xs">
                    M
                  </div>
                  <span className="font-sans text-[17px] font-semibold tracking-tight text-white">
                    MRC <span className="text-zinc-400 font-normal">Bypass</span>
                  </span>
                </div>
                <p className="mt-4 max-w-xs text-sm font-semibold leading-relaxed text-zinc-400">
                  Planos mensais com ativação assistida e suporte direto.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Produto</h4>
                <ul className="mt-4 space-y-3 text-sm font-semibold">
                  <li><a href="#planos" className="text-zinc-400 hover:text-white transition-colors">Planos</a></li>
                  <li><a href="#showcase" className="text-zinc-400 hover:text-white transition-colors">Showcases</a></li>
                  <li><a href="#referencias" className="text-zinc-400 hover:text-white transition-colors">Referências</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">Suporte</h4>
                <ul className="mt-4 space-y-3 text-sm font-semibold">
                  <li><a href="#faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Painel do Cliente</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-14 border-t border-zinc-800/60 pt-8 flex items-center justify-between text-xs text-zinc-400 font-mono font-semibold">
              <p>© 2026 MRC Bypass. Todos os direitos reservados.</p>
              <p className="text-zinc-400">v4.2 PROD</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
