'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Server,
  Layers,
  ChevronRight,
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'ff' | 'val'>('ff')

  return (
    <div className="relative min-h-screen bg-[#050811] text-[#f1f5f9] font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col justify-between">
      
      {/* Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 -z-10 h-[600px] w-[1100px] max-w-[100vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_70%)] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_70%)] blur-[120px]"
      />
      <div className="grid-ambient-dots absolute inset-0 -z-20 opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Floating Modern Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="glass-nav relative flex w-full max-w-5xl items-center justify-between rounded-full py-2.5 pl-4 pr-3 transition-all duration-300">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 text-white font-extrabold text-sm shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="font-sans text-[17px] font-extrabold tracking-tight text-[#f1f5f9] flex items-center gap-1.5">
              Smooth <span className="text-sky-400 font-black">Store</span>
            </span>
          </Link>

          {/* Quick Anchor Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#inicio" className="hover:text-white transition-colors">Início</a>
            <a href="#produtos" className="hover:text-white transition-colors">Produtos</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Vantagens</a>
            <a href="#discord" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-sky-300 bg-sky-500/10 hover:text-white hover:bg-sky-500/20 border border-sky-500/30 transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5 text-sky-400" />
              <span>Discord</span>
            </a>

            <Link
              href="/login"
              className="neon-btn-primary inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Painel</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Floating Bottom Discord Helper */}
      <a
        href="https://discord.gg/sswR4rK4r"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Discord da Comunidade"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/30 bg-[#080d1a]/90 text-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-400 active:scale-95 group"
      >
        <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 text-sky-300" />
      </a>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col justify-center pt-28">

        {/* ===== HERO SECTION ===== */}
        <section id="inicio" className="relative flex flex-col items-center justify-center px-5 py-16 sm:py-24 text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(14,165,233,0.2)] animate-pulse-soft">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistemas 100% Online • Entrega Automática
          </div>

          {/* Main Title */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Software de Alta Performance <br className="hidden sm:inline" />
            <span className="neon-text-gradient">para seus Jogos Favoritos</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-pretty text-base sm:text-lg font-medium leading-relaxed text-slate-300 mb-10">
            Soluções de máxima estabilidade e proteção para <strong>Free Fire External</strong> e <strong>Valorant</strong>. Entrega imediata de chaves e ativação automática direto pelo nosso sistema.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
            <a
              href="#produtos"
              className="neon-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg cursor-pointer"
            >
              <span>Ver Catálogo & Preços</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-[#0a1122]/80 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:border-sky-500/40 hover:bg-[#0f1a36] transition-all backdrop-blur-md shadow-sm"
            >
              <MessageCircle className="h-4 w-4 text-sky-400" />
              <span>Acessar Discord</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>

          {/* Trust Highlights Grid */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl text-left">
            
            <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Entrega Instantânea</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Key entregue na hora via Pix ou Cartão.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Segurança de Ponta</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Proteção constante e indetectabilidade.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Proteção HWID</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Sua licença vinculada e 100% protegida.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Suporte Dedicado</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Atendimento individual no Discord.</p>
              </div>
            </div>

          </div>

        </section>

        {/* ===== PRODUCTS SHOWCASE SECTION ===== */}
        <section id="produtos" className="relative px-5 py-20 sm:py-28 max-w-5xl mx-auto w-full">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">Catálogo Oficial</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Nossos Produtos & Planos</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2 font-medium">
              Escolha seu jogo abaixo para conferir os valores. As compras e ativações acontecem de forma 100% automatizada no nosso Discord.
            </p>

            {/* Product Switch Tabs */}
            <div className="mt-8 inline-flex items-center rounded-full p-1 border border-slate-800 bg-[#080d1a] shadow-inner">
              <button
                onClick={() => setActiveTab('ff')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
                  activeTab === 'ff'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Free Fire External
              </button>
              <button
                onClick={() => setActiveTab('val')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
                  activeTab === 'val'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Valorant
              </button>
            </div>
          </div>

          {/* Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

            {/* Product 1: Free Fire External */}
            <div className={`glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${activeTab === 'ff' ? 'ring-2 ring-sky-500/60 shadow-[0_0_35px_rgba(14,165,233,0.15)]' : 'opacity-85'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    Mais Popular
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Indetectável
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">Free Fire External</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
                  Bypass de alta performance para Free Fire. Máxima compatibilidade e estabilidade contínua.
                </p>

                {/* Plan Pricing List */}
                <div className="mt-6 rounded-2xl bg-[#070c18]/90 border border-slate-800/80 p-4 divide-y divide-slate-800/60">
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">1 Dia</span>
                    <span className="text-white font-bold font-mono">R$ 10,00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">3 Dias</span>
                    <span className="text-white font-bold font-mono">R$ 20,00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">30 Dias (Mensal)</span>
                    <span className="text-sky-400 font-extrabold font-mono text-sm">R$ 50,00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">90 Dias (Trimestral)</span>
                    <span className="text-white font-bold font-mono">R$ 100,00</span>
                  </div>
                </div>

                {/* Features Check */}
                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>Alta taxa de atualização e resposta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>Suporte a BlueStacks e MSI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>Entrega instantânea da Key após o pagamento</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <a
                  href="https://discord.gg/sswR4rK4r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-btn-primary w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Comprar no Discord</span>
                </a>
              </div>
            </div>

            {/* Product 2: Valorant */}
            <div className={`glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${activeTab === 'val' ? 'ring-2 ring-sky-500/60 shadow-[0_0_35px_rgba(14,165,233,0.15)]' : 'opacity-85'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Alta Performance
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">Valorant</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
                  Software exclusivo com proteção de hardware HWID e loader de entrega imediata.
                </p>

                {/* Plan Pricing List */}
                <div className="mt-6 rounded-2xl bg-[#070c18]/90 border border-slate-800/80 p-4 divide-y divide-slate-800/60">
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">Semanal</span>
                    <span className="text-white font-bold font-mono">R$ 55,00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">Mensal</span>
                    <span className="text-sky-400 font-extrabold font-mono text-sm">R$ 120,00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-xs font-semibold">
                    <span className="text-slate-300">Build Única</span>
                    <span className="text-white font-bold font-mono">R$ 300,00</span>
                  </div>
                </div>

                {/* Features Check */}
                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Proteção HWID exclusiva por usuário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Loader executável enviado automaticamente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Ativação assistida e suporte individual</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <a
                  href="https://discord.gg/sswR4rK4r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-btn-primary w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Comprar no Discord</span>
                </a>
              </div>
            </div>

          </div>

        </section>

        {/* ===== WHY CHOOSE US (DIFERENCIAIS) ===== */}
        <section id="diferenciais" className="relative px-5 py-20 max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">Diferenciais</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Por que escolher a Smooth Store?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-5">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Liberação 100% Automática</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Sem espera por atendentes. Nosso bot processa pagamentos via Pix e Cartão e entrega a chave e arquivos instantaneamente no seu Discord.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Proteção de Nível Avançado</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Arquitetura desenvolvida para manter o software seguro e estável, com atualizações contínuas de compatibilidade.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Suporte & Comunidade</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Comunidade ativa com atendimento direto via tickets, tutoriais de utilização e suporte passo a passo para configuração.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ===== DISCORD COMMUNITY CTA ===== */}
        <section id="discord" className="relative px-5 py-16 sm:py-24 max-w-4xl mx-auto w-full">
          <div className="glass-panel rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-sky-500/30 shadow-[0_0_50px_rgba(14,165,233,0.15)]">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white mb-6 shadow-lg shadow-sky-500/30">
              <MessageCircle className="h-8 w-8" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Entre no Servidor Oficial da Smooth Store
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium mb-8">
              Acesse nosso canal de compras, confira os feedbacks dos clientes, participe de sorteios e tire suas dúvidas diretamente com nossa equipe.
            </p>

            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn-primary inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Acessar Comunidade no Discord</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-900 bg-[#04060e] py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-500/40">
              S
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">
              Smooth <span className="text-sky-400">Store</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            © 2026 Smooth Store. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Área do Administrador</Link>
            <a href="https://discord.gg/sswR4rK4r" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
          </div>

        </div>
      </footer>

    </div>
  )
}
