'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Power, ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, Save, Flame, Crosshair, Target, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { SystemStatus } from '@/lib/system-state'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SystemControlPage() {
  const { data: resp, mutate, isLoading } = useSWR<{ success: boolean; data: SystemStatus }>(
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

  const toggleSite = () => {
    const next = !siteEnabled
    setSiteEnabled(next)
    handleSave({ site_enabled: next })
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto page-in">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 card-in">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${authEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-blue-600">
            {authEnabled ? 'SISTEMA ONLINE & AUTENTICANDO' : 'SISTEMA PAUSADO / KILLSWITCH ATIVO'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
          Controle do Site & Auth
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans font-medium mt-0.5">
          Interruptor mestre para pausar autenticações de loaders, ativar modo de manutenção e gerenciar serviços.
        </p>
      </div>

      {/* MASTER KILLSWITCH CARD */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 card-in transition-all duration-300 ${
          authEnabled
            ? 'border-slate-200 bg-white shadow-sm'
            : 'border-red-200 bg-red-50/40 shadow-md'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                authEnabled
                  ? 'border-blue-100 bg-blue-50 text-blue-600'
                  : 'border-red-200 bg-red-100 text-red-600 animate-pulse'
              }`}
            >
              <Power className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-sans font-bold text-slate-950">
                  Autenticação dos Loaders (Auth API)
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider border ${
                    authEnabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-600 border-red-200'
                  }`}
                >
                  {authEnabled ? 'Ativa' : 'Pausada'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans font-medium mt-1">
                {authEnabled
                  ? 'Todos os loaders estão validando keys normalmente.'
                  : 'Nenhum loader conseguirá logar. Todas as requisições retornarão a mensagem de pausa.'}
              </p>
            </div>
          </div>

          <Button
            onClick={toggleAuth}
            disabled={isSaving}
            className={`font-sans font-semibold text-xs uppercase tracking-wider px-6 py-5 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-md ${
              authEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            <Power className="mr-2 h-4 w-4" />
            {authEnabled ? 'Pausar Auth Agora' : 'Reativar Auth'}
          </Button>
        </div>
      </div>

      {/* MAINTENANCE MESSAGE INPUT */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 card-in shadow-sm">
        <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-950 mb-2">
          Mensagem de Manutenção / Pausa
        </h3>
        <p className="text-xs text-slate-500 font-sans font-medium mb-4">
          Esta mensagem será exibida diretamente no console do Loader quando a autenticação estiver pausada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Ex: Sistema em atualização de segurança. Retorno em breve."
            className="flex-1 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 font-sans text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
          />
          <Button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="button-shine bg-blue-600 text-white hover:bg-blue-700 font-sans font-semibold text-xs uppercase tracking-wider rounded-xl shrink-0 shadow-md shadow-blue-500/20"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Salvar Mensagem
          </Button>
        </div>
      </div>

      {/* GAME STATUS GRID */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 card-in shadow-sm">
        <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-950 mb-2">
          Status Individual por Produto
        </h3>
        <p className="text-xs text-slate-500 font-sans font-medium mb-6">
          Pause ou libere a inicialização de jogos específicos individualmente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* FreeFire */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-sans font-bold text-slate-900">FreeFire</p>
                <p className="text-[10px] font-sans font-semibold text-slate-500">BlueStacks / HD-Player</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
              <span className={`text-[11px] font-sans font-bold ${ffEnabled ? 'text-blue-600' : 'text-slate-400'}`}>
                {ffEnabled ? 'Ativo' : 'Pausado'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = !ffEnabled
                  setFfEnabled(next)
                  handleSave({ freefire_enabled: next })
                }}
                className="h-7 text-xs font-sans font-semibold border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-xs"
              >
                {ffEnabled ? 'Pausar' : 'Ativar'}
              </Button>
            </div>
          </div>

          {/* Valorant */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                <Crosshair className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-sans font-bold text-slate-900">Valorant</p>
                <p className="text-[10px] font-sans font-semibold text-slate-500">Aim Color / Vanguard</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
              <span className={`text-[11px] font-sans font-bold ${valEnabled ? 'text-blue-600' : 'text-slate-400'}`}>
                {valEnabled ? 'Ativo' : 'Pausado'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = !valEnabled
                  setValEnabled(next)
                  handleSave({ valorant_enabled: next })
                }}
                className="h-7 text-xs font-sans font-semibold border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-xs"
              >
                {valEnabled ? 'Pausar' : 'Ativar'}
              </Button>
            </div>
          </div>

          {/* CS2 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-sans font-bold text-slate-900">Counter-Strike 2</p>
                <p className="text-[10px] font-sans font-semibold text-slate-500">VAC Bypass</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
              <span className={`text-[11px] font-sans font-bold ${cs2Enabled ? 'text-blue-600' : 'text-slate-400'}`}>
                {cs2Enabled ? 'Ativo' : 'Pausado'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = !cs2Enabled
                  setCs2Enabled(next)
                  handleSave({ cs2_enabled: next })
                }}
                className="h-7 text-xs font-sans font-semibold border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-xs"
              >
                {cs2Enabled ? 'Pausar' : 'Ativar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
