'use client'

import { use, useState, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { getDaysRemaining, formatDate } from '@/lib/keys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OwnerBadge } from '@/components/keys-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Copy,
  Ban,
  Pause,
  RotateCcw,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  Monitor,
  MessageSquare,
  Clock,
  Hash,
  User,
} from 'lucide-react'
import type { LicenseKey, HWID, AuthLog } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface KeyDetailsResponse {
  data: {
    key: LicenseKey
    hwids: HWID[]
    logs: AuthLog[]
  }
}

interface SessionData {
  authenticated: boolean
  user: {
    username: string
    role: string
  } | null
}

export default function KeyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: sessionResp } = useSWR<SessionData>('/api/auth/session', fetcher)
  const isMrcrlq = sessionResp?.user?.username?.toLowerCase() === 'mrcrlq'

  const { data: resp, error, isLoading, mutate } = useSWR<KeyDetailsResponse>(
    `/api/keys/${id}`,
    fetcher
  )
  const data = resp?.data

  const [editLabel, setEditLabel] = useState('')
  const [editMaxDevices, setEditMaxDevices] = useState('')
  const [editExpiryDays, setEditExpiryDays] = useState('')
  const [editDiscordId, setEditDiscordId] = useState('')
  const [editOwner, setEditOwner] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (data?.key) {
      setEditLabel(data.key.label ?? '')
      setEditMaxDevices(String(data.key.max_devices))
      setEditDiscordId(data.key.discord_id ?? '')
      setEditOwner(data.key.created_by ?? 'mrcrlq')
    }
  }, [data?.key])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 p-16 rounded-2xl border border-slate-200 bg-white max-w-lg mx-auto shadow-sm">
        <p className="text-sm text-rose-600 font-mono">Chave não encontrada ou acesso não autorizado.</p>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/keys')}
          className="border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl"
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
    active:  { label: 'Ativa',    className: 'border-orange-200 bg-orange-50 text-[#ea580c] font-mono text-xs' },
    expired: { label: 'Expirada', className: 'border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs' },
    banned:  { label: 'Banida',   className: 'border-rose-200 bg-rose-50 text-rose-600 line-through font-mono text-xs' },
    paused:  { label: 'Pausada',  className: 'border-amber-200 bg-amber-50 text-amber-600 font-mono text-xs' },
  } as const

  const copyKey = () => {
    navigator.clipboard.writeText(key.key)
    toast.success('Key copiada!')
  }

  const handleBanToggle = async () => {
    const newStatus = key.status === 'banned' ? 'active' : 'banned'
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Falha ao alterar status')
      toast.success(newStatus === 'banned' ? 'Key banida' : 'Key desbanida')
      mutate()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  const handlePauseToggle = async () => {
    const newStatus = key.status === 'paused' ? 'active' : 'paused'
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Falha ao alterar status')
      toast.success(newStatus === 'paused' ? 'Key pausada' : 'Key despausada')
      mutate()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  const handleResetHWIDs = async () => {
    try {
      const res = await fetch(`/api/keys/${id}/hwids`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao resetar HWIDs')
      toast.success('HWIDs resetados com sucesso')
      mutate()
    } catch {
      toast.error('Erro ao resetar HWIDs')
    }
  }

  const handleRemoveHWID = async (hwidId: string) => {
    try {
      const res = await fetch(`/api/hwids/${hwidId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao remover HWID')
      toast.success('Dispositivo removido')
      mutate()
    } catch {
      toast.error('Erro ao remover dispositivo')
    }
  }

  const handleDeleteKey = async () => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar key')
      toast.success('Key deletada permanentemente')
      router.push('/dashboard/keys')
    } catch {
      toast.error('Erro ao deletar key')
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const body: Record<string, any> = {}
      if (editLabel !== (key.label ?? '')) body.label = editLabel
      if (editMaxDevices && parseInt(editMaxDevices) !== key.max_devices) {
        body.max_devices = parseInt(editMaxDevices)
      }
      if (editExpiryDays) {
        body.expiry_days = parseInt(editExpiryDays)
      }
      if (editDiscordId !== (key.discord_id ?? '')) {
        body.discord_id = editDiscordId
      }
      if (isMrcrlq && editOwner && editOwner !== key.created_by) {
        body.created_by = editOwner
      }

      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Falha ao salvar alterações')
      toast.success('Alterações salvas!')
      setEditExpiryDays('')
      mutate()
    } catch {
      toast.error('Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto page-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/keys')}
            className="border border-slate-200 bg-white text-slate-500 hover:text-slate-900 rounded-xl h-10 w-10 shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#ea580c]">
                DETALHES DA LICENÇA
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-sm text-slate-900 font-semibold select-all">
            {key.key}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyKey}
            className="h-11 w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-orange-600 hover:border-orange-300 shadow-2xs"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-mono">Dono / Operador</span>
            <div className="mt-0.5">
              <OwnerBadge owner={key.created_by} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-mono">Criada em</span>
            <span className="text-sm text-slate-800 font-medium">{formatDate(key.created_at)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-mono">Expira em</span>
            <span className="text-sm text-slate-800 font-medium">{formatDate(key.expires_at)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-mono">Dias Restantes</span>
            <span className={`text-sm font-semibold font-mono ${daysLeft <= 0 ? 'text-rose-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-[#ea580c]'}`}>
              {daysLeft <= 0 ? 'Expirada' : `${daysLeft} dias`}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-mono">Dispositivos</span>
            <span className="text-sm text-slate-800 font-medium font-mono">{hwids.length}/{key.max_devices}</span>
          </div>
        </div>

        {key.discord_id && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-orange-50/60 border border-orange-200/60 p-3">
            <MessageSquare className="h-4 w-4 text-[#ea580c]" />
            <span className="text-xs text-slate-500 font-mono">Discord ID:</span>
            <code className="font-mono text-xs text-slate-800 font-semibold">{key.discord_id}</code>
          </div>
        )}
        {key.notes && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-xs text-slate-400 font-mono">Notas:</span>
            <p className="mt-1 text-xs text-slate-700">{key.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-10 text-xs font-mono shadow-2xs"
          onClick={handleBanToggle}
        >
          {key.status === 'banned' ? (
            <><CheckCircle className="mr-2 h-4 w-4 text-[#ea580c]" />Reativar</>
          ) : (
            <><Ban className="mr-2 h-4 w-4 text-rose-500" />Banir</>
          )}
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-10 text-xs font-mono shadow-2xs"
          onClick={handlePauseToggle}
        >
          {key.status === 'paused' ? (
            <><CheckCircle className="mr-2 h-4 w-4 text-[#ea580c]" />Despausar</>
          ) : (
            <><Pause className="mr-2 h-4 w-4 text-amber-500" />Pausar</>
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-10 text-xs font-mono shadow-2xs"
            >
              <RotateCcw className="mr-2 h-4 w-4 text-[#ea580c]" />
              Resetar HWIDs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900 font-bold">Resetar HWIDs?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-xs">
                Todos os {hwids.length} dispositivos vinculados serão desvinculados para permitir novos PCs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-slate-200 bg-slate-50 text-slate-700 rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetHWIDs} className="btn-primary rounded-xl font-bold">Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl h-10 text-xs font-mono"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar Key
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900 font-bold">Deletar Key permanentemente?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-xs">
                Esta ação apagará a licença e todo o histórico vinculado de forma definitiva.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-slate-200 bg-slate-50 text-slate-700 rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteKey} className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-bold">Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
          Editar Parâmetros da Key
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <Hash className="h-3.5 w-3.5 text-[#ea580c]" />Label / Nome do Cliente
            </Label>
            <Input
              placeholder={key.label ?? 'Sem label'}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:border-[#f97316] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <Monitor className="h-3.5 w-3.5 text-[#ea580c]" />Slots HWID Máximo
            </Label>
            <Input
              type="number"
              min={1}
              placeholder={String(key.max_devices)}
              value={editMaxDevices}
              onChange={(e) => setEditMaxDevices(e.target.value)}
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:border-[#f97316] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <Clock className="h-3.5 w-3.5 text-[#ea580c]" />Nova Validade (dias a partir de hoje)
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="30"
              value={editExpiryDays}
              onChange={(e) => setEditExpiryDays(e.target.value)}
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:border-[#f97316] h-10 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <MessageSquare className="h-3.5 w-3.5 text-[#ea580c]" />Discord ID
            </Label>
            <Input
              placeholder={key.discord_id ?? 'Nenhum'}
              value={editDiscordId}
              onChange={(e) => setEditDiscordId(e.target.value)}
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:border-[#f97316] h-10 text-xs font-mono"
            />
          </div>
          {isMrcrlq && (
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                <User className="h-3.5 w-3.5 text-[#ea580c]" />Transferir Dono / Cliente para:
              </Label>
              <Select value={editOwner || key.created_by || 'mrcrlq'} onValueChange={setEditOwner}>
                <SelectTrigger className="border border-slate-200 bg-slate-50 text-slate-900 rounded-xl h-10 font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-slate-200 bg-white text-slate-900 rounded-xl shadow-lg">
                  <SelectItem value="mrcrlq" className="font-mono text-xs cursor-pointer hover:bg-orange-50">mrcrlq (Meus Clientes)</SelectItem>
                  <SelectItem value="SamucaX" className="font-mono text-xs cursor-pointer hover:bg-orange-50">SamucaX (Clientes de Samuca)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="mt-5 btn-primary rounded-xl text-xs uppercase tracking-wider font-bold h-10 px-4 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </button>
      </div>

      {/* Connected HWIDs */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 p-5 bg-slate-50/50">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            Dispositivos Vinculados ({hwids.length}/{key.max_devices})
          </h2>
        </div>
        {hwids.length === 0 ? (
          <div className="p-8 text-center">
            <Monitor className="mx-auto mb-2 h-7 w-7 text-slate-300" />
            <p className="text-xs text-slate-400 font-mono">Nenhum dispositivo registrado ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {hwids.map((h) => (
              <div key={h.id} className="flex items-center gap-4 p-4 hover:bg-orange-50/30 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-200">
                  <Monitor className="h-4 w-4 text-[#ea580c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <code className="block truncate font-mono text-xs text-slate-900 font-semibold">{h.hwid}</code>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {h.ip_address && `IP: ${h.ip_address} | `}
                    Registrado: {formatDate(h.registered_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
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
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
              Histórico da Licença
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-orange-50/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 font-mono">{log.event_type}</p>
                  <p className="truncate text-[11px] text-slate-400 font-mono mt-0.5">
                    {log.ip_address && `IP: ${log.ip_address}`}
                    {log.hwid && ` | HWID: ${log.hwid.slice(0, 16)}...`}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-slate-400 font-mono">{formatDate(log.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
