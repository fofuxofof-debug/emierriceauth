'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, User, Gamepad2 } from 'lucide-react'

const GAMES = [
  { value: 'freefire', label: 'Free Fire (Mobile / Emulador)' },
  { value: 'bloodstrike', label: 'Blood Strike' },
  { value: 'fivem', label: 'FiveM / GTA V' },
  { value: 'deltaforce', label: 'Delta Force' },
  { value: 'warzone', label: 'Call of Duty: Warzone' },
  { value: 'valorant', label: 'Valorant' },
  { value: 'generic', label: 'Produto Genérico' },
]

export function CreateKeyDialog({
  open,
  onOpenChange,
  onCreated,
  canAssignOwner = true,
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
  const [product, setProduct] = useState('freefire')
  const [assignedOwner, setAssignedOwner] = useState(defaultOwner)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setAssignedOwner(defaultOwner)
  }, [defaultOwner])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: user.trim() || undefined,
          quantity: parseInt(quantity, 10),
          max_devices: parseInt(maxDevices, 10),
          expiry_days: parseInt(expiryDays, 10),
          discord_id: discordId.trim() || undefined,
          product,
          created_by: assignedOwner,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao criar key')
      }

      toast.success(
        data.data && Array.isArray(data.data)
          ? `${data.data.length} keys criadas com sucesso!`
          : 'Key criada com sucesso!'
      )

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
      <DialogContent className="border border-slate-200 bg-white text-slate-900 sm:max-w-md shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 font-bold text-lg flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f97316] animate-pulse" />
            {isSamuca ? 'Criar Nova Key (Cliente do Samuca)' : 'Criar Nova Key'}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            {isSamuca
              ? 'A licença será criada e atribuída exclusivamente à carteira de clientes do Samuca.'
              : 'Configure os parâmetros de licença e atribua ao operador desejado.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {canAssignOwner && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 inline-flex items-center gap-1.5 font-mono">
                <User className="h-3.5 w-3.5 text-[#ea580c]" />
                Atribuir Cliente a
              </Label>
              <Select value={assignedOwner} onValueChange={setAssignedOwner}>
                <SelectTrigger className="border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all rounded-xl h-10 font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-slate-200 bg-white text-slate-900 rounded-xl shadow-lg">
                  <SelectItem value="mrcrlq" className="font-mono text-xs cursor-pointer hover:bg-orange-50">
                    mrcrlq (Meus Clientes)
                  </SelectItem>
                  <SelectItem value="SamucaX" className="font-mono text-xs cursor-pointer hover:bg-orange-50">
                    SamucaX (Clientes de Samuca)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 inline-flex items-center gap-1.5 font-mono">
              <Gamepad2 className="h-3.5 w-3.5 text-[#ea580c]" />
              Game / Produto
            </Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border border-slate-200 bg-white text-slate-900 rounded-xl shadow-lg">
                {GAMES.map((g) => (
                  <SelectItem
                    key={g.value}
                    value={g.value}
                    className="text-slate-800 hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-950 cursor-pointer"
                  >
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">User / Identificador do Cliente</Label>
            <Input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ex: João Silva"
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] rounded-xl h-10 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">Qtd</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!!discordId}
                className="border border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] rounded-xl h-10 font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">Slots HWID</Label>
              <Input
                type="number"
                min={1}
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
                className="border border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] rounded-xl h-10 font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">Dias</Label>
              <Input
                type="number"
                min={1}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="border border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] rounded-xl h-10 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">Discord ID (Opcional)</Label>
            <Input
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="ex: 123456789012345678"
              className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 focus-visible:border-[#f97316] rounded-xl h-10 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 font-mono">
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
