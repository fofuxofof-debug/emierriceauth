'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Key, Activity, LogOut, Menu, X,
  MessageCircle, Package, Download, Moon, Sun, Power, UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/keys', label: 'Keys', icon: Key },
  { href: '/dashboard/logs', label: 'Logs', icon: Activity },
  { href: '/dashboard/discord', label: 'Discord', icon: MessageCircle },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/loaders', label: 'Loaders', icon: Download },
  { href: '/dashboard/updater', label: 'Atualizações', icon: UploadCloud },
  { href: '/dashboard/system', label: 'Parar / Status', icon: Power },
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
    <div className="bg-sky flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-64 flex-col border-r md:flex"
        style={{
          backgroundColor: 'var(--sidebar)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <Link href="/dashboard" className="block">
          <div
            className="flex h-16 items-center justify-center border-b px-6 group cursor-pointer"
            style={{ borderColor: 'var(--sidebar-border)' }}
          >
            <span className={`${dark ? 'logo-shimmer' : 'logo-shimmer-dark'} ${dark ? 'logo-glow' : 'logo-glow-dark'} text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-[1.04]`}>
              MRC Bypass
            </span>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1.5 p-4">
          {navItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`nav-link group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-sans font-semibold card-in transition-all duration-200 ease-out ${
                  isActive
                    ? 'is-active bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.15)] scale-[1.02]'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white hover:translate-x-1'
                }`}
              >
                <item.icon
                  className={`h-4 w-4 transition-transform duration-300 ease-out ${
                    isActive ? 'text-black' : 'text-zinc-400 group-hover:scale-110 group-hover:text-white'
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div
          className="border-t border-zinc-800 p-4 bg-[#0a0a0c]"
        >
          <div className="mb-3 flex items-center gap-3 px-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-xs font-sans font-bold text-white border border-zinc-700"
            >
              {user.email?.[0]?.toUpperCase() ?? 'M'}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-sans font-semibold text-white">{user.email}</p>
              <p className="text-[10px] font-sans font-semibold text-zinc-500">Administrador</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="button-shine w-full justify-start gap-2 border border-zinc-800 bg-[#121215] text-zinc-300 hover:text-white hover:bg-zinc-800 font-sans font-semibold text-xs active:scale-[0.97] rounded-xl"
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
          className="flex h-16 items-center justify-between border-b px-4 md:hidden"
          style={{
            backgroundColor: 'var(--sidebar)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <Link href="/dashboard">
            <span className={`${dark ? 'logo-shimmer' : 'logo-shimmer-dark'} ${dark ? 'logo-glow' : 'logo-glow-dark'} text-xl font-black tracking-tight`}>
              MRC Bypass
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div
            className="border-b p-4 md:hidden card-in"
            style={{
              backgroundColor: 'var(--sidebar)',
              borderColor: 'var(--sidebar-border)',
            }}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div
              className="mt-3 border-t pt-3"
              style={{ borderColor: 'var(--sidebar-border)' }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="button-shine w-full justify-start gap-2 border"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--muted-foreground)',
                  borderColor: 'var(--border)',
                }}
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
