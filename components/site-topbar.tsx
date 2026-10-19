'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X, ShieldCheck } from 'lucide-react'

const navLinks = [
  { href: '#features',  label: 'Tecnologia' },
  { href: '#architecture', label: 'Segurança' },
  { href: '#pricing',   label: 'Produtos' },
]

export function SiteTopbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none transition-all duration-300">
      <div
        className={`mx-auto max-w-5xl rounded-full border transition-all duration-500 pointer-events-auto backdrop-blur-2xl ${
          scrolled || mobileOpen
            ? 'border-[#15233c] bg-[#060911]/95 shadow-lg shadow-blue-500/10 py-2.5 px-4 sm:px-6'
            : 'border-[#15233c] bg-[#060911]/80 py-3 px-5 sm:px-7'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <span className="text-xs font-black tracking-tighter">M</span>
            </div>
            <span className="logo-shimmer font-black tracking-tight text-lg sm:text-xl text-[#f1f5f9]">
              MRC <span className="font-medium text-blue-500">Bypass</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-blue-400 hover:bg-blue-950/40 rounded-full transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-[10px] font-mono text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              STATUS: V4.2 ACTIVE
            </div>

            <Link
              href="/login"
              className="button-shine group inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-md shadow-blue-500/25"
            >
              <span>Painel</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center rounded-full border border-blue-500/30 w-8 h-8 text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-950/40 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-64 opacity-100 pt-3 mt-3 border-t border-[#15233c]' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 pb-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-xs uppercase tracking-wider font-semibold text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
