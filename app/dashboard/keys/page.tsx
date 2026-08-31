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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-blue-600">GERENCIADOR DE LICENÇAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-sans">Keys & Clientes</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans font-medium">Emissão, bloqueio e acompanhamento de licenças ativas</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="button-shine bg-blue-600 text-white hover:bg-blue-700 font-sans font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nova Key
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por key, label, HWID ou Discord ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 font-mono text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 sm:w-44 font-mono text-xs rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <Filter className="mr-2 h-3.5 w-3.5 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-slate-200 bg-white text-slate-900">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
            <SelectItem value="banned">Banidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
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
