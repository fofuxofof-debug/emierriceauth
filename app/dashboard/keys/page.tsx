'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { KeysTable } from '@/components/keys-table'
import { CreateKeyDialog } from '@/components/create-key-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter } from 'lucide-react'
import type { LicenseKey } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function KeysPage() {
  const { data: resp, error, isLoading, mutate } = useSWR<{ data: LicenseKey[] }>('/api/keys', fetcher)
  const keys = resp?.data
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)

  const handleCreated = useCallback(() => {
    mutate()
    setShowCreate(false)
  }, [mutate])

  const filteredKeys = (keys ?? []).filter((key) => {
    const now = new Date()
    const isExpired = new Date(key.expires_at) <= now
    const effectiveStatus =
      key.status === 'banned' ? 'banned' :
      key.status === 'paused' ? 'paused' :
      isExpired ? 'expired' : 'active'

    if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false
    if (search) {
      const term = search.toLowerCase()
      return (
        key.key.toLowerCase().includes(term) ||
        key.label?.toLowerCase().includes(term) ||
        key.discord_id?.toLowerCase().includes(term)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400">GERENCIADOR DE LICENÇAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">Keys & Clientes</h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans font-medium">Emissão, bloqueio e acompanhamento de licenças ativas</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="button-shine bg-white text-black hover:bg-zinc-200 font-sans font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nova Key
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Buscar por key, label, HWID ou Discord ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-zinc-800 bg-[#121215] pl-10 text-white placeholder:text-zinc-500 font-mono text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-zinc-800 bg-[#121215] text-white sm:w-44 font-mono text-xs rounded-xl">
            <Filter className="mr-2 h-3.5 w-3.5 text-zinc-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-[#0e0e11] text-white">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
            <SelectItem value="banned">Banidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Erro ao carregar keys.
        </div>
      )}

      <KeysTable keys={filteredKeys} isLoading={isLoading} onMutate={mutate} />

      <CreateKeyDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
      />
    </div>
  )
}
