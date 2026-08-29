'use client'

import useSWR from 'swr'
import { RecentActivity } from '@/components/recent-activity'
import { Loader2 } from 'lucide-react'
import type { AuthLog } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LogsPage() {
  const { data: resp, isLoading, error } = useSWR<{ data: AuthLog[] }>(
    '/api/logs?limit=100',
    fetcher,
    { refreshInterval: 5000 }
  )
  const logs = resp?.data

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">AUDITORIA E TELEMETRIA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">Logs de Autenticação</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Histórico detalhado de requisições, eventos de HWID e tentativas de login
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-2xl border border-zinc-800 bg-[#0e0e11] p-12">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-xs text-red-400 font-mono">
          Erro ao carregar registros de auditoria.
        </div>
      )}

      {logs && <RecentActivity logs={logs} />}
    </div>
  )
}
