'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Eye, Shield, Headset, Lock,
  Cpu, Sparkles, Star, Zap, MessageCircle, Plus, Minus,
  Terminal, CheckCircle2, ShieldCheck, Activity, Layers, Server, RefreshCw
} from 'lucide-react'
import { SiteTopbar } from '@/components/site-topbar'
import { SiteFooter } from '@/components/site-footer'
import { PricingCard } from '@/components/pricing-card'

// Count-up animado pros stats
function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const dur = 1800
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <span>{prefix}{n.toLocaleString('pt-BR')}{suffix}</span>
}

// FAQ accordion
function FAQItem({ q, a, delay = 0 }: { q: string; a: string; delay?: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="reveal reveal-up rounded-2xl border border-zinc-800 bg-[#0e0e11] hover:border-zinc-700 transition-colors overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left text-zinc-100 transition-colors"
      >
        <span className="font-semibold text-sm sm:text-base">{q}</span>
        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-4">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'public' | 'private' | 'remote' | 'valorant'>('all')

  // Scroll reveal
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="bg-sky relative min-h-screen overflow-x-hidden text-zinc-100 selection:bg-white selection:text-black">
      <SiteTopbar />

      {/* Orbs de iluminação PB de fundo */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 sm:px-6 pt-32 sm:pt-36 pb-16"
      >
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-4xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#0e0e11] px-4 py-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300 card-in backdrop-blur-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-white animate-beacon" />
            <span className="font-mono font-bold">KERNEL V4.2 · UNDETECTED SYSTEM</span>
          </div>

          {/* Title */}
          <h1
            className="logo-shimmer logo-glow text-6xl sm:text-7xl md:text-9xl font-black tracking-tight card-in leading-[1.02] pb-1 select-none"
            style={{ animationDelay: '100ms' }}
          >
            MRC BYPASS
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl px-2 card-in leading-relaxed font-normal"
            style={{ animationDelay: '200ms' }}
          >
            Vendemos qualidade, não <span className="text-zinc-600 line-through">hype</span>.
            <br />
            <span className="text-white font-semibold">Cheats premium</span> com tecnologia anti-detecção.
          </p>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto card-in"
            style={{ animationDelay: '300ms' }}
          >
            <a
              href="#pricing"
              className="button-shine group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-[0_0_35px_rgba(255,255,255,0.25)]"
            >
              Comprar Agora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="https://discord.gg/ZCWxPCyc7B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-200 hover:border-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Discord Oficial
            </a>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (CLEAN ANIMATED CARDS) ===== */}
      <section id="features" className="relative z-10 px-5 sm:px-6 py-20 sm:py-28 border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="reveal reveal-up mb-12 sm:mb-16 flex flex-col items-center text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3 font-mono">━ RECURSOS ━</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Por que escolher a <span className="logo-shimmer">MRC Bypass</span>?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg">
              A solução completa pra quem leva o jogo a sério.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: Eye, title: 'Indetectável', desc: 'Tecnologia em nível de kernel. Seu acesso nunca será detectado em varreduras de anti-cheat.', delay: 0 },
              { icon: Headset, title: 'Suporte VIP 24/7', desc: 'Atendimento exclusivo no Discord com resposta em minutos para instalação e suporte.', delay: 100 },
              { icon: Lock, title: 'Privacidade Total', desc: '100% anônimo. Não coletamos dados pessoais nem informações confidenciais do seu dispositivo.', delay: 200 },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="reveal reveal-up hover-lift relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0e0e11] p-6 sm:p-7 group shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-zinc-600 transition-all"
                  style={{ animationDelay: `${f.delay}ms` }}
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING & PRODUCTS SECTION ===== */}
      <section id="pricing" className="relative z-10 px-5 sm:px-6 py-20 sm:py-28 border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="reveal reveal-up mb-10 sm:mb-14 flex flex-col items-center text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3 font-mono">━ CATÁLOGO OFICIAL ━</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Selecione o seu plano
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg">
              Liberação automática e suporte passo a passo de instalação.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full border border-zinc-800 bg-[#0e0e11]">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'public', label: 'FF Public' },
                { id: 'private', label: 'FF Private' },
                { id: 'remote', label: 'FF Remote' },
                { id: 'valorant', label: 'Valorant' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategory === tab.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* PUBLIC */}
          {(activeCategory === 'all' || activeCategory === 'public') && (
            <div className="mb-16">
              <div className="reveal reveal-up mb-6 flex flex-col items-center text-center gap-1.5">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">FREEFIRE · EMULADOR</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Plano Public</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">Estabilidade para jogadores casuais e ranqueadas.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PricingCard
                  name="Mensal"
                  description="Melhor custo-benefício"
                  price="R$200"
                  pricePeriod="/mês"
                  priceUsd="$40 USD"
                  features={['Aimbot + ESP Completo', 'Bypass BlueStacks / MSI', 'Atualizações frequentes', 'Suporte no Discord']}
                  delay={0}
                />
                <PricingCard
                  name="Permanente"
                  description="Acesso vitalício"
                  price="R$350"
                  pricePeriod="único"
                  priceUsd="$70 USD"
                  badge="Mais Vendido"
                  highlight
                  features={['Acesso permanente', 'Recursos atuais e futuros', 'Prioridade máxima em updates', 'Suporte VIP dedicado', 'Discord privado']}
                  delay={100}
                />
              </div>
            </div>
          )}

          {/* PRIVATE */}
          {(activeCategory === 'all' || activeCategory === 'private') && (
            <div className="mb-16">
              <div className="reveal reveal-up mb-6 flex flex-col items-center text-center gap-1.5">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">FREEFIRE · COMPETITIVO</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Plano Private</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">Build individual com proteção anti-screenshare avançada.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PricingCard
                  name="Mensal"
                  description="Acesso completo"
                  price="R$700"
                  pricePeriod="/mês"
                  priceUsd="$140 USD"
                  features={[
                    'Todos os recursos Private',
                    'Anti-Screenshare nível torneio',
                    'Compilação individual por cliente',
                    'Atualizações instantâneas',
                    'Suporte prioritário 24/7',
                  ]}
                  delay={0}
                />
                <PricingCard
                  name="Permanente"
                  description="Acesso vitalício"
                  price="R$1.000"
                  pricePeriod="único"
                  priceUsd="$200 USD"
                  badge="Elite"
                  highlight
                  features={[
                    'Acesso permanente',
                    'Todos os recursos Private',
                    'Anti-Screenshare nível torneio',
                    'Build individual polimórfica',
                    'Atualizações vitalícias',
                    'Suporte VIP individual',
                    'Acesso ao canal secreto Discord',
                  ]}
                  delay={100}
                />
              </div>
            </div>
          )}

          {/* REMOTE */}
          {(activeCategory === 'all' || activeCategory === 'remote') && (
            <div className="mb-16">
              <div className="reveal reveal-up mb-6 flex flex-col items-center text-center gap-1.5">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">FREEFIRE · WEB HEADLESS</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Plano Remote</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">Controle 100% pelo celular ou navegador. Zero interface no PC.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PricingCard
                  name="Mensal"
                  description="Acesso completo"
                  price="R$400"
                  pricePeriod="/mês"
                  priceUsd="$80 USD"
                  features={[
                    'Controle PC + Smartphone',
                    'Painel web em tempo real',
                    'Sem nenhum arquivo de menu no PC',
                    'Atualizações constantes',
                    'Suporte no Discord',
                  ]}
                  delay={0}
                />
                <PricingCard
                  name="Permanente"
                  description="Acesso vitalício"
                  price="R$600"
                  pricePeriod="único"
                  priceUsd="$120 USD"
                  badge="Inovador"
                  highlight
                  features={[
                    'Acesso vitalício',
                    'Controle PC + Smartphone',
                    'Painel web em tempo real',
                    'Sem nenhum arquivo de menu no PC',
                    'Atualizações vitalícias',
                    'Suporte VIP dedicado',
                    'Discord privado',
                  ]}
                  delay={100}
                />
              </div>
            </div>
          )}

          {/* VALORANT */}
          {(activeCategory === 'all' || activeCategory === 'valorant') && (
            <div className="mb-4">
              <div className="reveal reveal-up mb-6 flex flex-col items-center text-center gap-1.5">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">VALORANT · COLOR ENGINE</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Aim Color</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">Aimbot de cor suave, trigger bot e recoil assist.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <PricingCard
                  name="Semanal"
                  description="Teste por 7 dias"
                  price="R$50"
                  pricePeriod="/semana"
                  priceUsd="$10 USD"
                  features={['Acesso por 7 dias', 'Aim assist + Triggerbot', 'Suporte no Discord']}
                  delay={0}
                />
                <PricingCard
                  name="Mensal"
                  description="Melhor custo-benefício"
                  price="R$80"
                  pricePeriod="/mês"
                  priceUsd="$16 USD"
                  badge="Recomendado"
                  highlight
                  features={['Acesso mensal', 'Todos os recursos Color', 'Configs pré-ajustadas', 'Suporte no Discord']}
                  delay={100}
                />
                <PricingCard
                  name="Permanente"
                  description="Acesso vitalício"
                  price="R$120"
                  pricePeriod="único"
                  priceUsd="$24 USD"
                  features={['Acesso vitalício', 'Atualizações vitalícias', 'Configs competitivas', 'Suporte VIP']}
                  delay={200}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="relative z-10 px-5 sm:px-6 py-20 sm:py-28 border-t border-zinc-800/80">
        <div className="mx-auto max-w-3xl">
          <div className="reveal reveal-up mb-10 sm:mb-12 flex flex-col items-center text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3 font-mono">━ DÚVIDAS FREQUENTES ━</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { q: 'O sistema é realmente indetectável?', a: 'Sim. Empregamos drivers em nível de kernel sem ganchos em memória (hookless), mantendo o processo do jogo inalterado. A taxa de detecção é zero.', delay: 0 },
              { q: 'Como recebo o loader após a compra?', a: 'O procedimento é conduzido via Discord ou diretamente pelo painel autenticado. Após a confirmação, sua key é gerada imediatamente junto ao tutorial completo de instalação.', delay: 80 },
              { q: 'E se o jogo atualizar com um novo patch?', a: 'Nossa equipe de engenharia atualiza os offsets e o bypass em minutos. Você não precisa baixar nada novo se usar versões em nuvem.', delay: 160 },
              { q: 'Posso resetar meu HWID se trocar de computador?', a: 'Sim, o reset de hardware pode ser realizado com rapidez pelo painel de controle ou com suporte da nossa equipe.', delay: 240 },
              { q: 'Qual o tempo de resposta do suporte?', a: 'Nosso atendimento é ágil e funciona 24 horas por dia no Discord, com tempo médio de resposta de até 5 minutos.', delay: 320 },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} delay={item.delay} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="relative z-10 px-5 sm:px-6 pb-20 sm:pb-28">
        <div
          className="reveal reveal-zoom mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-[#0e0e11] px-6 sm:px-12 py-14 sm:py-20 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          <div className="relative">
            <div className="inline-flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-white text-white" />
              ))}
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Pronto para elevar seu <span className="logo-shimmer">nível de jogo</span>?
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 mb-8 max-w-md mx-auto">
              Entre agora na comunidade oficial do Discord, confira os vídeos demonstrativos e garanta seu acesso.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
              <a
                href="https://discord.gg/ZCWxPCyc7B"
                target="_blank"
                rel="noopener noreferrer"
                className="button-shine group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-[0_0_35px_rgba(255,255,255,0.25)]"
              >
                <MessageCircle className="h-4 w-4" />
                Entrar no Discord
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-200 hover:border-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                Ver Planos e Valores
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
