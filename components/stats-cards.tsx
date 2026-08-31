import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  { key: 'total_keys'   as const, label: 'Total de Keys',  icon: Key,         color: 'text-blue-600', bgColor: 'bg-blue-50 border border-blue-100' },
  { key: 'active_keys'  as const, label: 'Keys Ativas',    icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border border-emerald-100' },
  { key: 'expired_keys' as const, label: 'Keys Expiradas', icon: XCircle,     color: 'text-slate-500', bgColor: 'bg-slate-100 border border-slate-200' },
  { key: 'banned_keys'  as const, label: 'Keys Banidas',   icon: Ban,         color: 'text-red-500', bgColor: 'bg-red-50 border border-red-100' },
  { key: 'total_hwids'  as const, label: 'Dispositivos',   icon: Monitor,     color: 'text-blue-600', bgColor: 'bg-blue-50 border border-blue-100' },
  { key: 'recent_auths' as const, label: 'Auths Recentes', icon: Activity,    color: 'text-blue-600', bgColor: 'bg-blue-50 border border-blue-100' },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${idx * 70 + 300}ms` }}
          className="card-in rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-blue-300 transition-all hover-lift shadow-sm group cursor-default"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shrink-0 ${stat.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums leading-none mb-1 font-mono">{data[stat.key]}</p>
              <p className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 truncate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
