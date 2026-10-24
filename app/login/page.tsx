'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, User, ShieldCheck, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'

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
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Credenciais inválidas.')
      }

      const target = data.redirectTo || '/dashboard'
      router.push(target)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#000000] text-zinc-100 overflow-hidden font-sans">
      
      {/* Pink Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 -z-10 h-[550px] w-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,45,141,0.18),transparent_70%)] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-10 -z-10 h-[350px] w-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,92,160,0.12),transparent_70%)] blur-[110px]"
      />

      <div className="w-full max-w-sm z-10">
        
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff2d8d] to-[#ff5ca0] text-white font-black text-2xl shadow-[0_0_30px_rgba(255,45,141,0.5)]">
            S
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
              Smooth <span className="text-[#ff2d8d]">Store</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Painel de Controle & Gestão de Licenças
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          <div className="mb-5 pb-4 border-b border-[rgb(20,20,20)] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="h-4 w-4 text-[#ff2d8d]" />
              Acesso Restrito
            </span>
            <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs text-zinc-400 uppercase tracking-wider font-semibold font-mono">
                Usuário
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-[rgb(20,20,20)] bg-black/60 px-3.5 py-2.5 transition-all duration-200 focus-within:border-[#ff2d8d] focus-within:ring-2 focus-within:ring-[#ff2d8d]/20">
                <User className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Seu usuário"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs text-zinc-400 uppercase tracking-wider font-semibold font-mono">
                Senha
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-[rgb(20,20,20)] bg-black/60 px-3.5 py-2.5 transition-all duration-200 focus-within:border-[#ff2d8d] focus-within:ring-2 focus-within:ring-[#ff2d8d]/20">
                <Lock className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2d8d] to-[#ff5ca0] hover:brightness-110 text-white font-bold text-sm shadow-[0_4px_22px_rgba(255,45,141,0.45)] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validando credenciais...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[rgb(20,20,20)] text-center">
            <p className="text-[11px] text-zinc-500 font-mono">
              Sessão segura • Criptografia ativa
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
