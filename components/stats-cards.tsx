import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  { key: 'total_keys'   as const, label: 'Total de Keys',  icon: Key,         color: 'text-[#ea580c]', bgColor: 'bg-orange-50 border border-orange-200' },
  { key: 'active_keys'  as const, label: 'Keys Ativas',    icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border border-emerald-200' },
  { key: 'expired_keys' as const, label: 'Keys Expiradas', icon: XCircle,     color: 'text-amber-600', bgColor: 'bg-amber-50 border border-amber-200' },
  { key: 'banned_keys'  as const, label: 'Keys Banidas',   icon: Ban,         color: 'text-rose-600', bgColor: 'bg-rose-50 border border-rose-200' },
  { key: 'total_hwids'  as const, label: 'Dispositivos',   icon: Monitor,     color: 'text-cyan-600', bgColor: 'bg-cyan-50 border border-cyan-200' },
  { key: 'recent_auths' as const, label: 'Auths Recentes', icon: Activity,    color: 'text-[#f97316]', bgColor: 'bg-orange-50 border border-orange-200' },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${idx * 60 + 200}ms` }}
          className="card-in rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-orange-300 transition-all hover-lift shadow-sm group cursor-default"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0 ${stat.bgColor} transition-transform duration-300 group-hover:scale-105`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums leading-none mb-1 font-mono tracking-tight">{data[stat.key]}</p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
