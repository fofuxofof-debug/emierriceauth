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
      className="bg-sky flex min-h-screen w-full items-center justify-center p-6 text-zinc-100"
    >
      <div className="w-full max-w-sm card-in">
        <div className="mb-8 flex flex-col items-center gap-3">
          <h1 className="logo-shimmer logo-glow text-5xl font-black tracking-tight text-white">
            MRC Bypass
          </h1>
        </div>

        <div
          className="rounded-2xl border border-zinc-800 bg-[#0e0e11] p-7 hover-lift shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-xs text-zinc-400 uppercase tracking-wider font-sans font-semibold">
                Usuário
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#151518] px-4 py-3 transition-all duration-300 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]">
                <User className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-xs text-zinc-400 uppercase tracking-wider font-sans font-semibold">
                Senha
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#151518] px-4 py-3 transition-all duration-300 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]">
                <KeyRound className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-300 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group button-shine relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.97] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50 transition-all cursor-pointer"
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
