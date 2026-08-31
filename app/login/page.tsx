'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, ChevronRight, User } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erro ao entrar.')

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="bg-sky relative flex min-h-screen w-full items-center justify-center p-6 text-slate-900 overflow-hidden"
    >
      {/* Ambient Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_65%)] opacity-80 blur-[100px] animate-pulse-aura" />

      <div className="w-full max-w-sm card-in animate-scale-fade-in">
        <div className="mb-8 flex flex-col items-center gap-3">
          <h1 className="logo-shimmer logo-glow text-5xl font-black tracking-tight text-slate-950">
            MRC Bypass
          </h1>
        </div>

        <div
          className="rounded-2xl border border-slate-200 bg-white p-7 hover-lift shadow-[0_16px_50px_rgba(37,99,235,0.08)] backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-xs text-slate-600 uppercase tracking-wider font-sans font-semibold">
                Usuário
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <User className="h-4 w-4 text-blue-600 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-sans font-semibold tracking-normal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-xs text-slate-600 uppercase tracking-wider font-sans font-semibold">
                Senha
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <KeyRound className="h-4 w-4 text-blue-600 shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 focus:outline-none text-sm font-sans font-semibold tracking-normal"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 animate-in fade-in slide-in-from-top-1 duration-300 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group button-shine relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.97] hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>ACESSAR PAINEL</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
