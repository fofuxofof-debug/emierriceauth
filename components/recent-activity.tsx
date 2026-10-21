import type { AuthLog } from '@/lib/types'
import { formatDate } from '@/lib/keys'
import { CheckCircle, XCircle, RotateCcw, Ban, Key, Clock, Monitor, AlertTriangle, Pause } from 'lucide-react'

const eventConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  auth_success:    { icon: CheckCircle,    color: 'text-white',     label: 'Auth OK' },
  auth_fail:       { icon: XCircle,        color: 'text-zinc-400',  label: 'Auth Falhou' },
  hwid_reset:      { icon: RotateCcw,      color: 'text-zinc-300',  label: 'HWID Reset' },
  key_banned:      { icon: Ban,            color: 'text-zinc-400',  label: 'Key Banida' },
  key_paused:      { icon: Pause,          color: 'text-zinc-400',  label: 'Key Pausada' },
  key_reactivated: { icon: CheckCircle,    color: 'text-white',     label: 'Key Reativada' },
  key_created:     { icon: Key,            color: 'text-white',     label: 'Key Criada' },
  key_deleted:     { icon: XCircle,        color: 'text-zinc-500',  label: 'Key Deletada' },
  key_expired:     { icon: Clock,          color: 'text-zinc-500',  label: 'Key Expirada' },
  hwid_mismatch:   { icon: Monitor,        color: 'text-zinc-400',  label: 'HWID Mismatch' },
  device_limit:    { icon: AlertTriangle,  color: 'text-zinc-400',  label: 'Limite Dispositivos' },
}

export function RecentActivity({ logs }: { logs: AuthLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="card-in rounded-2xl border border-zinc-800 bg-[#0e0e11] p-8 text-center shadow-sm" style={{ animationDelay: '500ms' }}>
        <p className="text-sm text-zinc-400 font-sans font-medium">Nenhuma atividade recente registrada.</p>
      </div>
    )
  }

  return (
    <div className="card-in rounded-2xl border border-zinc-800 bg-[#0e0e11] shadow-sm overflow-hidden" style={{ animationDelay: '500ms' }}>
      <div className="border-b border-zinc-800 p-4 sm:p-5 flex items-center justify-between bg-[#141418]">
        <h2 className="text-sm sm:text-base font-sans font-bold text-white uppercase tracking-wider">Atividade Recente</h2>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">FEED EM TEMPO REAL</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {logs.map((log) => {
          const config = eventConfig[log.event_type] ?? {
            icon: CheckCircle,
            color: 'text-zinc-400',
            label: log.event_type,
          }
          const Icon = config.icon
          return (
            <div key={log.id} className="flex items-start sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-4 hover:bg-zinc-900/40 transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-[#141418] text-white">
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-sans font-semibold text-white">{config.label}</p>
                  <span className="shrink-0 text-[10px] font-mono text-zinc-500">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <p className="truncate text-[11px] text-zinc-400 font-mono mt-0.5">
                  {log.ip_address && `IP: ${log.ip_address}`}
                  {log.hwid && ` • HWID: ${log.hwid.slice(0, 14)}...`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
