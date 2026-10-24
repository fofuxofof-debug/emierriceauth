'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { KeysTable } from '@/components/keys-table'
import { CreateKeyDialog } from '@/components/create-key-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Bot, ShieldCheck, Sparkles } from 'lucide-react'
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#db00ff] animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#db00ff] flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5" /> INTEGRAÇÃO DISCORD BOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
            Keys Bot (Vendas Automáticas)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans font-medium">
            Chaves geradas automaticamente pelo Bot do Discord após aprovação do Pix com validação de Discord ID
          </p>
        </div>

        <Button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Gerar Key Bot Manual
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[0.6rem] border border-[#171819] bg-[#101010] p-5 shadow-sm hover:border-[#db00ff]/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Total Geradas pelo Bot</span>
            <Bot className="h-4 w-4 text-[#db00ff]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalBotKeys}</div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">Vinculadas via Discord ID</p>
        </div>

        <div className="rounded-[0.6rem] border border-[#171819] bg-[#101010] p-5 shadow-sm hover:border-[#db00ff]/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Keys Ativas no Loader</span>
            <ShieldCheck className="h-4 w-4 text-[#db00ff]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{activeBotKeys}</div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">Autorizadas para autenticação</p>
        </div>

        <div className="rounded-[0.6rem] border border-[#171819] bg-[#101010] p-5 shadow-sm hover:border-[#db00ff]/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase font-sans tracking-wider">Status da Conexão</span>
            <Sparkles className="h-4 w-4 text-[#db00ff]" />
          </div>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-2 font-mono">
            <span className="h-2 w-2 rounded-full bg-[#db00ff]" /> API /api/keys Pronta
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">Recebendo compras do Hooked Sales</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar por Discord ID, Key, Tag de cliente ou plano..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#171819] bg-[#101010] pl-10 text-white placeholder:text-zinc-600 font-mono text-xs rounded-[0.6rem] focus-visible:ring-2 focus-visible:ring-[#db00ff]/30 focus-visible:border-[#db00ff]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-[#171819] bg-[#101010] text-white sm:w-44 font-mono text-xs rounded-[0.6rem] focus:ring-2 focus:ring-[#db00ff]/30 focus:border-[#db00ff]">
            <Filter className="mr-2 h-3.5 w-3.5 text-zinc-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[#171819] bg-[#101010] text-white">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
            <SelectItem value="banned">Banidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
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
