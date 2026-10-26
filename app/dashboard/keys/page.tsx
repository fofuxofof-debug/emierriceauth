'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { KeysTable } from '@/components/keys-table'
import { CreateKeyDialog } from '@/components/create-key-dialog'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, User, Users } from 'lucide-react'
import type { LicenseKey } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface SessionData {
  authenticated: boolean
  user: {
    username: string
    role: string
    defaultPath: string
    allowedPaths: string[]
  } | null
}

export default function KeysPage() {
  const { data: sessionResp } = useSWR<SessionData>('/api/auth/session', fetcher)
  const currentUser = sessionResp?.user
  const username = currentUser?.username?.toLowerCase() || ''
  const isMrcrlq = username === 'mrcrlq'
  const isSamuca = username === 'samucax' || username === 'samuca'

  // Para mrcrlq: filtro de dono ('mrcrlq' | 'samucax' | 'all')
  const [ownerFilter, setOwnerFilter] = useState<'mrcrlq' | 'samucax' | 'all'>('mrcrlq')

  const apiUrl = isMrcrlq ? `/api/keys?owner=${ownerFilter}` : '/api/keys'
  const { data: resp, error, isLoading, mutate } = useSWR<{ data: LicenseKey[] }>(apiUrl, fetcher)
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto page-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ea580c]">
              {isSamuca ? 'GERENCIADOR DE LICENÇAS • CLIENTES DE SAMUCA' : 'GERENCIADOR DE LICENÇAS'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Keys & Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isSamuca
              ? 'Seus clientes e chaves ativas isoladas'
              : 'Gestão isolada de clientes por operador (mrcrlq e Samuca)'}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary rounded-xl text-xs uppercase tracking-wider font-bold"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nova Key
        </button>
      </div>

      {/* Tabs / Seletor de Dono para mrcrlq (Admin) */}
      {isMrcrlq && (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white w-fit overflow-x-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setOwnerFilter('mrcrlq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'mrcrlq'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            Meus Clientes (mrcrlq)
          </button>
          <button
            type="button"
            onClick={() => setOwnerFilter('samucax')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'samucax'
                ? 'bg-orange-50 text-[#ea580c] border border-orange-200 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#ea580c]" />
            Clientes de Samuca
          </button>
          <button
            type="button"
            onClick={() => setOwnerFilter('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              ownerFilter === 'all'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-slate-400" />
            Todos os Clientes
          </button>
        </div>
      )}

      {/* Indicador para Samuca */}
      {isSamuca && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-orange-200 bg-orange-50 text-[#ea580c] w-fit">
          <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
          <span className="text-xs font-mono font-semibold">
            Visualizando exclusivamente seus clientes (Samuca)
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por key, label, HWID ou Discord ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 font-mono text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] h-10 shadow-2xs"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border border-slate-200 bg-white text-slate-900 sm:w-48 font-mono text-xs rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] h-10 shadow-2xs">
            <Filter className="mr-2 h-3.5 w-3.5 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border border-slate-200 bg-white text-slate-900 rounded-xl shadow-lg">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
            <SelectItem value="banned">Banidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600 font-medium">
          Erro ao carregar chaves de licença.
        </div>
      )}

      <KeysTable keys={filteredKeys} isLoading={isLoading} onMutate={mutate} />

      <CreateKeyDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
        canAssignOwner={isMrcrlq}
        defaultOwner={isSamuca ? 'SamucaX' : ownerFilter === 'samucax' ? 'SamucaX' : 'mrcrlq'}
      />
    </div>
  )
}
