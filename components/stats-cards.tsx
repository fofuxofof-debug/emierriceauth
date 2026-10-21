import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  { key: 'total_keys'   as const, label: 'Total de Keys',  icon: Key,         color: 'text-[#db00ff]', bgColor: 'bg-[#db00ff]/10 border border-[#db00ff]/20' },
  { key: 'active_keys'  as const, label: 'Keys Ativas',    icon: CheckCircle, color: 'text-[#db00ff]', bgColor: 'bg-[#db00ff]/10 border border-[#db00ff]/20' },
  { key: 'expired_keys' as const, label: 'Keys Expiradas', icon: XCircle,     color: 'text-zinc-500', bgColor: 'bg-[#101010] border border-[#171819]' },
  { key: 'banned_keys'  as const, label: 'Keys Banidas',   icon: Ban,         color: 'text-zinc-400', bgColor: 'bg-[#101010] border border-[#171819]' },
  { key: 'total_hwids'  as const, label: 'Dispositivos',   icon: Monitor,     color: 'text-[#db00ff]', bgColor: 'bg-[#db00ff]/10 border border-[#db00ff]/20' },
  { key: 'recent_auths' as const, label: 'Auths Recentes', icon: Activity,    color: 'text-[#db00ff]', bgColor: 'bg-[#db00ff]/10 border border-[#db00ff]/20' },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${idx * 70 + 300}ms` }}
          className="card-in rounded-[0.6rem] border border-[#171819] bg-[#101010] p-4 sm:p-5 hover:border-[#db00ff]/30 transition-all hover-lift shadow-sm group cursor-default"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[0.5rem] shrink-0 ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none mb-1 font-mono">{data[stat.key]}</p>
              <p className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 truncate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
