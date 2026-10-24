'use client'

import React, { useState } from 'react'
import type { AuthLog } from '@/lib/types'
import { formatDate } from '@/lib/keys'
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  Key,
  Clock,
  Monitor,
  AlertTriangle,
  Pause,
  Activity,
  Copy,
  Check,
  Search,
  RefreshCw,
  Trash2,
  Gamepad2,
  User,
  ShieldAlert,
  Zap,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'

interface EventMeta {
  icon: React.ElementType
  color: string
  bg: string
  border: string
  label: string
}

const eventConfig: Record<string, EventMeta> = {
  key_created: {
    icon: Key,
    color: 'text-[#ff2d8d]',
    bg: 'bg-[#ff2d8d]/10',
    border: 'border-[#ff2d8d]/30',
    label: 'Key Criada',
  },
  key_renewed: {
    icon: RefreshCw,
    color: 'text-[#ff5ca0]',
    bg: 'bg-[#ff5ca0]/10',
    border: 'border-[#ff5ca0]/30',
    label: 'Key Renovada',
  },
  auth_success: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    label: 'Auth Aprovada',
  },
  auth_fail: {
    icon: XCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    label: 'Auth Recusada',
  },
  hwid_reset: {
    icon: RotateCcw,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    label: 'HWID Resetado',
  },
  key_banned: {
    icon: Ban,
    color: 'text-rose-500',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    label: 'Key Banida',
  },
  key_paused: {
    icon: Pause,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Key Pausada',
  },
  key_reactivated: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    label: 'Key Reativada',
  },
  key_deleted: {
    icon: Trash2,
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/40',
    border: 'border-zinc-700/40',
    label: 'Key Excluída',
  },
  key_expired: {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Key Expirada',
  },
  hwid_mismatch: {
    icon: Monitor,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    label: 'HWID Não Reconhecido',
  },
  device_limit: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Limite de Dispositivos',
  },
}

export function RecentActivity({ logs }: { logs: AuthLog[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'auth' | 'keys' | 'alerts'>('all')

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredLogs = logs.filter((log) => {
    // Filtro por categoria
    if (filterType === 'auth' && !log.event_type.startsWith('auth_')) return false
    if (filterType === 'keys' && !log.event_type.startsWith('key_')) return false
    if (
      filterType === 'alerts' &&
      !['auth_fail', 'device_limit', 'hwid_mismatch', 'key_banned'].includes(log.event_type)
    )
      return false

    // Busca por termo
    if (search.trim()) {
      const term = search.toLowerCase()
      const d = log.details || {}
      const keyVal = String(d.key || '').toLowerCase()
      const labelVal = String(d.label || '').toLowerCase()
      const hwidVal = String(log.hwid || '').toLowerCase()
      const ipVal = String(log.ip_address || '').toLowerCase()
      const eventVal = String(log.event_type).toLowerCase()

      return (
        keyVal.includes(term) ||
        labelVal.includes(term) ||
        hwidVal.includes(term) ||
        ipVal.includes(term) ||
        eventVal.includes(term)
      )
    }

    return true
  })

  return (
    <div className="card-in rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl shadow-xl overflow-hidden">
      
      {/* Top Header */}
      <div className="border-b border-[rgb(20,20,20)] p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-black/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff2d8d]/10 border border-[#ff2d8d]/25 text-[#ff2d8d]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
              Atividade & Logs em Tempo Real
            </h2>
            <p className="text-[11px] text-zinc-400">
              {filteredLogs.length} {filteredLogs.length === 1 ? 'registro' : 'registros'} exibidos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff2d8d] bg-[#ff2d8d]/10 border border-[#ff2d8d]/30 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
            TELEMETRIA ATIVA
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 border-b border-[rgb(20,20,20)] bg-black/20 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#ff2d8d] text-white shadow-[0_0_14px_rgba(255,45,141,0.45)]'
                : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-[rgb(20,20,20)] hover:border-[#ff2d8d]/30'
            }`}
          >
            <Layers className={`h-3.5 w-3.5 ${filterType === 'all' ? 'text-white' : 'text-zinc-400'}`} />
            <span>Todos</span>
          </button>
          <button
            onClick={() => setFilterType('keys')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'keys'
                ? 'bg-[#ff2d8d] text-white shadow-[0_0_14px_rgba(255,45,141,0.45)]'
                : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-[rgb(20,20,20)] hover:border-[#ff2d8d]/30'
            }`}
          >
            <Key className={`h-3.5 w-3.5 ${filterType === 'keys' ? 'text-white' : 'text-[#ff2d8d]'}`} />
            <span>Keys</span>
          </button>
          <button
            onClick={() => setFilterType('auth')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'auth'
                ? 'bg-[#ff2d8d] text-white shadow-[0_0_14px_rgba(255,45,141,0.45)]'
                : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-[rgb(20,20,20)] hover:border-[#ff2d8d]/30'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${filterType === 'auth' ? 'text-white' : 'text-amber-400'}`} />
            <span>Auths</span>
          </button>
          <button
            onClick={() => setFilterType('alerts')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'alerts'
                ? 'bg-[#ff2d8d] text-white shadow-[0_0_14px_rgba(255,45,141,0.45)]'
                : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-[rgb(20,20,20)] hover:border-[#ff2d8d]/30'
            }`}
          >
            <AlertTriangle className={`h-3.5 w-3.5 ${filterType === 'alerts' ? 'text-white' : 'text-rose-400'}`} />
            <span>Alertas / Erros</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filtrar por key, HWID, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs font-mono rounded-lg border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff2d8d] focus:ring-1 focus:ring-[#ff2d8d]/30"
          />
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-xs text-zinc-400 font-medium">
            Nenhum evento corresponde aos filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[rgb(20,20,20)]">
          {filteredLogs.map((log) => {
            const config = eventConfig[log.event_type] ?? {
              icon: Activity,
              color: 'text-zinc-400',
              bg: 'bg-zinc-800/20',
              border: 'border-zinc-700/30',
              label: log.event_type.replace('_', ' ').toUpperCase(),
            }
            const Icon = config.icon
            const details = (log.details as Record<string, any>) || {}

            const keyString = details.key || details.attempted_key || null
            const labelString = details.label || null
            const productString = details.product || null
            const daysAdded = details.days || null

            return (
              <div
                key={log.id}
                className="p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left Side: Icon + Title + Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.bg} ${config.border} shadow-sm`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white font-sans">
                        {config.label}
                      </span>

                      {/* Product Chip */}
                      {productString && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-[rgb(20,20,20)] text-zinc-300">
                          <Gamepad2 className="h-2.5 w-2.5 text-[#ff2d8d]" />
                          {productString}
                        </span>
                      )}

                      {/* Label/User Chip */}
                      {labelString && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#ff2d8d]/10 border border-[#ff2d8d]/25 text-[#ff5ca0]">
                          <User className="h-2.5 w-2.5" />
                          {labelString}
                        </span>
                      )}

                      {/* Days Chip for Renewals */}
                      {daysAdded && (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                          +{daysAdded} dias
                        </span>
                      )}
                    </div>

                    {/* Meta info row: Key, IP, HWID */}
                    <div className="mt-1.5 flex items-center gap-2.5 flex-wrap text-[11px] font-mono text-zinc-400">
                      
                      {/* Key value pill */}
                      {keyString && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(keyString, `${log.id}-key`, 'Key')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[rgb(20,20,20)] bg-black/40 text-zinc-300 hover:text-white hover:border-[#ff2d8d]/50 transition-colors"
                          title="Clique para copiar a Key"
                        >
                          <span className="text-zinc-500">Key:</span>
                          <span className="text-zinc-200 font-semibold">{keyString}</span>
                          {copiedId === `${log.id}-key` ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-zinc-500" />
                          )}
                        </button>
                      )}

                      {/* IP Pill */}
                      {log.ip_address && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(log.ip_address!, `${log.id}-ip`, 'IP')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[rgb(20,20,20)] bg-black/40 text-zinc-400 hover:text-white hover:border-[#ff2d8d]/40 transition-colors"
                          title="Clique para copiar o IP"
                        >
                          <span className="text-zinc-500">IP:</span>
                          <span>{log.ip_address}</span>
                          {copiedId === `${log.id}-ip` ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-zinc-600" />
                          )}
                        </button>
                      )}

                      {/* HWID Pill */}
                      {log.hwid && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(log.hwid!, `${log.id}-hwid`, 'HWID')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[rgb(20,20,20)] bg-black/40 text-zinc-400 hover:text-white hover:border-[#ff2d8d]/40 transition-colors"
                          title="Clique para copiar o HWID completo"
                        >
                          <span className="text-zinc-500">HWID:</span>
                          <span>{log.hwid.slice(0, 18)}...</span>
                          {copiedId === `${log.id}-hwid` ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-zinc-600" />
                          )}
                        </button>
                      )}

                      {/* Reason Pill */}
                      {details.reason && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-300">
                          <ShieldAlert className="h-3 w-3 text-rose-400" />
                          {String(details.reason)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Timestamp */}
                <div className="shrink-0 sm:text-right text-[11px] font-mono text-zinc-500">
                  <span className="text-zinc-400 font-semibold">{formatDate(log.created_at)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
