'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Layers, KeyRound, Cpu, Terminal, MessagesSquare, SlidersHorizontal,
  LogOut, Menu, X, Moon, Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Layers },
  { href: '/dashboard/keys', label: 'Keys', icon: KeyRound },
  { href: '/dashboard/bot-keys', label: 'Keys Bot', icon: Cpu },
  { href: '/dashboard/logs', label: 'Logs', icon: Terminal },
  { href: '/dashboard/discord', label: 'Discord', icon: MessagesSquare },
  { href: '/dashboard/system', label: 'Parar / Status', icon: SlidersHorizontal },
]

interface ShellUser {
  id: string
  email: string
}

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  // load theme from storage (default dark)
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('panel_theme')
      const isDark = saved !== 'light'
      setDark(isDark)
      if (isDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // apply theme + smooth transition while switching
  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.add('theme-transitioning')
    const next = !dark
    setDark(next)
    if (next) html.classList.add('dark')
    else html.classList.remove('dark')
    try {
      localStorage.setItem('panel_theme', next ? 'dark' : 'light')
    } catch {}
    window.setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 700)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-sky flex min-h-screen relative text-[#f1f5f9]">
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-64 flex-col border-r md:flex bg-[#070c18] border-[#131d35] text-[#f1f5f9]"
      >
        <Link href="/dashboard" className="block">
          <div
            className="flex h-16 items-center justify-center border-b px-6 group cursor-pointer border-[#131d35]"
          >
            <span className="logo-shimmer logo-glow text-2xl font-black tracking-tight text-[#f1f5f9] transition-transform duration-300 group-hover:scale-[1.04]">
              MRC <span className="text-blue-500 font-bold">Bypass</span>
            </span>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1.5 p-3">
          {navItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${idx * 25}ms` }}
                className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-xs font-sans select-none card-in transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 overflow-hidden ${
                  isActive
                    ? 'is-active bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold shadow-[0_0_22px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_rgba(37,99,235,0.65)] hover:brightness-105'
                    : 'text-slate-400 font-medium bg-[#0a0f1c]/80 hover:bg-[#111c38] hover:text-white hover:translate-x-1.5 hover:shadow-[0_0_18px_rgba(37,99,235,0.25)]'
                }`}
              >
                {/* Left glowing accent indicator on hover & active */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
                    isActive
                      ? 'h-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-100'
                      : 'h-0 bg-blue-400 group-hover:h-3.5 group-hover:opacity-100 opacity-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                  }`}
                />

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner backdrop-blur-xs scale-100'
                      : 'bg-[#0d1322] text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.7)]'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-6deg] group-hover:scale-110" />
                </div>
                <span className={`text-xs tracking-wide transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div
          className="border-t border-[#131d35] p-4 bg-[#050913]"
        >
          <div className="mb-3 flex items-center gap-3 px-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-sans font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]"
            >
              {user.email?.[0]?.toUpperCase() ?? 'M'}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-sans font-semibold text-[#f1f5f9]">{user.email}</p>
              <p className="text-[10px] font-sans font-semibold text-blue-400">Administrador</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="button-shine w-full justify-start gap-2 border-0 bg-[#0b1222] text-slate-300 hover:text-red-400 hover:bg-red-950/30 font-sans font-semibold text-xs active:scale-[0.97] rounded-xl shadow-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Mobile */}
      <div className="flex flex-1 flex-col">
        <header
          className="flex h-16 items-center justify-between border-b px-4 md:hidden bg-[#070c18] border-[#131d35]"
        >
          <Link href="/dashboard">
            <span className="logo-shimmer logo-glow text-xl font-black tracking-tight text-[#f1f5f9]">
              MRC <span className="text-blue-500 font-bold">Bypass</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-300 hover:text-blue-400">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div
            className="border-b p-3 md:hidden card-in bg-[#070c18]/95 backdrop-blur-md border-[#131d35]"
          >
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-xs font-sans select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 overflow-hidden ${
                      isActive
                        ? 'is-active bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold shadow-[0_0_22px_rgba(37,99,235,0.5)]'
                        : 'text-slate-400 font-medium bg-[#0a0f1c]/80 hover:bg-[#111c38] hover:text-white'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
                        isActive
                          ? 'h-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-100'
                          : 'h-0 bg-blue-400 group-hover:h-3.5 group-hover:opacity-100 opacity-0'
                      }`}
                    />
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-inner backdrop-blur-xs'
                          : 'bg-[#0d1322] text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110'
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-xs tracking-wide transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
            <div
              className="mt-3 border-t pt-3 border-[#131d35]"
            >
              <Button
                variant="ghost"
                size="sm"
                className="button-shine w-full justify-start gap-2 border-0 bg-[#0b1222] text-slate-300 hover:text-red-400 hover:bg-red-950/30 font-sans font-semibold text-xs rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                LOGOUT
              </Button>
            </div>
          </div>
        )}

        <main key={pathname} className="route-fade-in flex-1 overflow-auto p-4 md:p-8 bg-sky">
          {children}
        </main>
      </div>

      {/* ===== Toggle de tema (canto inferior esquerdo) ===== */}
      {mounted && (
        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="theme-toggle group fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 hover:shadow-xl"
          style={{
            backgroundColor: '#121215',
            borderColor: '#27272a',
            color: '#ffffff',
          }}
        >
          <span className="relative inline-flex h-5 w-5 items-center justify-center overflow-hidden">
            <Sun
              className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
            <Moon
              className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
          </span>
          {/* Halo subtle */}
          <span
            className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500 ${
              dark ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ boxShadow: '0 0 24px rgba(255,255,255,0.25)' }}
          />
        </button>
      )}
    </div>
  )
}
