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
    <div className="flex min-h-screen relative text-[#fafafa] bg-[#09090b]">
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-64 flex-col border-r md:flex bg-[#0c0c0e] border-zinc-800/80 text-[#fafafa]"
      >
        <Link href="/dashboard" className="block">
          <div
            className="flex h-16 items-center gap-3 border-b px-6 group cursor-pointer border-zinc-800/80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-black text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="text-lg font-black tracking-tight text-white transition-transform duration-300 group-hover:scale-[1.02] uppercase">
              Smooth <span className="text-zinc-400 font-bold">Store</span>
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
                className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-sans select-none card-in transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 overflow-hidden ${
                  isActive
                    ? 'is-active bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:bg-zinc-200'
                    : 'text-zinc-400 font-medium bg-[#121215] hover:bg-zinc-800 hover:text-white hover:translate-x-1'
                }`}
              >
                {/* Left glowing accent indicator on hover & active */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
                    isActive
                      ? 'h-4 bg-black opacity-100'
                      : 'h-0 bg-white group-hover:h-3.5 group-hover:opacity-100 opacity-0'
                  }`}
                />

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 ${
                    isActive
                      ? 'bg-black/10 text-black scale-100'
                      : 'bg-[#18181b] text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white group-hover:scale-110'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </div>
                <span className={`text-xs tracking-wide transition-colors duration-200 ${isActive ? 'font-bold text-black' : 'text-zinc-400 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div
          className="border-t border-zinc-800/80 p-4 bg-[#09090b]"
        >
          <div className="mb-3 flex items-center gap-3 px-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-sans font-bold text-white shadow-xs"
            >
              {user.email?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-sans font-semibold text-white">{user.email}</p>
              <p className="text-[10px] font-sans font-semibold text-zinc-400 font-mono">ADMINISTRADOR</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 border border-zinc-800 bg-[#121215] text-zinc-400 hover:text-white hover:bg-zinc-800 font-sans font-semibold text-xs active:scale-[0.97] rounded-xl shadow-xs"
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
          className="flex h-16 items-center justify-between border-b px-4 md:hidden bg-[#0c0c0e] border-zinc-800/80"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-extrabold text-xs shadow-xs">
              S
            </div>
            <span className="text-lg font-black tracking-tight text-white uppercase">
              Smooth <span className="text-zinc-400 font-bold">Store</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-zinc-300 hover:text-white">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div
            className="border-b p-3 md:hidden card-in bg-[#0c0c0e]/95 backdrop-blur-md border-zinc-800"
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
                    className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-sans select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 overflow-hidden ${
                      isActive
                        ? 'is-active bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                        : 'text-zinc-400 font-medium bg-[#121215] hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
                        isActive
                          ? 'h-4 bg-black opacity-100'
                          : 'h-0 bg-white group-hover:h-3.5 group-hover:opacity-100 opacity-0'
                      }`}
                    />
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 ${
                        isActive
                          ? 'bg-black/10 text-black'
                          : 'bg-[#18181b] text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white'
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-xs tracking-wide transition-colors duration-200 ${isActive ? 'font-bold text-black' : 'text-zinc-400 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
            <div
              className="mt-3 border-t pt-3 border-zinc-800"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 border border-zinc-800 bg-[#121215] text-zinc-400 hover:text-white hover:bg-zinc-800 font-sans font-semibold text-xs rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                LOGOUT
              </Button>
            </div>
          </div>
        )}

        <main key={pathname} className="route-fade-in flex-1 overflow-auto p-4 md:p-8 bg-[#09090b]">
          {children}
        </main>
      </div>

      {/* ===== Toggle de tema ===== */}
      {mounted && (
        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="theme-toggle group fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-[#121215] text-white shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 hover:border-zinc-700"
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
        </button>
      )}
    </div>
  )
}
