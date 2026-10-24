'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Power, Flame, Crosshair, Target, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { SystemStatus } from '@/lib/system-state'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SystemControlPage() {
  const { data: resp, mutate } = useSWR<{ success: boolean; data: SystemStatus }>(
    '/api/system/status',
    fetcher
  )
  const status = resp?.data

  const [authEnabled, setAuthEnabled] = useState(true)
  const [siteEnabled, setSiteEnabled] = useState(true)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [ffEnabled, setFfEnabled] = useState(true)
  const [valEnabled, setValEnabled] = useState(true)
  const [cs2Enabled, setCs2Enabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status) {
      setAuthEnabled(status.auth_enabled)
      setSiteEnabled(status.site_enabled)
      setMaintenanceMessage(status.maintenance_message || '')
      setFfEnabled(status.freefire_enabled)
      setValEnabled(status.valorant_enabled)
      setCs2Enabled(status.cs2_enabled)
    }
  }, [status])

  const handleSave = async (overrides?: Partial<SystemStatus>) => {
    setIsSaving(true)
    try {
      const payload: Partial<SystemStatus> = {
        auth_enabled: overrides?.auth_enabled !== undefined ? overrides.auth_enabled : authEnabled,
        site_enabled: overrides?.site_enabled !== undefined ? overrides.site_enabled : siteEnabled,
        maintenance_message: overrides?.maintenance_message !== undefined ? overrides.maintenance_message : maintenanceMessage,
        freefire_enabled: overrides?.freefire_enabled !== undefined ? overrides.freefire_enabled : ffEnabled,
        valorant_enabled: overrides?.valorant_enabled !== undefined ? overrides.valorant_enabled : valEnabled,
        cs2_enabled: overrides?.cs2_enabled !== undefined ? overrides.cs2_enabled : cs2Enabled,
      }

      const res = await fetch('/api/system/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Falha ao salvar')
      const data = await res.json()
      mutate({ success: true, data: data.data }, false)
      toast.success('Status do sistema atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar configurações do sistema')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAuth = () => {
    const next = !authEnabled
    setAuthEnabled(next)
    handleSave({ auth_enabled: next })
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto page-in">
      {/* Header */}
      <div className="border-b border-[rgb(20,20,20)] pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${authEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${authEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
            {authEnabled ? 'SISTEMA ONLINE & AUTENTICANDO' : 'SISTEMA PAUSADO / KILLSWITCH ATIVO'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Controle do Site & Auth
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
          Interruptor mestre para pausar autenticações de loaders, ativar modo de manutenção e gerenciar serviços
        </p>
      </div>

      {/* MASTER KILLSWITCH CARD */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 backdrop-blur-xl ${
          authEnabled
            ? 'border-[rgb(20,20,20)] bg-[#0a0a0d] shadow-lg'
            : 'border-rose-500/40 bg-rose-950/20 shadow-2xl shadow-rose-950/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                authEnabled
                  ? 'border-[#ff2d8d]/30 bg-[#ff2d8d]/10 text-[#ff2d8d]'
                  : 'border-rose-500/40 bg-rose-500/20 text-rose-400 animate-pulse'
              }`}
            >
              <Power className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Autenticação dos Loaders (Auth API)
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    authEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {authEnabled ? 'Ativa' : 'Pausada'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                {authEnabled
                  ? 'Todos os loaders estão validando keys normalmente em tempo real.'
                  : 'Nenhum loader conseguirá logar. Todas as requisições retornarão a mensagem de pausa.'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleAuth}
            disabled={isSaving}
            className={`font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center ${
              authEnabled
                ? 'border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                : 'btn-primary'
            }`}
          >
            <Power className="mr-2 h-4 w-4" />
            {authEnabled ? 'Pausar Auth Agora' : 'Reativar Auth'}
          </button>
        </div>
      </div>

      {/* MAINTENANCE MESSAGE INPUT */}
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] backdrop-blur-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1.5 font-mono">
          Mensagem de Manutenção / Pausa
        </h3>
        <p className="text-xs text-zinc-400 font-medium mb-4">
          Esta mensagem será exibida diretamente no console do Loader quando a autenticação estiver pausada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Ex: Sistema em atualização de segurança. Retorno em breve."
            className="flex-1 border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 font-mono text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] h-10"
          />
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="btn-primary shrink-0 rounded-xl px-5 text-xs uppercase tracking-wider font-bold"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Salvar Mensagem
          </button>
        </div>
      </div>

      {/* GAME STATUS GRID */}
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] backdrop-blur-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1.5 font-mono">
          Status Individual por Produto
        </h3>
        <p className="text-xs text-zinc-400 font-medium mb-6">
          Pause ou libere a inicialização de jogos específicos individualmente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* FreeFire */}
          <div className="rounded-xl border border-[rgb(20,20,20)] bg-black/40 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">FreeFire</p>
                <p className="text-[10px] text-zinc-400">BlueStacks / Emuladores</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[rgb(20,20,20)] pt-3">
              <span className={`text-[11px] font-mono font-bold ${ffEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {ffEnabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !ffEnabled
                  setFfEnabled(next)
                  handleSave({ freefire_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-[rgb(20,20,20)] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                {ffEnabled ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>

          {/* Valorant */}
          <div className="rounded-xl border border-[rgb(20,20,20)] bg-black/40 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Valorant</p>
                <p className="text-[10px] text-zinc-400">Vanguard Ring-3</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[rgb(20,20,20)] pt-3">
              <span className={`text-[11px] font-mono font-bold ${valEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {valEnabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !valEnabled
                  setValEnabled(next)
                  handleSave({ valorant_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-[rgb(20,20,20)] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                {valEnabled ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>

          {/* CS2 */}
          <div className="rounded-xl border border-[rgb(20,20,20)] bg-black/40 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ff2d8d]/25 bg-[#ff2d8d]/10 text-[#ff2d8d]">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Counter-Strike 2</p>
                <p className="text-[10px] text-zinc-400">VAC Ring-3</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[rgb(20,20,20)] pt-3">
              <span className={`text-[11px] font-mono font-bold ${cs2Enabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {cs2Enabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !cs2Enabled
                  setCs2Enabled(next)
                  handleSave({ cs2_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-[rgb(20,20,20)] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                {cs2Enabled ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
