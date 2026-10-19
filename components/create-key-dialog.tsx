'use client'

import React, { useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Gamepad2 } from 'lucide-react'
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
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [user, setUser] = useState('')
  const [maxDevices, setMaxDevices] = useState('1')
  const [expiryDays, setExpiryDays] = useState('30')
  const [discordId, setDiscordId] = useState('')
  const [product, setProduct] = useState<string>('freefire')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const days = Math.max(Number.parseInt(expiryDays) || 30, 1)
      const devices = Math.max(Number.parseInt(maxDevices) || 1, 1)

      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: user || null,
          max_devices: devices,
          expires_in_days: days,
          discord_id: discordId || null,
          custom_key: discordId || null,
          product,
        }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Erro ao criar key')
      }
      const data = await res.json()
      toast.success(`${data.count} key(s) criada(s) com sucesso!`)

      setUser('')
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#15233c] bg-[#0b1222] text-[#f1f5f9] sm:max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#f1f5f9] font-bold">Criar Nova Key</DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Configure os parâmetros da licença
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8] inline-flex items-center gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5 text-[#60a5fa]" />
              Game
            </Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="border-[#15233c] bg-[#0e1830] text-[#f1f5f9] focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#15233c] bg-[#0b1222] text-[#f1f5f9]">
                {GAMES.map((g) => (
                  <SelectItem
                    key={g.value}
                    value={g.value}
                    className="text-[#cbd5e1] focus:bg-[#0e1830] focus:text-[#60a5fa] cursor-pointer"
                  >
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">User / Label</Label>
            <Input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ex: João Silva"
              className="border-[#15233c] bg-[#0e1830] text-[#f1f5f9] placeholder:text-[#64748b] focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#3b82f6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="field-anim flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">Max Dispositivos</Label>
              <Input
                type="number"
                min={1}
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
                className="border-[#15233c] bg-[#0e1830] text-[#f1f5f9] focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#3b82f6]"
              />
            </div>
            <div className="field-anim flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">Validade (dias)</Label>
              <Input
                type="number"
                min={1}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="border-[#15233c] bg-[#0e1830] text-[#f1f5f9] focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#3b82f6]"
              />
            </div>
          </div>

          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">Discord ID (Opcional)</Label>
            <Input
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="ex: 123456789012345678"
              className="border-[#15233c] bg-[#0e1830] text-[#f1f5f9] placeholder:text-[#64748b] focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#3b82f6]"
            />
            <p className="text-[11px] text-[#64748b]">
              Se preenchido, esse valor será usado como a própria key.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#3b82f6] text-white hover:bg-[#2563eb] font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.97] shadow-md shadow-blue-500/20 py-2.5 cursor-pointer"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Key
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
