'use client'

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { formatDate, getDaysRemaining } from '@/lib/keys'
import type { LicenseKey, HWID, AuthLog } from '@/lib/types'
import { OwnerBadge } from '@/components/keys-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Copy, Ban, CheckCircle, RotateCcw, Trash2, Monitor,
  Loader2, Save, MessageSquare, Clock, Hash, Pause, User, ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface KeyDetail {
  key: LicenseKey
  hwids: HWID[]
  logs: AuthLog[]
}

interface SessionData {
  authenticated: boolean
  user: {
    username: string
    role: string
  } | null
}

const fetcher = (url: string) => fetch(url).then(async (r) => {
  if (!r.ok) throw new Error('not_found')
  return r.json()
})

export default function KeyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: sessionResp } = useSWR<SessionData>('/api/auth/session', (u) => fetch(u).then((r) => r.json()))
  const isMrcrlq = sessionResp?.user?.username?.toLowerCase() === 'mrcrlq'

  const { data: resp, isLoading, error, mutate } = useSWR<{ data: KeyDetail }>(
    id ? `/api/keys/${id}` : null,
    fetcher
  )
  const data = resp?.data

  const [editMaxDevices, setEditMaxDevices] = useState('')
  const [editExpiryDays, setEditExpiryDays] = useState('')
  const [editDiscordId, setEditDiscordId] = useState('')
  const [editLabel, setEditLabel] = useState('')
  const [editOwner, setEditOwner] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff2d8d]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 p-16 rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] max-w-lg mx-auto">
        <p className="text-sm text-rose-400 font-mono">Chave não encontrada ou acesso não autorizado.</p>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/keys')}
          className="border border-[rgb(20,20,20)] bg-white/5 text-zinc-300 hover:text-white rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Keys
        </Button>
      </div>
    )
  }

  const { key, hwids, logs } = data
  const daysLeft = getDaysRemaining(key.expires_at)
  const isExpired = new Date(key.expires_at) <= new Date()
  const effectiveStatus =
    key.status === 'banned' ? 'banned' :
    key.status === 'paused' ? 'paused' :
    isExpired ? 'expired' : 'active'

  const statusConfig = {
    active:  { label: 'Ativa',    className: 'border-[#ff2d8d]/40 bg-[#ff2d8d]/15 text-[#ff2d8d] font-mono text-xs' },
    expired: { label: 'Expirada', className: 'border-[rgb(20,20,20)] bg-white/5 text-zinc-400 font-mono text-xs' },
    banned:  { label: 'Banida',   className: 'border-rose-500/30 bg-rose-500/10 text-rose-400 line-through font-mono text-xs' },
    paused:  { label: 'Pausada',  className: 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs' },
  } as const

  const copyKey = () => {
    navigator.clipboard.writeText(key.key)
    toast.success('Key copiada!')
  }

  const handleBanToggle = async () => {
    const newStatus = key.status === 'banned' ? 'active' : 'banned'
    const res = await fetch(`/api/keys/${key.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) {
      toast.error('Erro ao atualizar status')
      return
    }
    toast.success(newStatus === 'banned' ? 'Key banida!' : 'Key reativada!')
    mutate()
  }

  const handlePauseToggle = async () => {
    const newStatus = key.status === 'paused' ? 'active' : 'paused'
    const res = await fetch(`/api/keys/${key.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) {
      toast.error('Erro ao atualizar status')
      return
    }
    toast.success(newStatus === 'paused' ? 'Key pausada!' : 'Key reativada!')
    mutate()
  }

  const handleResetHWIDs = async () => {
    const res = await fetch(`/api/keys/${key.id}/hwids`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao resetar HWIDs')
      return
    }
    toast.success('HWIDs resetados!')
    mutate()
  }

  const handleDeleteKey = async () => {
    const res = await fetch(`/api/keys/${key.id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao deletar key')
      return
    }
    toast.success('Key deletada!')
    router.push('/dashboard/keys')
  }

  const handleRemoveHWID = async (hwidId: string) => {
    const res = await fetch(`/api/hwids/${hwidId}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao remover HWID')
      return
    }
    toast.success('HWID removido!')
    mutate()
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const updates: Record<string, unknown> = {}
      if (editMaxDevices) updates.max_devices = Math.max(Number.parseInt(editMaxDevices) || 1, 1)
      if (editExpiryDays) updates.expires_in_days = Math.max(Number.parseInt(editExpiryDays) || 0, 1)
      if (editDiscordId !== '') updates.discord_id = editDiscordId
      if (editLabel !== '')     updates.label = editLabel
      if (editOwner !== '' && isMrcrlq) updates.created_by = editOwner

      if (Object.keys(updates).length === 0) {
        toast.error('Nenhuma alteração para salvar')
        return
      }

      const res = await fetch(`/api/keys/${key.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('save_failed')

      toast.success('Alterações salvas com sucesso!')
      setEditMaxDevices('')
      setEditExpiryDays('')
      setEditDiscordId('')
      setEditLabel('')
      setEditOwner('')
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto page-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[rgb(20,20,20)] pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/keys')}
            className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-zinc-400 hover:text-white rounded-xl h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#ff2d8d]">
                DETALHES DA LICENÇA
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              {key.label ?? 'Cliente sem label'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OwnerBadge owner={key.created_by} />
          <Badge variant="outline" className={statusConfig[effectiveStatus].className}>
            {statusConfig[effectiveStatus].label}
          </Badge>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-xl bg-black/60 border border-[rgb(20,20,20)] px-4 py-3 font-mono text-sm text-white select-all">
            {key.key}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyKey}
            className="h-11 w-11 rounded-xl border border-[rgb(20,20,20)] bg-white/5 text-zinc-400 hover:text-[#ff2d8d] hover:border-[#ff2d8d]/30"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono">Dono / Operador</span>
            <div className="mt-0.5">
              <OwnerBadge owner={key.created_by} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono">Criada em</span>
            <span className="text-sm text-white font-medium">{formatDate(key.created_at)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono">Expira em</span>
            <span className="text-sm text-white font-medium">{formatDate(key.expires_at)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono">Dias Restantes</span>
            <span className={`text-sm font-semibold font-mono ${daysLeft <= 0 ? 'text-rose-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-[#ff2d8d]'}`}>
              {daysLeft <= 0 ? 'Expirada' : `${daysLeft} dias`}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono">Dispositivos</span>
            <span className="text-sm text-white font-medium font-mono">{hwids.length}/{key.max_devices}</span>
          </div>
        </div>

        {key.discord_id && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-black/40 border border-[rgb(20,20,20)] p-3">
            <MessageSquare className="h-4 w-4 text-[#ff2d8d]" />
            <span className="text-xs text-zinc-400 font-mono">Discord ID:</span>
            <code className="font-mono text-xs text-white">{key.discord_id}</code>
          </div>
        )}
        {key.notes && (
          <div className="mt-3 rounded-xl bg-black/40 border border-[rgb(20,20,20)] p-3">
            <span className="text-xs text-zinc-400 font-mono">Notas:</span>
            <p className="mt-1 text-xs text-zinc-200">{key.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="border-[rgb(20,20,20)] bg-[#0a0a0d] text-white hover:bg-white/5 rounded-xl h-10 text-xs font-mono"
          onClick={handleBanToggle}
        >
          {key.status === 'banned' ? (
            <><CheckCircle className="mr-2 h-4 w-4 text-[#ff2d8d]" />Reativar</>
          ) : (
            <><Ban className="mr-2 h-4 w-4 text-rose-400" />Banir</>
          )}
        </Button>
        <Button
          variant="outline"
          className="border-[rgb(20,20,20)] bg-[#0a0a0d] text-white hover:bg-white/5 rounded-xl h-10 text-xs font-mono"
          onClick={handlePauseToggle}
        >
          {key.status === 'paused' ? (
            <><CheckCircle className="mr-2 h-4 w-4 text-[#ff2d8d]" />Despausar</>
          ) : (
            <><Pause className="mr-2 h-4 w-4 text-amber-400" />Pausar</>
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[rgb(20,20,20)] bg-[#0a0a0d] text-white hover:bg-white/5 rounded-xl h-10 text-xs font-mono"
            >
              <RotateCcw className="mr-2 h-4 w-4 text-[#ff2d8d]" />
              Resetar HWIDs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white rounded-2xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Resetar HWIDs?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400 text-xs">
                Todos os {hwids.length} dispositivos vinculados serão desvinculados para permitir novos PCs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-[rgb(20,20,20)] bg-black/60 text-white rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetHWIDs} className="btn-primary rounded-xl font-bold">Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl h-10 text-xs font-mono"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar Key
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white rounded-2xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Deletar Key permanentemente?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400 text-xs">
                Esta ação apagará a licença e todo o histórico vinculado de forma definitiva.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-[rgb(20,20,20)] bg-black/60 text-white rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteKey} className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-bold">Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d8d]" />
          Editar Parâmetros da Key
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Hash className="h-3.5 w-3.5 text-[#ff2d8d]" />Label / Nome do Cliente
            </Label>
            <Input
              placeholder={key.label ?? 'Sem label'}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 rounded-xl focus-visible:border-[#ff2d8d] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Monitor className="h-3.5 w-3.5 text-[#ff2d8d]" />Slots HWID Máximo
            </Label>
            <Input
              type="number"
              min={1}
              placeholder={String(key.max_devices)}
              value={editMaxDevices}
              onChange={(e) => setEditMaxDevices(e.target.value)}
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 rounded-xl focus-visible:border-[#ff2d8d] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-[#ff2d8d]" />Nova Validade (dias a partir de hoje)
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="30"
              value={editExpiryDays}
              onChange={(e) => setEditExpiryDays(e.target.value)}
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 rounded-xl focus-visible:border-[#ff2d8d] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <MessageSquare className="h-3.5 w-3.5 text-[#ff2d8d]" />Discord ID
            </Label>
            <Input
              placeholder={key.discord_id ?? 'Nenhum'}
              value={editDiscordId}
              onChange={(e) => setEditDiscordId(e.target.value)}
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-600 rounded-xl focus-visible:border-[#ff2d8d] h-10 text-xs font-mono"
            />
          </div>
          {isMrcrlq && (
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <User className="h-3.5 w-3.5 text-[#ff2d8d]" />Transferir Dono / Cliente para:
              </Label>
              <Select value={editOwner || key.created_by || 'mrcrlq'} onValueChange={setEditOwner}>
                <SelectTrigger className="border border-[rgb(20,20,20)] bg-black/60 text-white rounded-xl h-10 font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white rounded-xl">
                  <SelectItem value="mrcrlq" className="font-mono text-xs cursor-pointer">mrcrlq (Meus Clientes)</SelectItem>
                  <SelectItem value="SamucaX" className="font-mono text-xs cursor-pointer">SamucaX (Clientes de Samuca)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="mt-5 btn-primary rounded-xl text-xs uppercase tracking-wider font-bold h-10 px-4 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </button>
      </div>

      {/* Connected HWIDs */}
      <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] overflow-hidden shadow-sm">
        <div className="border-b border-[rgb(20,20,20)] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Dispositivos Vinculados ({hwids.length}/{key.max_devices})
          </h2>
        </div>
        {hwids.length === 0 ? (
          <div className="p-8 text-center">
            <Monitor className="mx-auto mb-2 h-7 w-7 text-zinc-600" />
            <p className="text-xs text-zinc-400 font-mono">Nenhum dispositivo registrado ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgb(20,20,20)]">
            {hwids.map((h) => (
              <div key={h.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff2d8d]/10 border border-[#ff2d8d]/25">
                  <Monitor className="h-4 w-4 text-[#ff2d8d]" />
                </div>
                <div className="flex-1 min-w-0">
                  <code className="block truncate font-mono text-xs text-white">{h.hwid}</code>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {h.ip_address && `IP: ${h.ip_address} | `}
                    Registrado: {formatDate(h.registered_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                  onClick={() => handleRemoveHWID(h.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="rounded-2xl border border-[rgb(20,20,20)] bg-[#0a0a0d] overflow-hidden shadow-sm">
          <div className="border-b border-[rgb(20,20,20)] p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Histórico da Licença
            </h2>
          </div>
          <div className="divide-y divide-[rgb(20,20,20)]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white font-mono">{log.event_type}</p>
                  <p className="truncate text-[11px] text-zinc-400 font-mono mt-0.5">
                    {log.ip_address && `IP: ${log.ip_address}`}
                    {log.hwid && ` | HWID: ${log.hwid.slice(0, 16)}...`}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-zinc-500 font-mono">{formatDate(log.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
