'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Layers, KeyRound, Cpu, Terminal, MessagesSquare, SlidersHorizontal,
  LogOut, Menu, X, Moon, Sun, Shield, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Layers },
  { href: '/dashboard/keys', label: 'Keys & Licenças', icon: KeyRound },
  { href: '/dashboard/bot-keys', label: 'Keys Bot', icon: Cpu },
  { href: '/dashboard/logs', label: 'Logs & Auditoria', icon: Terminal },
  { href: '/dashboard/discord', label: 'Discord Bot', icon: MessagesSquare },
  { href: '/dashboard/system', label: 'Parar / Status', icon: SlidersHorizontal },
]

export interface ShellUser {
  id: string
  email: string
  role?: 'admin' | 'moderator'
  allowedPaths?: string[]
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

  // Filtra as abas permitidas para o usuário logado
  const allowedPaths = user.allowedPaths || ['*']
  const hasFullAccess = allowedPaths.includes('*')

  const navItems = allNavItems.filter((item) => {
    if (hasFullAccess) return true
    return allowedPaths.some(
      (path) => item.href === path || item.href.startsWith(`${path}/`)
    )
  })

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
    router.push('/login')
    router.refresh()
  }

  const isModerator = user.role === 'moderator'

  return (
    <div className="flex min-h-screen relative text-zinc-100 bg-[#000000] antialiased">
      {/* Pink Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/4 top-0 -z-10 h-[500px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,45,141,0.08),transparent_70%)] blur-[130px]"
      />

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r md:flex bg-[#050508]/95 backdrop-blur-xl border-[rgb(20,20,20)] text-zinc-200">
        <Link href={navItems[0]?.href || '/dashboard'} className="block">
          <div className="flex h-16 items-center gap-3 border-b px-6 group cursor-pointer border-[rgb(20,20,20)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ff2d8d] to-[#ff5ca0] text-white font-black text-sm shadow-[0_0_20px_rgba(255,45,141,0.45)] group-hover:scale-105 transition-transform duration-300">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Hooked <span className="text-[#ff2d8d]">Store</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Auth System v2
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation list */}
        <div className="px-3 pt-4 pb-2">
          <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">
            {isModerator ? 'Menu Operador' : 'Administração'}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium select-none transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff2d8d] to-[#ff5ca0] text-white font-bold shadow-[0_4px_18px_rgba(255,45,141,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full h-4 bg-white shadow-sm" />
                )}

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="border-t border-[rgb(20,20,20)] p-4 bg-black/40">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff2d8d]/10 border border-[#ff2d8d]/30 text-xs font-bold text-[#ff2d8d] shadow-sm">
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user.email}</p>
              {isModerator ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#ff5ca0]">
                  <Shield className="h-2.5 w-2.5" /> MODERADOR
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#ff2d8d]">
                  <Sparkles className="h-2.5 w-2.5" /> ADMINISTRADOR
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 border border-[rgb(20,20,20)] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-[#ff2d8d]/30 font-medium text-xs rounded-xl transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:hidden bg-[#050508]/95 backdrop-blur-xl border-[rgb(20,20,20)]">
          <Link href={navItems[0]?.href || '/dashboard'} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ff2d8d] to-[#ff5ca0] text-white font-extrabold text-xs shadow-md">
              H
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Hooked <span className="text-[#ff2d8d]">Store</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-xl"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div className="border-b p-3 md:hidden bg-[#050508]/98 backdrop-blur-2xl border-[rgb(20,20,20)] animate-in fade-in slide-in-from-top-2">
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
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff2d8d] to-[#ff5ca0] text-white font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="mt-3 border-t border-[rgb(20,20,20)] pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-zinc-400 hover:text-white rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main key={pathname} className="route-fade-in flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-[#000000]">
          {children}
        </main>
      </div>

      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="group fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 text-zinc-300 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:text-white hover:border-[#ff2d8d]/50"
        >
          <span className="relative inline-flex h-5 w-5 items-center justify-center overflow-hidden">
            <Sun
              className={`absolute h-5 w-5 transition-all duration-300 ${
                dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
            <Moon
              className={`absolute h-5 w-5 transition-all duration-300 ${
                dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
          </span>
        </button>
      )}
    </div>
  )
}
