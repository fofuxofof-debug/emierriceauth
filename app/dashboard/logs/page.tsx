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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto page-in">
      <div className="border-b border-white/10 pb-6 card-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-[#db00ff] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#db00ff]">AUDITORIA E TELEMETRIA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">Logs de Autenticação</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          Histórico detalhado de requisições, eventos de HWID e tentativas de login
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-[0.6rem] border border-white/5 bg-[#101012] p-12 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-[#db00ff]" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-xs text-red-400 font-mono">
          Erro ao carregar registros de auditoria.
        </div>
      )}

      {logs && <RecentActivity logs={logs} />}
    </div>
  )
}
