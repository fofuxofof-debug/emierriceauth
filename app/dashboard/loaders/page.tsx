'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Download, Flame, Crosshair, Target, Cpu, ExternalLink, Check, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LicenseKey } from '@/lib/types'

interface LoaderVariant {
  id: string
  name: string
  description: string
  version: string
  size: string
}

interface LoaderProduct {
  game: string
  productId: string
  tag: string
  icon: typeof Flame
  description: string
  variants: LoaderVariant[]
}

const products: LoaderProduct[] = [
  {
    game: 'FreeFire',
    productId: 'freefire',
    tag: 'BlueStacks · Emuladores',
    icon: Flame,
    description: 'Loader principal com bypass anti-detecção e suporte a múltiplas versões do emulador.',
    variants: [
      { id: 'basic',   name: 'Basic',   description: 'Aimbot + ESP essencial. Compatível com qualquer config.', version: '4.2.1', size: '12.4 MB' },
      { id: 'private', name: 'Private', description: 'Anti-screenshare avançado. Build individual.',          version: '4.2.1', size: '14.8 MB' },
      { id: 'remote',  name: 'Remote',  description: 'Headless. Controle total via painel web.',              version: '1.8.0', size: '8.2 MB'  },
    ],
  },
  {
    game: 'Valorant',
    productId: 'valorant',
    tag: 'Aim Color',
    icon: Crosshair,
    description: 'Aim color com trigger bot e aim assist otimizado para o anti-cheat da Riot.',
    variants: [
      { id: 'aimcolor', name: 'Aim Color', description: 'Pacote completo: aim, trigger e visuais.', version: '2.5.3', size: '6.8 MB' },
    ],
  },
  {
    game: 'CS2',
    productId: 'cs2',
    tag: 'Counter-Strike 2',
    icon: Target,
    description: 'Loader externo para CS2 com aim, ESP, radar e configs customizáveis.',
    variants: [
      { id: 'cs2', name: 'CS2 Loader', description: 'Build externo. Compatível com VAC e premier.', version: '1.3.7', size: '9.1 MB' },
    ],
  },
]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function ProductCard({ p, idx, userCount }: { p: LoaderProduct; idx: number; userCount: number }) {
  const [selected, setSelected] = useState(p.variants[0].id)
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const variant = p.variants.find((v) => v.id === selected) ?? p.variants[0]
  const Icon = p.icon

  const handleDownload = () => {
    setDownloading(true)
    setDone(false)
    setTimeout(() => {
      setDownloading(false)
      setDone(true)
      setTimeout(() => setDone(false), 2200)
    }, 1400)
  }

  return (
    <div
      className="card-in hover-lift relative overflow-hidden rounded-2xl border border-zinc-800 group bg-[#0e0e11] shadow-sm"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div
        className="flex items-center gap-3 border-b border-zinc-800 px-5 py-3 relative bg-[#141418]"
      >
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-white border border-zinc-700"
        >
          <Icon className="h-4 w-4 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{p.game}</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5 font-mono">{p.tag}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm font-mono"
          title={`${userCount} usuário${userCount === 1 ? '' : 's'} criado${userCount === 1 ? '' : 's'} para ${p.game}`}
        >
          <Users className="h-3 w-3 text-zinc-400" />
          <span className="tabular-nums">{userCount}</span>
        </span>
      </div>

      <div className="relative p-5 sm:p-6 flex flex-col gap-4">
        <p className="text-sm text-zinc-400 leading-relaxed">{p.description}</p>

        {p.variants.length > 1 ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Versão
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {p.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 font-mono ${
                    selected === v.id
                      ? 'bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                      : 'bg-[#141418] text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div
          key={variant.id}
          className="row-in rounded-lg border border-zinc-800 bg-[#141418] p-3 sm:p-4"
        >
          <p className="text-sm font-semibold text-white">{variant.name}</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{variant.description}</p>
          <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
            <span className="inline-flex items-center gap-1">
              <Cpu className="h-3 w-3 text-zinc-300" />
              v
              <span className="text-white tabular-nums">
                {variant.version}
              </span>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-white tabular-nums">
              {variant.size}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            {done ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Pronto
              </>
            ) : downloading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 mr-2 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Baixar Loader
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="border border-zinc-800 bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl text-xs uppercase font-mono"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Tutorial
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function LoadersPage() {
  const { data: keysResp } = useSWR<{ data: LicenseKey[] }>('/api/keys', fetcher, {
    refreshInterval: 30_000,
  })
  const keys = keysResp?.data ?? []

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const k of keys) {
      const p = (k.product ?? '').toLowerCase()
      if (!p) continue
      map[p] = (map[p] ?? 0) + 1
    }
    return map
  }, [keys])

  return (
    <div className="page-in flex flex-col gap-6 max-w-6xl">
      <div className="border-b border-zinc-800 pb-6 card-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">BUILDS & EXECUTÁVEIS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">Loaders & Downloads</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans font-medium">
          Builds atualizados de cada produto. Selecione a versão e baixe com proteção de integridade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.game} p={p} idx={i} userCount={counts[p.productId] ?? 0} />
        ))}
      </div>

      <p className="text-xs text-zinc-500 font-mono">
        <Download className="inline h-3 w-3 mr-1" />
        Os loaders são preparados para a versão atual do anti-cheat. Mantenha sempre atualizado.
      </p>
    </div>
  )
}
