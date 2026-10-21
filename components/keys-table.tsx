'use client'

import type { LicenseKey, HWID } from '@/lib/types'
import { getDaysRemaining, formatDate } from '@/lib/keys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Copy, Loader2, Monitor, Cpu } from 'lucide-react'
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
  active:  { label: 'Ativa',    className: 'border-[#db00ff]/40 bg-[#db00ff]/15 text-[#db00ff] font-mono text-[10px]' },
  expired: { label: 'Expirada', className: 'border-white/10 bg-white/5 text-zinc-400 font-mono text-[10px]' },
  banned:  { label: 'Banida',   className: 'border-red-500/30 bg-red-500/10 text-red-400 line-through font-mono text-[10px]' },
  paused:  { label: 'Pausada',  className: 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-[10px]' },
} as const

function StatusBadge({ licenseKey }: { licenseKey: LicenseKey }) {
  const s = statusFor(licenseKey)
  const c = STATUS_BADGE[s]
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>
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
        className="rounded-[0.5rem] border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-zinc-200"
      >
        {shortened}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-zinc-400 hover:text-[#db00ff] hover:bg-white/5"
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
      <div className="flex items-center justify-center rounded-[0.6rem] border border-white/10 bg-[#101012] p-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-[#db00ff]" />
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div className="rounded-[0.6rem] border border-white/10 bg-[#101012] p-12 text-center shadow-sm">
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
              className="rounded-[0.6rem] border border-[#171819] bg-[#101010] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="block truncate rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white">
                      {key.key.length > 22 ? `${key.key.slice(0, 22)}…` : key.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-400 hover:text-[#db00ff] shrink-0"
                      onClick={() => copyKey(key.key)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {key.label && (
                    <p className="mt-2 text-xs font-mono text-zinc-300 truncate">{key.label}</p>
                  )}
                </div>
                <StatusBadge licenseKey={key} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-mono">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-[#db00ff]" /> HWID
                  </span>
                  <span className="text-white font-medium">
                    <HwidCell hwids={key.hwids} />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Monitor className="h-3 w-3 text-[#db00ff]" /> Dispositivos
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

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] font-mono text-zinc-500">
                  {formatDate(key.expires_at)}
                </span>
                <Link href={`/dashboard/keys/${key.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs font-mono border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-[#db00ff]/40 rounded-[0.5rem]"
                  >
                    <Eye className="h-3 w-3 text-[#db00ff]" />
                    Detalhes
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* ========= DESKTOP: table ========= */}
      <div className="hidden md:block overflow-hidden rounded-[0.6rem] border border-[#171819] bg-[#101010] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#171819] text-[11px] uppercase tracking-wider text-zinc-400 bg-[#101010] font-semibold">
                <th className="px-4 py-3.5 text-left font-sans font-semibold">Key de Licença</th>
                <th className="px-4 py-3.5 text-left font-sans font-semibold">Label / Cliente</th>
                <th className="px-4 py-3.5 text-left font-sans font-semibold">Status</th>
                <th className="px-4 py-3.5 text-left font-sans font-semibold">HWID Vinculado</th>
                <th className="px-4 py-3.5 text-left font-sans font-semibold">Slots</th>
                <th className="px-4 py-3.5 text-left font-sans font-semibold">Expiração</th>
                <th className="px-4 py-3.5 text-right font-sans font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171819]">
              {keys.map((key) => {
                const daysLeft = getDaysRemaining(key.expires_at)
                const used = key.hwids?.length ?? 0
                return (
                  <tr key={key.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="rounded-[0.5rem] border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white">
                          {key.key.length > 22 ? `${key.key.slice(0, 22)}…` : key.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-[#db00ff] hover:bg-white/5"
                          onClick={() => copyKey(key.key)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-300">{key.label ?? '-'}</td>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#db00ff] hover:bg-white/5 rounded-[0.5rem]">
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
