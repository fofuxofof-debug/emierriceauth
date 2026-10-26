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
    color: 'text-[#ea580c]',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Key Criada',
  },
  key_renewed: {
    icon: RefreshCw,
    color: 'text-[#f97316]',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Key Renovada',
  },
  auth_success: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Auth Aprovada',
  },
  auth_fail: {
    icon: XCircle,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'Auth Recusada',
  },
  hwid_reset: {
    icon: RotateCcw,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    label: 'HWID Resetado',
  },
  hwid_updated: {
    icon: Monitor,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    label: 'HWID Registrado',
  },
  key_banned: {
    icon: Ban,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'Key Banida',
  },
  key_unbanned: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Key Desbanida',
  },
  key_paused: {
    icon: Pause,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Key Pausada',
  },
  key_resumed: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Key Despausada',
  },
  key_deleted: {
    icon: Trash2,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'Key Deletada',
  },
}

export function RecentActivity({ logs }: { logs: AuthLog[] }) {
  const [filterType, setFilterType] = useState<'all' | 'keys' | 'auth' | 'alerts'>('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const filteredLogs = logs.filter((log) => {
    // Type filter
    if (filterType === 'keys') {
      if (!log.event_type.startsWith('key_')) return false
    } else if (filterType === 'auth') {
      if (!log.event_type.startsWith('auth_') && !log.event_type.startsWith('hwid_')) return false
    } else if (filterType === 'alerts') {
      if (
        log.event_type !== 'auth_fail' &&
        log.event_type !== 'key_banned' &&
        log.event_type !== 'key_deleted'
      )
        return false
    }

    // Text search filter
    if (search.trim()) {
      const term = search.toLowerCase()
      const details = JSON.stringify(log.details || {}).toLowerCase()
      const matchKey = (log.key_id || '').toLowerCase().includes(term)
      const matchHwid = (log.hwid || '').toLowerCase().includes(term)
      const matchIp = (log.ip_address || '').toLowerCase().includes(term)
      const matchType = log.event_type.toLowerCase().includes(term)
      return matchKey || matchHwid || matchIp || matchType || details.includes(term)
    }

    return true
  })

  return (
    <div className="card-in rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      
      {/* Top Header */}
      <div className="border-b border-slate-100 p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 border border-orange-200 text-[#ea580c]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-mono uppercase tracking-wider">
              Atividade & Logs em Tempo Real
            </h2>
            <p className="text-[11px] text-slate-500">
              {filteredLogs.length} {filteredLogs.length === 1 ? 'registro' : 'registros'} exibidos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
            TELEMETRIA ATIVA
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
            }`}
          >
            <Layers className={`h-3.5 w-3.5 ${filterType === 'all' ? 'text-white' : 'text-slate-400'}`} />
            <span>Todos</span>
          </button>
          <button
            onClick={() => setFilterType('keys')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'keys'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
            }`}
          >
            <Key className={`h-3.5 w-3.5 ${filterType === 'keys' ? 'text-white' : 'text-[#ea580c]'}`} />
            <span>Keys</span>
          </button>
          <button
            onClick={() => setFilterType('auth')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'auth'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${filterType === 'auth' ? 'text-white' : 'text-amber-500'}`} />
            <span>Auths</span>
          </button>
          <button
            onClick={() => setFilterType('alerts')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'alerts'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
            }`}
          >
            <AlertTriangle className={`h-3.5 w-3.5 ${filterType === 'alerts' ? 'text-white' : 'text-rose-500'}`} />
            <span>Alertas / Erros</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por key, HWID, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs font-mono rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/30 transition-all"
          />
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-xs text-slate-400 font-medium font-mono">
            Nenhum evento corresponde aos filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => {
            const config = eventConfig[log.event_type] ?? {
              icon: Activity,
              color: 'text-slate-500',
              bg: 'bg-slate-50',
              border: 'border-slate-200',
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
                className="p-3.5 sm:p-4 hover:bg-orange-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left Side: Icon + Title + Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.bg} ${config.border} shadow-2xs`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 font-sans">
                        {config.label}
                      </span>

                      {/* Product Chip */}
                      {productString && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                          <Gamepad2 className="h-2.5 w-2.5 text-[#ea580c]" />
                          {productString}
                        </span>
                      )}

                      {/* Label/User Chip */}
                      {labelString && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[#ea580c]">
                          <User className="h-2.5 w-2.5" />
                          {labelString}
                        </span>
                      )}

                      {/* Days Chip for Renewals */}
                      {daysAdded && (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600">
                          +{daysAdded} dias
                        </span>
                      )}
                    </div>

                    {/* Meta info row: Key, IP, HWID */}
                    <div className="mt-1.5 flex items-center gap-2.5 flex-wrap text-[11px] font-mono text-slate-500">
                      
                      {/* Key value pill */}
                      {keyString && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(keyString, `${log.id}-key`, 'Key')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 hover:text-orange-600 hover:border-orange-300 hover:bg-white transition-colors"
                          title="Clique para copiar a Key"
                        >
                          <span className="text-slate-400">Key:</span>
                          <span className="text-slate-800 font-semibold">{keyString}</span>
                          {copiedId === `${log.id}-key` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* IP Pill */}
                      {log.ip_address && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(log.ip_address!, `${log.id}-ip`, 'IP')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-white transition-colors"
                          title="Clique para copiar o IP"
                        >
                          <span className="text-slate-400">IP:</span>
                          <span>{log.ip_address}</span>
                          {copiedId === `${log.id}-ip` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* HWID Pill */}
                      {log.hwid && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(log.hwid!, `${log.id}-hwid`, 'HWID')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-white transition-colors"
                          title="Clique para copiar o HWID completo"
                        >
                          <span className="text-slate-400">HWID:</span>
                          <span>{log.hwid.slice(0, 18)}...</span>
                          {copiedId === `${log.id}-hwid` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* Reason Pill */}
                      {details.reason && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-600">
                          <ShieldAlert className="h-3 w-3 text-rose-500" />
                          {String(details.reason)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Timestamp */}
                <div className="shrink-0 sm:text-right text-[11px] font-mono text-slate-400">
                  <span className="text-slate-600 font-semibold">{formatDate(log.created_at)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
