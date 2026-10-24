'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Gamepad2, User } from 'lucide-react'
import { toast } from 'sonner'

const GAMES = [
  { value: 'freefire', label: 'FreeFire' },
  { value: 'valorant', label: 'Valorant' },
  { value: 'cs2',      label: 'CS2' },
] as const

export function CreateKeyDialog({
  open,
  onOpenChange,
  onCreated,
  canAssignOwner = false,
  defaultOwner = 'mrcrlq',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  canAssignOwner?: boolean
  defaultOwner?: string
}) {
  const [user, setUser] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [maxDevices, setMaxDevices] = useState('1')
  const [expiryDays, setExpiryDays] = useState('30')
  const [discordId, setDiscordId] = useState('')
  const [product, setProduct] = useState<string>('freefire')
  const [assignedOwner, setAssignedOwner] = useState<string>(defaultOwner)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setAssignedOwner(defaultOwner)
  }, [defaultOwner, open])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const days = Math.max(Number.parseInt(expiryDays) || 30, 1)
      const devices = Math.max(Number.parseInt(maxDevices) || 1, 1)
      const qty = Math.min(Math.max(Number.parseInt(quantity) || 1, 1), 50)
      const targetOwner = canAssignOwner ? assignedOwner : (defaultOwner || 'SamucaX')

      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: user || null,
          max_devices: devices,
          expires_in_days: days,
          quantity: discordId ? 1 : qty,
          discord_id: discordId || null,
          custom_key: discordId || null,
          product,
          created_by: targetOwner,
        }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Erro ao criar key')
      }
      const data = await res.json()
      toast.success(`${data.count} key(s) criada(s) com sucesso para ${targetOwner}!`)

      setUser('')
      setQuantity('1')
      setMaxDevices('1')
      setExpiryDays('30')
      setDiscordId('')
      setProduct('freefire')
      onCreated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar key')
    } finally {
      setIsLoading(false)
    }
  }

  const isSamuca = defaultOwner === 'SamucaX' || !canAssignOwner

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white sm:max-w-md shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-lg flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff2d8d] animate-pulse" />
            {isSamuca ? 'Criar Nova Key (Cliente do Samuca)' : 'Criar Nova Key'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            {isSamuca
              ? 'A licença será criada e atribuída exclusivamente à carteira de clientes do Samuca.'
              : 'Configure os parâmetros de licença e atribua ao operador desejado.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {canAssignOwner && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1.5 font-mono">
                <User className="h-3.5 w-3.5 text-[#ff2d8d]" />
                Atribuir Cliente a
              </Label>
              <Select value={assignedOwner} onValueChange={setAssignedOwner}>
                <SelectTrigger className="border border-[rgb(20,20,20)] bg-black/60 text-white focus:ring-2 focus:ring-[#ff2d8d]/30 focus:border-[#ff2d8d] transition-all rounded-xl h-10 font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white rounded-xl">
                  <SelectItem value="mrcrlq" className="font-mono text-xs cursor-pointer">
                    mrcrlq (Meus Clientes)
                  </SelectItem>
                  <SelectItem value="SamucaX" className="font-mono text-xs cursor-pointer">
                    SamucaX (Clientes de Samuca)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1.5 font-mono">
              <Gamepad2 className="h-3.5 w-3.5 text-[#ff2d8d]" />
              Game / Produto
            </Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="border border-[rgb(20,20,20)] bg-black/60 text-white focus:ring-2 focus:ring-[#ff2d8d]/30 focus:border-[#ff2d8d] transition-all rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border border-[rgb(20,20,20)] bg-[#0a0a0d] text-white rounded-xl">
                {GAMES.map((g) => (
                  <SelectItem
                    key={g.value}
                    value={g.value}
                    className="text-zinc-300 focus:bg-[#ff2d8d] focus:text-white cursor-pointer"
                  >
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">User / Identificador do Cliente</Label>
            <Input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ex: João Silva"
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] rounded-xl h-10 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Qtd</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!!discordId}
                className="border border-[rgb(20,20,20)] bg-black/60 text-white focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] rounded-xl h-10 font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Slots HWID</Label>
              <Input
                type="number"
                min={1}
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
                className="border border-[rgb(20,20,20)] bg-black/60 text-white focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] rounded-xl h-10 font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Dias</Label>
              <Input
                type="number"
                min={1}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="border border-[rgb(20,20,20)] bg-black/60 text-white focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] rounded-xl h-10 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Discord ID (Opcional)</Label>
            <Input
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="ex: 123456789012345678"
              className="border border-[rgb(20,20,20)] bg-black/60 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-[#ff2d8d]/30 focus-visible:border-[#ff2d8d] rounded-xl h-10 font-mono text-xs"
            />
            <p className="text-[11px] text-zinc-500 font-mono">
              Se preenchido, esse valor será usado como a própria key.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full h-11 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            Criar Key
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
