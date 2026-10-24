import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  { key: 'total_keys'   as const, label: 'Total de Keys',  icon: Key,         color: 'text-[#ff2d8d]', bgColor: 'bg-[#ff2d8d]/10 border border-[#ff2d8d]/25' },
  { key: 'active_keys'  as const, label: 'Keys Ativas',    icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border border-emerald-500/25' },
  { key: 'expired_keys' as const, label: 'Keys Expiradas', icon: XCircle,     color: 'text-amber-400', bgColor: 'bg-amber-500/10 border border-amber-500/25' },
  { key: 'banned_keys'  as const, label: 'Keys Banidas',   icon: Ban,         color: 'text-rose-400', bgColor: 'bg-rose-500/10 border border-rose-500/25' },
  { key: 'total_hwids'  as const, label: 'Dispositivos',   icon: Monitor,     color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 border border-cyan-500/25' },
  { key: 'recent_auths' as const, label: 'Auths Recentes', icon: Activity,    color: 'text-[#ff5ca0]', bgColor: 'bg-[#ff5ca0]/10 border border-[#ff5ca0]/25' },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${idx * 60 + 200}ms` }}
          className="card-in rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl p-4 sm:p-5 hover:border-[#ff2d8d]/40 transition-all hover-lift shadow-sm group cursor-default"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0 ${stat.bgColor} transition-transform duration-300 group-hover:scale-105`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums leading-none mb-1 font-mono tracking-tight">{data[stat.key]}</p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 truncate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
