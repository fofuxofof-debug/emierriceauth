'use client'

import { useEffect, useState } from 'react'
import {
  Power,
  ShieldAlert,
  Flame,
  Crosshair,
  Target,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function SystemStatusPage() {
  const [authEnabled, setAuthEnabled] = useState(true)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [ffEnabled, setFfEnabled] = useState(true)
  const [valEnabled, setValEnabled] = useState(true)
  const [cs2Enabled, setCs2Enabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch('/api/system/status')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setAuthEnabled(res.data.auth_enabled ?? true)
          setMaintenanceMessage(res.data.maintenance_message ?? '')
          setFfEnabled(res.data.freefire_enabled ?? true)
          setValEnabled(res.data.valorant_enabled ?? true)
          setCs2Enabled(res.data.cs2_enabled ?? true)
        }
      })
      .catch(() => {
        toast.error('Erro ao consultar status do sistema')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async (override?: Record<string, any>) => {
    setIsSaving(true)
    try {
      const payload = {
        auth_enabled: authEnabled,
        maintenance_message: maintenanceMessage,
        freefire_enabled: ffEnabled,
        valorant_enabled: valEnabled,
        cs2_enabled: cs2Enabled,
        ...override,
      }

      const res = await fetch('/api/system/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao salvar configurações')
      }

      toast.success('Configurações atualizadas com sucesso!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
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
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${authEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${authEnabled ? 'text-emerald-600' : 'text-rose-600'}`}>
            {authEnabled ? 'SISTEMA ONLINE & AUTENTICANDO' : 'SISTEMA PAUSADO / KILLSWITCH ATIVO'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          Controle do Site & Auth
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Interruptor mestre para pausar autenticações de loaders, ativar modo de manutenção e gerenciar serviços
        </p>
      </div>

      {/* MASTER KILLSWITCH CARD */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
          authEnabled
            ? 'border-slate-200 bg-white shadow-sm'
            : 'border-rose-200 bg-rose-50 shadow-lg'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                authEnabled
                  ? 'border-orange-200 bg-orange-50 text-[#ea580c]'
                  : 'border-rose-300 bg-rose-100 text-rose-600 animate-pulse'
              }`}
            >
              <Power className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Autenticação dos Loaders (Auth API)
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    authEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-300'
                  }`}
                >
                  {authEnabled ? 'Ativa' : 'Pausada'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
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
                ? 'border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                : 'btn-primary'
            }`}
          >
            <Power className="mr-2 h-4 w-4" />
            {authEnabled ? 'Pausar Auth Agora' : 'Reativar Auth'}
          </button>
        </div>
      </div>

      {/* MAINTENANCE MESSAGE INPUT */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1.5 font-mono">
          Mensagem de Manutenção / Pausa
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Esta mensagem será exibida diretamente no console do Loader quando a autenticação estiver pausada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Ex: Sistema em atualização de segurança. Retorno em breve."
            className="flex-1 border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 font-mono text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] h-10 shadow-2xs"
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1.5 font-mono">
          Status Individual por Produto
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-6">
          Pause ou libere a inicialização de jogos específicos individualmente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* FreeFire */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">FreeFire</p>
                <p className="text-[10px] text-slate-400">BlueStacks / Emuladores</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className={`text-[11px] font-mono font-bold ${ffEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {ffEnabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !ffEnabled
                  setFfEnabled(next)
                  handleSave({ freefire_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                {ffEnabled ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>

          {/* Valorant */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Valorant</p>
                <p className="text-[10px] text-slate-400">Vanguard Ring-3</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className={`text-[11px] font-mono font-bold ${valEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {valEnabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !valEnabled
                  setValEnabled(next)
                  handleSave({ valorant_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                {valEnabled ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>

          {/* CS2 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-[#ea580c]">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Counter-Strike 2</p>
                <p className="text-[10px] text-slate-400">VAC Ring-3</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className={`text-[11px] font-mono font-bold ${cs2Enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {cs2Enabled ? '● Ativo' : '○ Pausado'}
              </span>
              <button
                onClick={() => {
                  const next = !cs2Enabled
                  setCs2Enabled(next)
                  handleSave({ cs2_enabled: next })
                }}
                className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
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
