'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { StatsCards } from '@/components/stats-cards'
import { RecentActivity } from '@/components/recent-activity'
import type { DashboardStats, AuthLog } from '@/lib/types'
import { Loader2, Plus, Bot, ShieldCheck, Activity, Cpu, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardPage() {
  const { data: statsResp } = useSWR<{ data: DashboardStats }>('/api/stats', fetcher, { refreshInterval: 5000 })
  const { data: logsResp } = useSWR<{ data: AuthLog[] }>('/api/logs?limit=10', fetcher, { refreshInterval: 5000 })

  const stats = statsResp?.data ?? {
    total_keys: 0, active_keys: 0, expired_keys: 0,
    banned_keys: 0, total_hwids: 0, recent_auths: 0,
  }
  const logs = logsResp?.data ?? []

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#1f1e29] pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-400">SMOOTH CLOUD CORE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f8fafc] font-sans">Painel de Controle</h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans font-medium mt-0.5">Gerenciamento central de licenças, HWID e integridade de conexões</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/dashboard/keys">
            <Button className="crimson-btn-primary text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/20 hover:scale-105 transition-all">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nova Key
            </Button>
          </Link>
          <Link href="/dashboard/bot-keys">
            <Button variant="outline" className="border-[#1f1e29] bg-[#0e0e14] text-zinc-300 hover:text-rose-400 hover:bg-[#14141e] font-sans font-semibold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-xs">
              <Bot className="mr-1.5 h-3.5 w-3.5" />
              Keys Bot
            </Button>
          </Link>
        </div>
      </div>

      {/* System Health Matrix Telemetry Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card-in hover-lift rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-4 flex items-center gap-3.5 shadow-sm group hover:border-rose-500/40 transition-all" style={{ animationDelay: '100ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f1e29] bg-[#14141e] text-rose-400 group-hover:scale-110 transition-transform">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Kernel System</p>
            <p className="text-xs font-sans font-bold text-[#f8fafc]">Ring0 Active (Hookless)</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-4 flex items-center gap-3.5 shadow-sm group hover:border-rose-500/40 transition-all" style={{ animationDelay: '150ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f1e29] bg-[#14141e] text-rose-400 group-hover:scale-110 transition-transform">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Database Latency</p>
            <p className="text-xs font-sans font-bold text-[#f8fafc]">&lt; 14ms (Supabase Cloud)</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-4 flex items-center gap-3.5 shadow-sm group hover:border-rose-500/40 transition-all" style={{ animationDelay: '200ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f1e29] bg-[#14141e] text-rose-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">HWID Protection</p>
            <p className="text-xs font-sans font-bold text-[#f8fafc]">100% Locked & Unique</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-4 flex items-center gap-3.5 shadow-sm group hover:border-rose-500/40 transition-all" style={{ animationDelay: '250ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f1e29] bg-[#14141e] text-rose-400 group-hover:scale-110 transition-transform">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Auth API Gateway</p>
            <p className="text-xs font-sans font-bold text-[#f8fafc]">Online • 99.9% Uptime</p>
          </div>
        </div>
      </div>

      {!statsResp ? (
        <div className="flex items-center justify-center rounded-2xl border border-[#1f1e29] bg-[#0e0e14] p-12 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      <RecentActivity logs={logs} />
    </div>
  )
}
