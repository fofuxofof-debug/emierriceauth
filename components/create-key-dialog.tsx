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
      <DialogContent className="border-zinc-800 bg-[#0e0e11] text-white sm:max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bold">Criar Nova Key</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure os parâmetros da licença
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1.5 font-mono">
              <Gamepad2 className="h-3.5 w-3.5 text-zinc-300" />
              Game
            </Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="border-zinc-800 bg-[#141418] text-white focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-[#0e0e11] text-white">
                {GAMES.map((g) => (
                  <SelectItem
                    key={g.value}
                    value={g.value}
                    className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                  >
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">User / Label</Label>
            <Input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ex: João Silva"
              className="border-zinc-800 bg-[#141418] text-white placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="field-anim flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Max Dispositivos</Label>
              <Input
                type="number"
                min={1}
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
                className="border-zinc-800 bg-[#141418] text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/40"
              />
            </div>
            <div className="field-anim flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Validade (dias)</Label>
              <Input
                type="number"
                min={1}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="border-zinc-800 bg-[#141418] text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/40"
              />
            </div>
          </div>

          <div className="field-anim flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-mono">Discord ID (Opcional)</Label>
            <Input
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="ex: 123456789012345678"
              className="border-zinc-800 bg-[#141418] text-white placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/40"
            />
            <p className="text-[11px] text-zinc-500 font-mono">
              Se preenchido, esse valor será usado como a própria key.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.25)] py-2.5 cursor-pointer"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />}
            Criar Key
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
