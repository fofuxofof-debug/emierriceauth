'use client'

import { useEffect, useState } from 'react'
import { Package, Plus, Edit3, Trash2, Save, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'products_v1'

interface Product {
  id: string
  category: string
  name: string
  price: string
  period: string
  status: 'active' | 'paused'
}

const seed: Product[] = [
  { id: '1', category: 'Public',   name: 'Mensal',     price: 'R$200',   period: '/mês',    status: 'active' },
  { id: '2', category: 'Public',   name: 'Permanente', price: 'R$350',   period: 'único',   status: 'active' },
  { id: '3', category: 'Private',  name: 'Mensal',     price: 'R$700',   period: '/mês',    status: 'active' },
  { id: '4', category: 'Private',  name: 'Permanente', price: 'R$1.000', period: 'único',   status: 'active' },
  { id: '5', category: 'Remote',   name: 'Mensal',     price: 'R$400',   period: '/mês',    status: 'active' },
  { id: '6', category: 'Remote',   name: 'Permanente', price: 'R$600',   period: 'único',   status: 'active' },
  { id: '7', category: 'Valorant', name: 'Semanal',    price: 'R$50',    period: '/semana', status: 'active' },
  { id: '8', category: 'Valorant', name: 'Mensal',     price: 'R$80',    period: '/mês',    status: 'active' },
  { id: '9', category: 'Valorant', name: 'Permanente', price: 'R$120',   period: 'único',   status: 'active' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Product | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setProducts(JSON.parse(raw))
        return
      }
    } catch {}
    setProducts(seed)
  }, [])

  useEffect(() => {
    if (!products.length) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1400)
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setDraft({ ...p })
  }
  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
  }
  const saveEdit = () => {
    if (!draft) return
    setProducts((arr) => arr.map((p) => (p.id === draft.id ? draft : p)))
    cancelEdit()
    flashSaved()
  }
  const removeProduct = (id: string) => {
    setProducts((arr) => arr.filter((p) => p.id !== id))
  }
  const toggleStatus = (id: string) => {
    setProducts((arr) =>
      arr.map((p) => (p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p))
    )
  }
  const addNew = () => {
    const id = String(Date.now())
    const novo: Product = {
      id,
      category: 'Public',
      name: 'Novo plano',
      price: 'R$0',
      period: '/mês',
      status: 'paused',
    }
    setProducts((arr) => [novo, ...arr])
    setEditingId(id)
    setDraft(novo)
  }

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <div className="page-in flex flex-col gap-6 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os planos exibidos na landing pública.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-[#db00ff] font-mono">
              <Check className="h-3 w-3" />
              Salvo
            </span>
          )}
          <Button
            onClick={addNew}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo produto
          </Button>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items], gi) => (
        <div
          key={cat}
          className="card-in rounded-[0.6rem] border border-[#171819] overflow-hidden shadow-sm bg-[#101010]"
          style={{ animationDelay: `${gi * 60}ms` }}
        >
          <div
            className="flex items-center justify-between border-b border-[#171819] px-5 py-3 bg-white/[0.02]"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#db00ff] font-mono">{cat}</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
              {items.length} plano{items.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-[#171819]">
            {items.map((p, i) => {
              const isEditing = editingId === p.id && draft
              return (
                <div
                  key={p.id}
                  className="row-in flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {isEditing ? (
                    <>
                      <select
                        value={draft!.category}
                        onChange={(e) => setDraft({ ...draft!, category: e.target.value })}
                        className="rounded-[0.5rem] border border-[#171819] bg-[#101010] px-2 py-1.5 text-xs text-white outline-none focus:border-[#db00ff]"
                      >
                        {['Public', 'Private', 'Remote', 'Valorant'].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        value={draft!.name}
                        onChange={(e) => setDraft({ ...draft!, name: e.target.value })}
                        className="flex-1 min-w-0 rounded-[0.5rem] border border-[#171819] bg-[#101010] px-2 py-1.5 text-sm text-white outline-none focus:border-[#db00ff]"
                      />
                      <input
                        value={draft!.price}
                        onChange={(e) => setDraft({ ...draft!, price: e.target.value })}
                        className="w-28 rounded-[0.5rem] border border-[#171819] bg-[#101010] px-2 py-1.5 text-sm text-[#db00ff] outline-none focus:border-[#db00ff] font-mono font-bold"
                      />
                      <input
                        value={draft!.period}
                        onChange={(e) => setDraft({ ...draft!, period: e.target.value })}
                        className="w-24 rounded-[0.5rem] border border-[#171819] bg-[#101010] px-2 py-1.5 text-sm text-zinc-400 outline-none focus:border-[#db00ff]"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          onClick={saveEdit}
                          className="h-8 w-8 btn-primary"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-8 w-8 text-zinc-400 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 uppercase tracking-widest font-mono">
                          {p.category}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-lg font-black text-white tabular-nums"
                          style={{ fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}
                        >
                          {p.price}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">{p.period}</span>
                      </div>
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 border transition-colors duration-300 font-mono ${
                          p.status === 'active'
                            ? 'bg-[#db00ff]/20 text-[#db00ff] border-[#db00ff]/40 hover:bg-[#db00ff]/30'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {p.status}
                      </button>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(p)}
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-[0.5rem]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeProduct(p.id)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded-[0.5rem]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        <Package className="inline h-3 w-3 mr-1" />
        Alterações salvas localmente. Sincronização com a landing requer integração ao backend.
      </p>
    </div>
  )
}
