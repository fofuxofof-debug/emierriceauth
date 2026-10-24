'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { RecentActivity } from '@/components/recent-activity'
import { Loader2, User, Users } from 'lucide-react'
import type { AuthLog } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface SessionData {
  authenticated: boolean
  user: {
    username: string
    role: string
  } | null
}

export default function LogsPage() {
  const { data: sessionResp } = useSWR<SessionData>('/api/auth/session', fetcher)
  const isMrcrlq = sessionResp?.user?.username?.toLowerCase() === 'mrcrlq'
  const isSamuca = sessionResp?.user?.username?.toLowerCase() === 'samucax' || sessionResp?.user?.username?.toLowerCase() === 'samuca'

  const [ownerFilter, setOwnerFilter] = useState<'mrcrlq' | 'samucax' | 'all'>('mrcrlq')

  const logsUrl = isMrcrlq
    ? `/api/logs?limit=200&owner=${ownerFilter}`
    : '/api/logs?limit=200'

  const { data: resp, isLoading, error } = useSWR<{ data: AuthLog[] }>(
    logsUrl,
    fetcher,
    { refreshInterval: 5000 }
  )
  const logs = resp?.data

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto page-in">
      <div className="border-b border-[rgb(20,20,20)] pb-6 card-in">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff2d8d]">
            {isSamuca ? 'AUDITORIA E TELEMETRIA • LOGS DO SAMUCA' : 'AUDITORIA E TELEMETRIA'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Logs de Autenticação
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
          {isSamuca
            ? 'Histórico em tempo real exclusivo das suas licenças e clientes'
            : 'Histórico de requisições, eventos de HWID e autenticações com separação por operador'}
        </p>
      </div>

      {/* Tabs de Filtro de Logs para mrcrlq */}
      {isMrcrlq && (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => setOwnerFilter('mrcrlq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'mrcrlq'
                ? 'bg-white/10 text-white border border-[rgb(30,30,30)] font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="h-3.5 w-3.5 text-zinc-400" />
            Meus Logs (mrcrlq)
          </button>
          <button
            type="button"
            onClick={() => setOwnerFilter('samucax')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'samucax'
                ? 'bg-[#ff2d8d]/15 text-[#ff2d8d] border border-[#ff2d8d]/30 font-semibold shadow-[0_0_15px_rgba(255,45,141,0.15)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#ff2d8d]" />
            Logs de Samuca
          </button>
          <button
            type="button"
            onClick={() => setOwnerFilter('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'all'
                ? 'bg-white/10 text-white border border-[rgb(30,30,30)] font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            Todos os Logs
          </button>
        </div>
      )}

      {/* Indicador para Samuca */}
      {isSamuca && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-[#ff2d8d]/30 bg-[#ff2d8d]/10 text-[#ff2d8d] w-fit">
          <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
          <span className="text-xs font-mono font-semibold">
            Visualizando exclusivamente os logs das suas chaves (Samuca)
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-12 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff2d8d]" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 font-mono">
          Erro ao carregar registros de auditoria.
        </div>
      )}

      {logs && <RecentActivity logs={logs} />}
    </div>
  )
}
