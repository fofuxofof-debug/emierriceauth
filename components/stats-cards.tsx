import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  { key: 'total_keys'   as const, label: 'Total de Keys',  icon: Key,         color: 'text-rose-400', bgColor: 'bg-rose-500/10 border border-rose-500/20' },
  { key: 'active_keys'  as const, label: 'Keys Ativas',    icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border border-emerald-500/20' },
  { key: 'expired_keys' as const, label: 'Keys Expiradas', icon: XCircle,     color: 'text-zinc-400', bgColor: 'bg-[#14141e] border border-[#1f1e29]' },
  { key: 'banned_keys'  as const, label: 'Keys Banidas',   icon: Ban,         color: 'text-red-400', bgColor: 'bg-red-500/10 border border-red-500/20' },
  { key: 'total_hwids'  as const, label: 'Dispositivos',   icon: Monitor,     color: 'text-rose-400', bgColor: 'bg-rose-500/10 border border-rose-500/20' },
  { key: 'recent_auths' as const, label: 'Auths Recentes', icon: Activity,    color: 'text-rose-400', bgColor: 'bg-rose-500/10 border border-rose-500/20' },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${idx * 70 + 300}ms` }}
          className="card-in rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-4 sm:p-5 hover:border-rose-500/40 transition-all hover-lift shadow-sm group cursor-default"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shrink-0 ${stat.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-[#f8fafc] tabular-nums leading-none mb-1 font-mono">{data[stat.key]}</p>
              <p className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 truncate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
