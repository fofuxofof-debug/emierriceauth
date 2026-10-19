'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, MessageCircle, Sparkles, ExternalLink } from 'lucide-react'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const discordSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (discordSectionRef.current) {
      observer.observe(discordSectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#060911] text-[#f1f5f9] selection:bg-blue-500/30 selection:text-blue-200 font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      
      {/* Floating Pill Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 animate-fade-in-down">
        <nav className="relative flex w-full max-w-5xl items-center justify-between rounded-full border border-[#15233c] bg-[#070c18]/85 py-2.5 pl-4 pr-3 shadow-[0_0_25px_rgba(37,99,235,0.15)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] hover:border-blue-500/50">
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <img
              src="/imagem%20banner/logobanner.png"
              alt="MRC Bypass"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fallback = document.getElementById('nav-logo-fallback')
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div id="nav-logo-fallback" style={{ display: 'none' }} className="items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500 bg-blue-600 text-white font-semibold text-xs shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                M
              </div>
              <span className="font-sans text-[17px] font-semibold tracking-tight text-[#f1f5f9]">
                MRC <span className="text-blue-500 font-bold">Bypass</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/sswR4rK4r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-300 bg-blue-500/10 hover:text-blue-200 hover:bg-blue-500/20 border border-blue-500/30 transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
              <span>Discord</span>
            </a>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-500 transition-all duration-200 shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95"
            >
              <span>Painel</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Floating Discord CTA */}
      <a
        href="https://discord.gg/sswR4rK4r"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat da comunidade"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/40 bg-[#0b1222] text-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.25)] backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-blue-950/40 hover:border-blue-400 animate-pulse-glow"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
        </span>
      </a>

      <main className="relative flex-1 flex flex-col justify-center">
        {/* ===== HERO SECTION ===== */}
        <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24">
          {/* Ambient Glow */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[650px] w-[1000px] max-w-[100vw] rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_65%)] opacity-90 blur-[130px] animate-pulse-aura" />
          <div className="bg-dots absolute inset-0 -z-20 opacity-30" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 -z-20 h-[50vh] bg-gradient-to-b from-blue-500/[0.08] to-transparent" aria-hidden="true" />

          {/* Floating Animated Tilted Banner in Top-Right Corner */}
          <div className="pointer-events-none absolute top-12 -right-8 sm:top-16 sm:right-6 md:top-20 md:right-14 lg:right-20 z-0 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
              <img
                src="/imagem%20banner/logobanner.png"
                alt="MRC Bypass Floating"
                className="animate-float-tilt w-48 sm:w-60 md:w-72 lg:w-80 h-auto object-contain opacity-40 drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)] select-none"
              />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            
            {/* Banner Logo Image */}
            <div className="relative mb-6 flex items-center justify-center animate-scale-fade-in">
              <img
                src="/imagem%20banner/logobanner.png"
                alt="MRC Bypass Logo"
                className="max-h-32 sm:max-h-44 md:max-h-56 w-auto object-contain drop-shadow-lg select-none transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallbackEl = document.getElementById('logo-fallback-text')
                  if (fallbackEl) fallbackEl.style.display = 'block'
                }}
              />
              <h1
                id="logo-fallback-text"
                style={{ display: 'none' }}
                className="mx-auto max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-8xl text-[#f1f5f9]"
              >
                MRC Bypass
              </h1>
            </div>

            {/* Subtitle */}
            <p className="mx-auto mt-2 max-w-3xl text-pretty text-base font-medium leading-relaxed text-slate-300 sm:text-lg animate-fade-in-up">
              Infraestrutura avançada de segurança e bypass, com ativação assistida em tempo real e suporte de alta performance.
            </p>

          </div>
        </section>

        {/* ===== SCROLL-ANIMATED DISCORD PRODUCTS SECTION ===== */}
        <section
          ref={discordSectionRef}
          className="relative mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-5 py-24 sm:py-36"
        >
          <div
            className={`w-full transform transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-16 scale-95 pointer-events-none'
            }`}
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#15233c] bg-[#0b1222]/90 p-8 sm:p-12 shadow-[0_0_50px_rgba(37,99,235,0.18)] backdrop-blur-xl text-center flex flex-col items-center">
              
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f1f5f9] font-sans">
                Confira nossos produtos no Discord
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-xl text-sm sm:text-base font-medium leading-relaxed text-slate-300">
                Para consultar os planos disponíveis, suporte assistido individual e adquirir sua key, clique no botão <span className="font-semibold text-blue-400">Discord</span> na barra superior ou acesse diretamente pelo link oficial abaixo:
              </p>

              {/* Action Button */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <a
                  href="https://discord.gg/sswR4rK4r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Acessar Servidor no Discord</span>
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-[#131d35] bg-[#050811] py-6">
        <div className="mx-auto w-full max-w-6xl px-5 flex items-center justify-center text-center">
          <p className="text-xs text-slate-400 font-sans font-semibold tracking-normal">
            © 2026 MRC Bypass. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}
