'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { StatsCards } from '@/components/stats-cards'
import { RecentActivity } from '@/components/recent-activity'
import type { DashboardStats, AuthLog } from '@/lib/types'
import { Loader2, Plus, Bot, ShieldCheck, Activity, Cpu, Database } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardPage() {
  const { data: statsResp } = useSWR<{ data: DashboardStats }>('/api/stats', fetcher, { refreshInterval: 5000 })
  const { data: logsResp } = useSWR<{ data: AuthLog[] }>('/api/logs?limit=50', fetcher, { refreshInterval: 5000 })

  const stats = statsResp?.data ?? {
    total_keys: 0, active_keys: 0, expired_keys: 0,
    banned_keys: 0, total_hwids: 0, recent_auths: 0,
  }
  const logs = logsResp?.data ?? []

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto page-in">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[rgb(20,20,20)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff2d8d]">
              HOOKED CLOUD CORE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
            Painel de Controle
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
            Gerenciamento central de licenças, HWID e integridade de conexões
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/dashboard/keys">
            <button className="btn-primary rounded-xl text-xs uppercase tracking-wider font-bold">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nova Key
            </button>
          </Link>
          <Link href="/dashboard/bot-keys">
            <button className="btn-secondary rounded-xl text-xs uppercase tracking-wider font-mono">
              <Bot className="mr-1.5 h-3.5 w-3.5 text-[#ff2d8d]" />
              Keys Bot
            </button>
          </Link>
        </div>
      </div>

      {/* System Health Matrix Telemetry Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card-in hover-lift rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl p-4 flex items-center gap-3.5 shadow-sm group hover:border-[#ff2d8d]/40 transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff2d8d]/10 border border-[#ff2d8d]/25 text-[#ff2d8d] group-hover:scale-105 transition-transform">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Kernel System</p>
            <p className="text-xs font-mono font-bold text-white">Ring0 Active (Hookless)</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl p-4 flex items-center gap-3.5 shadow-sm group hover:border-[#ff2d8d]/40 transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Database Latency</p>
            <p className="text-xs font-mono font-bold text-white">&lt; 14ms (Local JSON/KV)</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl p-4 flex items-center gap-3.5 shadow-sm group hover:border-[#ff2d8d]/40 transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">HWID Protection</p>
            <p className="text-xs font-mono font-bold text-white">100% Locked & Unique</p>
          </div>
        </div>

        <div className="card-in hover-lift rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 backdrop-blur-xl p-4 flex items-center gap-3.5 shadow-sm group hover:border-[#ff2d8d]/40 transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5ca0]/10 border border-[#ff5ca0]/25 text-[#ff5ca0] group-hover:scale-105 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Auth API Gateway</p>
            <p className="text-xs font-mono font-bold text-white">Online • 99.9% Uptime</p>
          </div>
        </div>
      </div>

      {!statsResp ? (
        <div className="flex items-center justify-center rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d]/90 p-12 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff2d8d]" />
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Recent Activity */}
      <RecentActivity logs={logs} />
    </div>
  )
}
