'use client'

import React from 'react'
import type { LicenseKey, HWID } from '@/lib/types'
import { getDaysRemaining, formatDate } from '@/lib/keys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Copy, Loader2, Monitor, Cpu, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

type KeyRow = LicenseKey & { hwids?: HWID[] }

function statusFor(key: LicenseKey) {
  const isExpired = new Date(key.expires_at) <= new Date()
  if (key.status === 'banned') return 'banned'
  if (key.status === 'paused') return 'paused'
  if (isExpired) return 'expired'
  return 'active'
}

const STATUS_BADGE = {
  active:  { label: 'Ativa',    className: 'border-[#ff2d8d]/40 bg-[#ff2d8d]/15 text-[#ff2d8d] font-mono text-[10px]' },
  expired: { label: 'Expirada', className: 'border-[rgb(20,20,20)] bg-white/5 text-zinc-400 font-mono text-[10px]' },
  banned:  { label: 'Banida',   className: 'border-rose-500/30 bg-rose-500/10 text-rose-400 line-through font-mono text-[10px]' },
  paused:  { label: 'Pausada',  className: 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-[10px]' },
} as const

function StatusBadge({ licenseKey }: { licenseKey: LicenseKey }) {
  const s = statusFor(licenseKey)
  const c = STATUS_BADGE[s]
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>
}

export function OwnerBadge({ owner }: { owner?: string | null }) {
  const isSamuca = owner?.toLowerCase() === 'samucax' || owner?.toLowerCase() === 'samuca'
  if (isSamuca) {
    return (
      <Badge
        variant="outline"
        className="border-[#ff2d8d]/40 bg-[#ff2d8d]/10 text-[#ff2d8d] font-mono text-[10px] tracking-wide inline-flex items-center gap-1"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d8d]" />
        Samuca
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="border-[rgb(20,20,20)] bg-white/5 text-zinc-300 font-mono text-[10px] tracking-wide inline-flex items-center gap-1"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
      mrcrlq
    </Badge>
  )
}

function HwidCell({ hwids }: { hwids?: HWID[] }) {
  if (!hwids || hwids.length === 0) {
    return <span className="text-xs text-zinc-500 font-mono">—</span>
  }
  const first = hwids[0].hwid
  const shortened = first.length > 12 ? `${first.slice(0, 12)}…` : first
  const extra = hwids.length - 1

  const copy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(first)
    toast.success(`HWID copiado (${first.slice(0, 8)}…)`)
  }

  return (
    <div className="flex items-center gap-2 font-mono">
      <code
        title={first}
        className="rounded-lg border border-[rgb(20,20,20)] bg-black/50 px-2 py-1 font-mono text-[11px] text-zinc-200"
      >
        {shortened}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-zinc-400 hover:text-[#ff2d8d] hover:bg-white/5"
        onClick={copy}
      >
        <Copy className="h-3 w-3" />
      </Button>
      {extra > 0 && (
        <span className="text-[11px] text-zinc-400">+{extra}</span>
      )}
    </div>
  )
}

export function KeysTable({
  keys,
  isLoading,
}: {
  keys: KeyRow[]
  isLoading: boolean
  onMutate: () => void
}) {
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Key copiada!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-[#ff2d8d]" />
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-12 text-center shadow-sm">
        <p className="text-sm text-zinc-400 font-mono">Nenhuma chave de licença encontrada.</p>
      </div>
    )
  }

  return (
    <>
      {/* ========= MOBILE: cards ========= */}
      <div className="flex flex-col gap-3 md:hidden">
        {keys.map((key) => {
          const daysLeft = getDaysRemaining(key.expires_at)
          return (
            <div
              key={key.id}
              className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="block truncate rounded-lg border border-[rgb(20,20,20)] bg-black/60 px-2 py-1 font-mono text-[11px] text-white">
                      {key.key.length > 22 ? `${key.key.slice(0, 22)}…` : key.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-400 hover:text-[#ff2d8d] shrink-0"
                      onClick={() => copyKey(key.key)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <OwnerBadge owner={key.created_by} />
                    {key.label && (
                      <p className="text-xs font-mono text-zinc-300 truncate">{key.label}</p>
                    )}
                  </div>
                </div>
                <StatusBadge licenseKey={key} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-mono">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-[#ff2d8d]" /> HWID
                  </span>
                  <span className="text-white font-medium">
                    <HwidCell hwids={key.hwids} />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Monitor className="h-3 w-3 text-[#ff2d8d]" /> Dispositivos
                  </span>
                  <span className="text-white font-medium text-xs mt-1">
                    {(key.hwids?.length ?? 0)}/{key.max_devices}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Validade</span>
                  <span className="font-medium text-white text-xs">
                    {daysLeft <= 0 ? 'Expirada' : `${daysLeft} dias`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[rgb(20,20,20)] pt-3">
                <span className="text-[10px] font-mono text-zinc-500">
                  {formatDate(key.expires_at)}
                </span>
                <Link href={`/dashboard/keys/${key.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs font-mono border border-[rgb(20,20,20)] bg-white/5 text-zinc-300 hover:text-white hover:border-[#ff2d8d]/40 rounded-lg"
                  >
                    <Eye className="h-3 w-3 text-[#ff2d8d]" />
                    Detalhes
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* ========= DESKTOP: table ========= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[rgb(20,20,20)] text-[11px] uppercase tracking-wider text-zinc-400 bg-black/40 font-semibold font-mono">
                <th className="px-4 py-3.5 text-left font-semibold">Key de Licença</th>
                <th className="px-4 py-3.5 text-left font-semibold">Label / Cliente</th>
                <th className="px-4 py-3.5 text-left font-semibold">Dono</th>
                <th className="px-4 py-3.5 text-left font-semibold">Status</th>
                <th className="px-4 py-3.5 text-left font-semibold">HWID Vinculado</th>
                <th className="px-4 py-3.5 text-left font-semibold">Slots</th>
                <th className="px-4 py-3.5 text-left font-semibold">Expiração</th>
                <th className="px-4 py-3.5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(20,20,20)]">
              {keys.map((key) => {
                const daysLeft = getDaysRemaining(key.expires_at)
                const used = key.hwids?.length ?? 0
                return (
                  <tr key={key.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="rounded-lg border border-[rgb(20,20,20)] bg-black/50 px-2 py-1 font-mono text-xs text-white">
                          {key.key.length > 22 ? `${key.key.slice(0, 22)}…` : key.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-[#ff2d8d] hover:bg-white/5"
                          onClick={() => copyKey(key.key)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-300">{key.label ?? '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <OwnerBadge owner={key.created_by} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge licenseKey={key} /></td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <HwidCell hwids={key.hwids} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">{used}/{key.max_devices}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-white">{formatDate(key.expires_at)}</span>
                        <span className="text-[10px] text-zinc-500">
                          {daysLeft <= 0 ? 'Expirada' : `${daysLeft} dias restantes`}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link href={`/dashboard/keys/${key.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#ff2d8d] hover:bg-white/5 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
