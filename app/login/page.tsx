'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, ChevronRight, User, ArrowLeft, Shield } from 'lucide-react'
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
      if (!res.ok || !data.success) throw new Error(data.message || 'Credenciais inválidas.')

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#050811] text-[#f1f5f9] overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)] blur-[120px]"
      />
      <div className="grid-ambient-dots absolute inset-0 -z-20 opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-[#080d1a]/80 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:border-sky-500/30 transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para a Loja</span>
        </Link>
      </div>

      <div className="w-full max-w-sm z-10">
        
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 text-white font-extrabold text-xl shadow-[0_0_25px_rgba(14,165,233,0.4)]">
            S
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              Smooth <span className="text-sky-400">Store</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Painel de Controle & Gestão de Licenças
            </p>
          </div>
        </div>

        {/* Login Glass Card */}
        <div className="glass-panel rounded-3xl p-7 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Usuário
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#070c18]/90 px-4 py-3 transition-all duration-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
                <User className="h-4 w-4 text-sky-400 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Nome de usuário"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-[#f1f5f9] placeholder-slate-600 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Senha
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#070c18]/90 px-4 py-3 transition-all duration-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
                <KeyRound className="h-4 w-4 text-sky-400 shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Sua senha secreta"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-[#f1f5f9] placeholder-slate-600 focus:outline-none text-sm font-medium tracking-normal"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="neon-btn-primary mt-2 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-500 font-medium mt-6 flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-sky-500" />
          Acesso protegido com autenticação segura
        </p>

      </div>
    </div>
  )
}
