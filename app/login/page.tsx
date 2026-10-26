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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      
      {/* Orange Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 -z-10 h-[550px] w-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14),transparent_70%)] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-10 -z-10 h-[350px] w-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.12),transparent_70%)] blur-[100px]"
      />

      <div className="w-full max-w-sm z-10">
        
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f97316] to-[#ea580c] text-white font-black text-2xl shadow-[0_10px_25px_rgba(249,115,22,0.35)]">
            H
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-1.5">
              Hooked <span className="text-[#ea580c]">Store</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Painel de Controle & Gestão de Licenças
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-7 shadow-xl backdrop-blur-xl relative overflow-hidden">
          
          <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="h-4 w-4 text-[#ea580c]" />
              Acesso Restrito
            </span>
            <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs text-slate-600 uppercase tracking-wider font-semibold font-mono">
                Usuário
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition-all duration-200 focus-within:border-[#f97316] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f97316]/20">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Seu usuário"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs text-slate-600 uppercase tracking-wider font-semibold font-mono">
                Senha
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition-all duration-200 focus-within:border-[#f97316] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f97316]/20">
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:brightness-105 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.35)] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
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

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              Sessão segura • Criptografia ativa
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
