'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { KeysTable } from '@/components/keys-table'
import { CreateKeyDialog } from '@/components/create-key-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Bot, ShieldCheck, KeyRound, Sparkles } from 'lucide-react'
import type { LicenseKey } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BotKeysPage() {
  const { data: resp, error, isLoading, mutate } = useSWR<{ data: LicenseKey[] }>('/api/keys', fetcher)
  const keys = resp?.data
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)

  const handleCreated = useCallback(() => {
    mutate()
    setShowCreate(false)
  }, [mutate])

  // Filtra as chaves criadas pelo bot ou que possuam discord_id vinculado
  const botKeys = (keys ?? []).filter((key) => {
    const isBotKey = !!key.discord_id || (key.notes && key.notes.toLowerCase().includes('bot'))
    if (!isBotKey) return false

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
        key.discord_id?.toLowerCase().includes(term) ||
        key.product?.toLowerCase().includes(term)
      )
    }
    return true
  })

  const totalBotKeys = (keys ?? []).filter((k) => !!k.discord_id || (k.notes && k.notes.toLowerCase().includes('bot'))).length
  const activeBotKeys = (keys ?? []).filter((k) => (!!k.discord_id || (k.notes && k.notes.toLowerCase().includes('bot'))) && k.status === 'active' && new Date(k.expires_at) > new Date()).length

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#15233c] pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] animate-pulse" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#60a5fa] flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5" /> INTEGRAÇÃO DISCORD BOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f1f5f9] font-sans flex items-center gap-2">
            Keys Bot (Vendas Automáticas)
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] font-sans font-medium">
            Chaves geradas automaticamente pelo Bot do Discord após aprovação do Pix com validação de Discord ID
          </p>
        </div>

        <Button
          onClick={() => setShowCreate(true)}
          className="button-shine bg-[#3b82f6] text-white hover:bg-[#2563eb] font-sans font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Gerar Key Bot Manual
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#15233c] bg-[#0b1222] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Total Geradas pelo Bot</span>
            <Bot className="h-4 w-4 text-[#60a5fa]" />
          </div>
          <div className="text-2xl font-black text-[#f1f5f9] font-mono">{totalBotKeys}</div>
          <p className="text-[11px] text-[#64748b] mt-1">Vinculadas via Discord ID</p>
        </div>

        <div className="rounded-2xl border border-[#15233c] bg-[#0b1222] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Keys Ativas no Loader</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{activeBotKeys}</div>
          <p className="text-[11px] text-[#64748b] mt-1">Autorizadas para autenticação</p>
        </div>

        <div className="rounded-2xl border border-[#15233c] bg-[#0b1222] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Status da Conexão</span>
            <Sparkles className="h-4 w-4 text-[#60a5fa]" />
          </div>
          <div className="text-sm font-bold text-[#f1f5f9] mt-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> API /api/keys Pronta
          </div>
          <p className="text-[11px] text-[#64748b] mt-1">Recebendo compras do Smooth Sales</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          <Input
            placeholder="Buscar por Discord ID, Key, Tag de cliente ou plano..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#15233c] bg-[#0b1222] pl-10 text-[#f1f5f9] placeholder:text-[#64748b] font-mono text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#3b82f6]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-[#15233c] bg-[#0b1222] text-[#f1f5f9] sm:w-44 font-mono text-xs rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6]">
            <Filter className="mr-2 h-3.5 w-3.5 text-[#94a3b8]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[#15233c] bg-[#0b1222] text-[#f1f5f9]">
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
          Erro ao carregar keys do bot.
        </div>
      )}

      {/* Tabela de Keys */}
      <KeysTable keys={botKeys} isLoading={isLoading} onMutate={mutate} />

      {/* Modal de Criação Manual */}
      <CreateKeyDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
      />
    </div>
  )
}
