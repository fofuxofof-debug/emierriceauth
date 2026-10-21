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
  Search,
  Crosshair,
  Flame,
  BadgeCheck,
  Cpu,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: string
  badge?: string
}

export default function HomePage() {
  const [activeGame, setActiveGame] = useState<'ff' | 'val'>('ff')
  const [ffSelectedPlan, setFfSelectedPlan] = useState<string>('ff_30d')
  const [valSelectedPlan, setValSelectedPlan] = useState<string>('val_mes')
  const [searchQuery, setSearchQuery] = useState('')

  const ffPlans: Plan[] = [
    { id: 'ff_1d', name: '1 Dia', price: 'R$ 10', badge: 'Diário' },
    { id: 'ff_3d', name: '3 Dias', price: 'R$ 20' },
    { id: 'ff_30d', name: '30 Dias', price: 'R$ 50', badge: 'Mais Vendido' },
    { id: 'ff_90d', name: '90 Dias', price: 'R$ 100', badge: 'Melhor Custo' },
  ]

  const valPlans: Plan[] = [
    { id: 'val_sem', name: 'Semanal', price: 'R$ 55' },
    { id: 'val_mes', name: 'Mensal', price: 'R$ 120', badge: 'Recomendado' },
    { id: 'val_uni', name: 'Build Única', price: 'R$ 300', badge: 'Vitalício' },
  ]

  const currentPlan =
    activeGame === 'ff'
      ? ffPlans.find((p) => p.id === ffSelectedPlan) || ffPlans[2]
      : valPlans.find((p) => p.id === valSelectedPlan) || valPlans[1]

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-[#db00ff]/30 selection:text-white flex flex-col justify-between">
      
      {/* Subtle Purple Ambient Lighting (Xerecao Style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 -z-10 h-[600px] w-[1100px] max-w-[100vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(219,0,255,0.14),transparent_70%)] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,2,224,0.1),transparent_70%)] blur-[130px]"
      />

      {/* ================= HEADER (XERECAO.COM STYLE) ================= */}
      <header className="sticky z-20 top-0 backdrop-blur-md py-3.5 flex items-center border-b border-white/5 bg-[#09090b]/85 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Logo & Verified Badge */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#db00ff] text-white font-black text-lg shadow-[0_0_20px_rgba(219,0,255,0.45)] group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-lg text-white">
                Smooth <span className="text-[#db00ff]">Store</span>
              </span>
              <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/20" />
            </div>
          </Link>

          {/* Central Search Bar (Xerecao Style) */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-6">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar software ou jogo..."
              className="w-full h-10 ps-10 pe-4 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#db00ff] focus:ring-1 focus:ring-[#db00ff]/40 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[0.6rem] px-4 py-2 text-xs font-semibold text-zinc-300 bg-white/5 hover:text-white hover:bg-white/10 border border-white/10 transition-all hover:border-[#db00ff]/50"
            >
              <MessageCircle className="h-4 w-4 text-[#db00ff]" />
              <span className="hidden sm:inline">Discord</span>
            </a>

            <Link
              href="/login"
              className="btn-primary text-xs uppercase tracking-wider h-9 px-4 rounded-[0.6rem]"
            >
              <span>Painel</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* Floating Bottom Discord Helper */}
      <a
        href="https://discord.gg/sswR4rK4r"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Discord Oficial"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#101012]/95 text-[#db00ff] shadow-[0_0_30px_rgba(219,0,255,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#db00ff] active:scale-95 group"
      >
        <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </a>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col justify-center">

        {/* ===== HERO SECTION (XERECAO MOTTO) ===== */}
        <section className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center max-w-4xl">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            <span className="text-[#db00ff]">SMOOTH</span> is not just a store but also a community
          </h1>

          <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
            A melhor tecnologia para quem busca estabilidade, proteção avançada de HWID e entrega 100% automatizada no Discord.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#loja" className="btn-primary text-sm h-11 px-6 rounded-[0.6rem]">
              Ver produtos <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm h-11 px-6 rounded-[0.6rem]"
            >
              <MessageCircle className="h-4 w-4 text-[#db00ff]" />
              Entrar no Discord
            </a>
          </div>

        </section>

        {/* ===== CATEGORIAS POPULARES ===== */}
        <section className="container mx-auto px-4 pb-12 max-w-5xl">
          <h2 className="mb-4 font-bold text-xl sm:text-2xl text-white">Categorias populares</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveGame('ff')}
              className={`p-4 rounded-[0.6rem] border text-left flex items-center gap-3 cursor-pointer ${
                activeGame === 'ff'
                  ? 'border-[#db00ff] bg-[#db00ff]/10 shadow-[0_0_20px_rgba(219,0,255,0.2)]'
                  : 'border-white/5 bg-[#101012]'
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-[#db00ff]/20 text-[#db00ff] flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Free Fire</p>
                <p className="text-[11px] text-zinc-500">External Pro</p>
              </div>
            </button>

            <button
              onClick={() => setActiveGame('val')}
              className={`p-4 rounded-[0.6rem] border text-left flex items-center gap-3 cursor-pointer ${
                activeGame === 'val'
                  ? 'border-[#db00ff] bg-[#db00ff]/10 shadow-[0_0_20px_rgba(219,0,255,0.2)]'
                  : 'border-white/5 bg-[#101012]'
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-[#db00ff]/20 text-[#db00ff] flex items-center justify-center shrink-0">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Valorant</p>
                <p className="text-[11px] text-zinc-500">Vanguard Ring-3</p>
              </div>
            </button>

            <div className="p-4 rounded-[0.6rem] border border-white/5 bg-[#101012] flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Entrega Pix</p>
                <p className="text-[11px] text-zinc-500">Instantânea</p>
              </div>
            </div>

            <div className="p-4 rounded-[0.6rem] border border-white/5 bg-[#101012] flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Anti-Ban</p>
                <p className="text-[11px] text-zinc-500">100% Seguro</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VITRINE DE PRODUTOS (XERECAO CATEGORY STYLE) ===== */}
        <section id="loja" className="container mx-auto px-4 py-12 max-w-5xl">
          
          {/* Exact Xerecao Header Badge */}
          <div className="mb-6">
            <h3 className="xrc-badge text-sm sm:text-base">
              <Sparkles className="h-4 w-4 text-[#db00ff]" />
              <span>{activeGame === 'ff' ? 'Free Fire External' : 'Valorant Vanguard'}</span>
            </h3>
          </div>

          {/* Product Showcase Card */}
          <div className="xrc-card p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product Info */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ● Atualizado & 100% Funcional
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-zinc-400 border border-white/10">
                      Entrega Automática
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {activeGame === 'ff' ? 'Free Fire External Pro' : 'Valorant Vanguard Elite'}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                    {activeGame === 'ff'
                      ? 'Desenvolvido sob medida para máxima estabilidade em BlueStacks 4/5, MSI e emuladores. Sem injeção invasiva e com bypass avançado.'
                      : 'Arquitetura ring-3 de alta precisão. Totalmente transparente ao Vanguard da Riot Games com zero perda de FPS e HWID spoofer limpo incluso.'}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Recursos Inclusos:
                    </p>
                    {activeGame === 'ff' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>Aimbot Suave FOV 360°</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>ESP Skeleton, Box & Vida</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>StreamProof (Invisível no OBS)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>Bypass Anti-Ban Seguro</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>ESP Glow & Chams de Precisão</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>Aimbot com Recoil Control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>HWID Spoofer Limpo Incluso</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#db00ff]" />
                          <span>Compatível Windows 10 & 11</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#db00ff]" /> Suporte 24/7
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-[#db00ff]" /> Envio Automático
                  </span>
                </div>
              </div>

              {/* Plan Selection & Checkout Card */}
              <div className="lg:col-span-5 bg-[#09090b] rounded-[0.6rem] p-5 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
                      Selecione a Duração:
                    </span>
                    <span className="text-[11px] text-[#db00ff] font-semibold">
                      Entrega Instantânea
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    {activeGame === 'ff'
                      ? ffPlans.map((plan) => {
                          const isSelected = ffSelectedPlan === plan.id
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setFfSelectedPlan(plan.id)}
                              className={`p-3 rounded-[0.6rem] border text-left relative cursor-pointer ${
                                isSelected
                                  ? 'border-[#db00ff] bg-[#db00ff]/10 shadow-[0_0_15px_rgba(219,0,255,0.25)]'
                                  : 'border-white/10 bg-white/[0.02]'
                              }`}
                            >
                              {plan.badge && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#db00ff] text-white">
                                  {plan.badge}
                                </span>
                              )}
                              <span className="block text-xs font-semibold text-zinc-400">
                                {plan.name}
                              </span>
                              <span className="block text-base font-bold text-white mt-1">
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
                              className={`p-3 rounded-[0.6rem] border text-left relative cursor-pointer ${
                                isSelected
                                  ? 'border-[#db00ff] bg-[#db00ff]/10 shadow-[0_0_15px_rgba(219,0,255,0.25)]'
                                  : 'border-white/10 bg-white/[0.02]'
                              } ${plan.id === 'val_uni' ? 'col-span-2' : ''}`}
                            >
                              {plan.badge && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#db00ff] text-white">
                                  {plan.badge}
                                </span>
                              )}
                              <span className="block text-xs font-semibold text-zinc-400">
                                {plan.name}
                              </span>
                              <span className="block text-base font-bold text-white mt-1">
                                {plan.price}
                              </span>
                            </button>
                          )
                        })}
                  </div>

                  <div className="p-3 rounded-[0.6rem] bg-white/[0.02] border border-white/5 text-xs text-zinc-400 mb-5">
                    <p className="font-semibold text-white mb-1 flex items-center gap-1.5 text-[11px]">
                      <CreditCard className="h-3.5 w-3.5 text-[#db00ff]" />
                      Pagamento Automático:
                    </p>
                    <p className="text-[11px]">Pix instantâneo, Cartão de Crédito ou Criptomoedas via Discord.</p>
                  </div>
                </div>

                <div>
                  <a
                    href="https://discord.gg/sswR4rK4r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full h-11 text-sm font-semibold rounded-[0.6rem] flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Adquirir {currentPlan?.name} ({currentPlan?.price}) no Discord</span>
                  </a>
                  <p className="text-center text-[10px] text-zinc-500 mt-2">
                    Clique para abrir o carrinho oficial e receber automaticamente
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== BANNER DA COMUNIDADE (XERECAO DISCORD STYLE) ===== */}
        <section className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="xrc-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto">
              <span className="xrc-badge text-xs mb-4">
                Comunidade Oficial
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">
                Junte-se à nossa comunidade
              </h2>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Tire dúvidas, participe de sorteios e receba atualizações em tempo real pelo nosso servidor no Discord.
              </p>
              <div className="mt-6 flex justify-center">
                <a
                  href="https://discord.gg/sswR4rK4r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm h-11 px-8 rounded-[0.6rem]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Entrar no Servidor Discord</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/5 bg-[#09090b] px-4 py-8 text-zinc-500 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#db00ff] text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-zinc-300">Smooth Store</span>
          </div>

          <p className="text-center sm:text-left text-zinc-500">
            © 2026 Smooth Store. All rights reserved. Not just a store but also a community.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://discord.gg/sswR4rK4r" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Discord
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Painel
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
