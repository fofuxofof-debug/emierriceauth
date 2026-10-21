'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  Check,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Crosshair,
  Flame,
  Activity,
  Cpu,
  Monitor,
  CreditCard,
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: string
  badge?: string
  popular?: boolean
}

export default function HomePage() {
  const [activeGame, setActiveGame] = useState<'ff' | 'val'>('ff')
  const [ffSelectedPlan, setFfSelectedPlan] = useState<string>('ff_30d')
  const [valSelectedPlan, setValSelectedPlan] = useState<string>('val_mes')

  const ffPlans: Plan[] = [
    { id: 'ff_1d', name: '1 Dia', price: 'R$ 10', badge: 'Teste' },
    { id: 'ff_3d', name: '3 Dias', price: 'R$ 20' },
    { id: 'ff_30d', name: '30 Dias', price: 'R$ 50', popular: true, badge: 'Mais Vendido' },
    { id: 'ff_90d', name: '90 Dias', price: 'R$ 100', badge: 'Melhor Custo' },
  ]

  const valPlans: Plan[] = [
    { id: 'val_sem', name: 'Semanal', price: 'R$ 55' },
    { id: 'val_mes', name: 'Mensal', price: 'R$ 120', popular: true, badge: 'Recomendado' },
    { id: 'val_uni', name: 'Build Única', price: 'R$ 300', badge: 'Vitalício' },
  ]

  const currentPlan =
    activeGame === 'ff'
      ? ffPlans.find((p) => p.id === ffSelectedPlan) || ffPlans[2]
      : valPlans.find((p) => p.id === valSelectedPlan) || valPlans[1]

  return (
    <div className="relative min-h-screen bg-[#08080a] text-white font-sans antialiased selection:bg-white/20 selection:text-white overflow-x-hidden flex flex-col justify-between">
      
      {/* Dynamic Monochrome Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 -z-10 h-[650px] w-[1200px] max-w-[100vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] blur-[140px]"
      />

      {/* Cyber Grid Background */}
      <div className="tech-grid absolute inset-0 -z-20 opacity-30 pointer-events-none" aria-hidden="true" />

      {/* ================= HEADER / TOPBAR ================= */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="carbon-nav relative flex w-full max-w-6xl items-center justify-between rounded-2xl py-3 px-5 transition-all duration-300">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 select-none group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-black text-base shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg font-black tracking-tight text-white flex items-center gap-1 leading-none">
                SMOOTH <span className="text-zinc-400">STORE</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-semibold mt-0.5">
                Private Systems
              </span>
            </div>
          </Link>

          {/* System Status Ping */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121215] border border-zinc-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-zinc-300 font-medium">SISTEMA ONLINE & SEGURO</span>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <a href="#inicio" className="hover:text-white transition-colors">Início</a>
            <a href="#produtos" className="hover:text-white transition-colors">Produtos</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Vantagens</a>
            <a href="#discord" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-300 bg-[#141418] hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm font-mono"
            >
              <MessageCircle className="h-4 w-4 text-white" />
              <span>Discord</span>
            </a>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            >
              <span>Painel</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Floating Bottom Discord Direct Button */}
      <a
        href="https://discord.gg/sswR4rK4r"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Discord Oficial"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-[#0e0e11]/95 text-white shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-white active:scale-95 group"
      >
        <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 text-white" />
      </a>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col justify-center pt-32">

        {/* ===== HERO SECTION ===== */}
        <section id="inicio" className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto">
          
          {/* Top Cyber Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-zinc-800 bg-[#121215] text-zinc-300 text-xs font-mono font-semibold uppercase tracking-wider mb-8 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>Versão 2026 Atualizada • 100% Funcional</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase max-w-4xl leading-[1.08]">
            DOMINE CADA PARTIDA COM <span className="monochrome-text-gradient monochrome-glow">PRECISÃO CIRÚRGICA.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
            Softwares de alto rendimento com segurança extrema, proteção HWID integrada e entrega 100% automática em segundos via Discord.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#produtos"
              className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              <span>Ver Catálogo & Preços</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-[#121215] px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm font-mono"
            >
              <MessageCircle className="h-4 w-4 text-white" />
              <span>Comunidade Discord</span>
            </a>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            <div className="carbon-panel rounded-2xl p-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white">99.9%</span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mt-1 font-mono">Uptime Seguro</p>
            </div>
            <div className="carbon-panel rounded-2xl p-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-300">+3.500</span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mt-1 font-mono">Clientes Ativos</p>
            </div>
            <div className="carbon-panel rounded-2xl p-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white">0 Seg</span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mt-1 font-mono">Entrega Instantânea</p>
            </div>
            <div className="carbon-panel rounded-2xl p-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-300">100%</span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mt-1 font-mono">Indetectável</p>
            </div>
          </div>
        </section>

        {/* ===== PRODUCTS CATALOG SECTION ===== */}
        <section id="produtos" className="relative px-4 py-20 max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#121215] border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <Crosshair className="h-3.5 w-3.5" />
              <span>Vitrine Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Escolha o Seu Software
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-lg mx-auto">
              Selecione o produto desejado e o plano ideal para suas partidas competitivas.
            </p>

            {/* Game Selector Tabs */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-[#0e0e11] border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveGame('ff')}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeGame === 'ff'
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Flame className="h-4 w-4" />
                  <span>Free Fire External</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGame('val')}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeGame === 'val'
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Crosshair className="h-4 w-4" />
                  <span>Valorant Vanguard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Product Card */}
          <div className="carbon-panel rounded-3xl p-6 sm:p-10 border border-zinc-800 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Information & Features */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-white text-[11px] font-mono font-semibold uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Status: 100% Indetectável
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141418] border border-zinc-800 text-zinc-400 text-[11px] font-mono">
                      Entrega Instantânea
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {activeGame === 'ff' ? 'Free Fire External Pro' : 'Valorant Vanguard Elite'}
                  </h3>

                  <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                    {activeGame === 'ff'
                      ? 'Desenvolvido sob medida para máxima estabilidade em emuladores (BlueStacks 4/5, MSI, LDPlayer) e mobile. Execução leve sem injeção invasiva em arquivos de sistema.'
                      : 'Software desenvolvido com arquitetura ring-3 avançada, totalmente transparente ao Vanguard da Riot Games. Zero quedas de FPS e proteção HWID isolada inclusa.'}
                  </p>

                  {/* Feature Checkpoints */}
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                      Recursos Inclusos:
                    </div>

                    {activeGame === 'ff' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Aimbot FOV 360° Suave & Ajustável</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>ESP Skeleton, Box & Health Bar</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>StreamProof (Invisível no OBS e Discord)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Proteção Anti-Ban & Blacklist Zero</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Menu OSD Fluido com Tecla de Atalho</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Atualizações Automáticas na Nuvem</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>ESP Glow, Chams & Wireframe</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Aimbot Humanizado com Controle de Recuo</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>HWID Spoofer Limpo Integrado</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Totalmente Indetectável no Vanguard</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Windows 10 & 11 (Todas as Builds)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          <span>Zero Injeção na Memória do Jogo</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-white" />
                    <span>Garantia de Funcionamento</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Headphones className="h-4 w-4 text-white" />
                    <span>Suporte de Configuração</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Plan Picker & Purchase */}
              <div className="lg:col-span-5 bg-[#0e0e11] rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Selecione a Duração:
                    </span>
                    <span className="text-[11px] font-mono text-zinc-300 font-semibold">
                      Entrega Imediata
                    </span>
                  </div>

                  {/* Plan Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {activeGame === 'ff'
                      ? ffPlans.map((plan) => {
                          const isSelected = ffSelectedPlan === plan.id
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setFfSelectedPlan(plan.id)}
                              className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative cursor-pointer ${
                                isSelected
                                  ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                  : 'bg-[#141418] border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {plan.badge && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white text-black shadow-xs">
                                  {plan.badge}
                                </span>
                              )}
                              <span className="block text-xs font-semibold text-zinc-300">
                                {plan.name}
                              </span>
                              <span className="block text-lg font-black text-white mt-1 font-mono">
                                {plan.price}
                              </span>
                            </button>
                          )
                        })
                      : valPlans.map((plan) => {
                          const isSelected = valSelectedPlan === plan.id
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setValSelectedPlan(plan.id)}
                              className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative cursor-pointer ${
                                isSelected
                                  ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                  : 'bg-[#141418] border-zinc-800 hover:border-zinc-700'
                              } ${plan.id === 'val_uni' ? 'col-span-2' : ''}`}
                            >
                              {plan.badge && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white text-black shadow-xs">
                                  {plan.badge}
                                </span>
                              )}
                              <span className="block text-xs font-semibold text-zinc-300">
                                {plan.name}
                              </span>
                              <span className="block text-lg font-black text-white mt-1 font-mono">
                                {plan.price}
                              </span>
                            </button>
                          )
                        })}
                  </div>

                  {/* Payment Methods Notice */}
                  <div className="p-3.5 rounded-xl bg-[#141418] border border-zinc-800 text-xs text-zinc-300 mb-6">
                    <div className="flex items-center gap-2 font-mono text-white font-semibold mb-1 text-[11px]">
                      <CreditCard className="h-3.5 w-3.5 text-zinc-300" />
                      <span>Formas de Pagamento Aceitas:</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      • Pix com ativação automática instantânea<br />
                      • Cartão de Débito / Crédito<br />
                      • Binance / Criptomoedas
                    </p>
                  </div>
                </div>

                {/* Big Direct Buy Button via Discord */}
                <div>
                  <a
                    href="https://discord.gg/sswR4rK4r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm text-black bg-white hover:bg-zinc-200 flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Adquirir {currentPlan?.name} ({currentPlan?.price}) no Discord</span>
                  </a>
                  <p className="text-center text-[11px] text-zinc-500 font-mono mt-2">
                    Clique para abrir o carrinho oficial e receber automaticamente
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== BENTO GRID: DIFERENCIAIS ===== */}
        <section id="diferenciais" className="relative px-4 py-20 max-w-6xl mx-auto w-full">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#121215] border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Por que a Smooth Store?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Diferenciais de Engenharia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1 */}
            <div className="carbon-panel rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between hover-lift">
              <div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white uppercase">Entrega em Segundos</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Sem esperas. Assim que seu pagamento for confirmado via Pix, cartão ou cripto, nosso bot envia seu login e chave na hora.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="carbon-panel rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between hover-lift">
              <div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white uppercase">Proteção HWID</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Isolamento completo da identidade de hardware do seu computador, garantindo proteção contra bloqueios acidentais.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="carbon-panel rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between hover-lift">
              <div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white uppercase">Sincronização em Nuvem</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Atualizações transparentes. O software é atualizado diretamente pela nuvem quando o jogo atualiza, sem reinstalação manual.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="carbon-panel rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between hover-lift">
              <div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
                  <Headphones className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white uppercase">Suporte Humanizado</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Atendimento via ticket com equipe qualificada pronta para guiar desde a primeira instalação até os ajustes avançados.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ===== DISCORD COMMUNITY CTA BANNER ===== */}
        <section id="discord" className="relative px-4 py-16 max-w-5xl mx-auto w-full">
          <div className="carbon-panel rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden text-center">
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <MessageCircle className="h-3.5 w-3.5 text-white" />
                <span>Comunidade Oficial no Discord</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                Faça Parte da Elite
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
                Tire dúvidas, converse com outros membros, participe de eventos exclusivos e receba avisos de atualização em primeira mão.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://discord.gg/sswR4rK4r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Entrar no Servidor Discord</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121215] px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Área do Cliente (Painel)</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-900 bg-[#08080a] px-4 py-10 mt-16 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-extrabold text-xs">
              S
            </div>
            <span className="font-bold text-white uppercase tracking-wider text-sm">
              Smooth Store
            </span>
          </div>

          <p className="text-center sm:text-left text-zinc-500 font-mono">
            © 2026 Smooth Store. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Discord
            </a>
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
              Painel
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
