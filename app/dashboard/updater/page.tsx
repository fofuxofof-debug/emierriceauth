'use client'

import { useState, useRef } from 'react'
import useSWR from 'swr'
import {
  UploadCloud, FileCode, CheckCircle2, RefreshCw, Cpu, HardDrive,
  ShieldCheck, Play, ArrowUpRight, Download, Trash2, RotateCcw,
  Zap, Activity, Check, Copy, ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface BuildItem {
  name: string
  size: number
  mtime: string
  hash: string
}

export default function UpdaterPage() {
  const { data: resp, mutate, isLoading } = useSWR<{
    success: boolean
    activeBuild: BuildItem | null
    history: BuildItem[]
  }>('/api/loader/upload', fetcher, { refreshInterval: 5000 })

  const activeBuild = resp?.activeBuild
  const history = resp?.history ?? []

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [testingStream, setTestingStream] = useState(false)
  const [streamLatency, setStreamLatency] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadFile = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/loader/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Falha no upload.')
      }

      mutate()
      toast.success(`Build "${file.name}" publicada com sucesso! Todos os loaders receberão na próxima inicialização.`)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar o arquivo de atualização.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRollback = async (filename: string) => {
    try {
      const res = await fetch('/api/loader/upload', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      })
      if (!res.ok) throw new Error('Falha ao ativar')
      mutate()
      toast.success(`Build "${filename}" agora é a versão ativa em produção!`)
    } catch {
      toast.error('Erro ao ativar a versão anterior.')
    }
  }

  const handleDelete = async (filename: string) => {
    try {
      const res = await fetch(`/api/loader/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Falha ao excluir')
      mutate()
      toast.success(`Build "${filename}" excluída com sucesso.`)
    } catch {
      toast.error('Erro ao excluir o arquivo.')
    }
  }

  const handleTestStream = async () => {
    setTestingStream(true)
    const start = performance.now()
    try {
      const res = await fetch('/api/loader/download')
      const data = await res.json()
      const end = performance.now()
      setStreamLatency(Math.round(end - start))
      if (data.success) {
        toast.success(`Endpoint de update online! Latência: ${Math.round(end - start)}ms`)
      } else {
        toast.error('Nenhuma build disponível para teste.')
      }
    } catch {
      toast.error('Falha ao conectar no endpoint de update.')
    } finally {
      setTestingStream(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0])
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto page-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#15233c] pb-6 card-in">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-beacon" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-blue-400">
              DISTRIBUIÇÃO DIRETA EM MEMÓRIA (HOT-RELOAD)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f1f5f9] font-sans">
            Publicador de Atualizações
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans font-medium mt-0.5">
            Arraste seu novo executável (.exe) ou biblioteca (.dll). Quem abrir o Loader receberá a nova versão automaticamente.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleTestStream}
            disabled={testingStream}
            variant="outline"
            className="border-blue-500/30 bg-[#0e1830] text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 hover:border-blue-500/60 font-sans font-semibold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all"
          >
            {testingStream ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Activity className="h-3.5 w-3.5 mr-1.5 text-blue-400" />}
            Testar Conexão {streamLatency !== null && `(${streamLatency}ms)`}
          </Button>
        </div>
      </div>

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="card-in rounded-2xl border border-[#15233c] bg-[#0b1222] p-4.5 flex items-center gap-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#15233c] bg-blue-500/10 text-blue-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-sans uppercase tracking-wider text-slate-500 font-semibold">Versão em Produção</p>
            <p className="text-xs font-mono font-bold text-[#f1f5f9] truncate" title={activeBuild?.name ?? 'Nenhuma'}>
              {activeBuild?.name ?? 'Nenhuma build'}
            </p>
          </div>
        </div>

        <div className="card-in rounded-2xl border border-[#15233c] bg-[#0b1222] p-4.5 flex items-center gap-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#15233c] bg-blue-500/10 text-blue-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-sans uppercase tracking-wider text-slate-500 font-semibold">Tamanho do Payload</p>
            <p className="text-xs font-mono font-bold text-[#f1f5f9]">
              {activeBuild ? formatBytes(activeBuild.size) : '0 MB'}
            </p>
          </div>
        </div>

        <div className="card-in rounded-2xl border border-[#15233c] bg-[#0b1222] p-4.5 flex items-center gap-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#15233c] bg-blue-500/10 text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-sans uppercase tracking-wider text-slate-500 font-semibold">Assinatura Digital</p>
            <p className="text-xs font-mono font-bold text-[#f1f5f9]">
              {activeBuild ? `${activeBuild.hash}...` : 'Pendente'}
            </p>
          </div>
        </div>
      </div>

      {/* DRAG AND DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`card-in rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-[#15233c] bg-[#0b1222] hover:border-blue-500/40 hover:bg-[#0e1830]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".exe,.dll,.bin,.dat"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUploadFile(e.target.files[0])
            }
          }}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
          {isUploading ? (
            <RefreshCw className="h-8 w-8 animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8 text-blue-400" />
          )}
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-sans font-bold text-[#f1f5f9] mb-1">
            {isUploading ? 'Enviando e Publicando Build...' : 'Arraste o novo arquivo .EXE ou .DLL aqui'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-sans font-medium">
            ou clique para selecionar do seu computador (pasta Release / Visual Studio)
          </p>
        </div>

        <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#15233c] bg-[#0e1830] text-[11px] font-mono text-slate-400">
          <span>Formatos aceitos: .EXE, .DLL, .BIN</span>
        </div>
      </div>

      {/* ACTIVE BUILD SHOWCASE & DIRECT DOWNLOAD */}
      {activeBuild && (
        <div className="card-in rounded-2xl border border-[#15233c] bg-[#0b1222] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#15233c] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#f1f5f9]">
                Build Atualmente em Produção
              </h2>
            </div>
            <a href="/api/loader/download?download=true" download={activeBuild.name}>
              <Button
                size="sm"
                className="button-shine bg-blue-600 text-white hover:bg-blue-500 font-sans font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-blue-500/25"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Baixar Arquivo Ativo
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#15233c] bg-[#0e1830] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-500">Nome do Arquivo</span>
              <p className="text-xs font-mono font-bold text-[#f1f5f9] truncate" title={activeBuild.name}>{activeBuild.name}</p>
            </div>

            <div className="rounded-xl border border-[#15233c] bg-[#0e1830] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-500">Tamanho</span>
              <p className="text-xs font-mono font-bold text-[#f1f5f9]">{formatBytes(activeBuild.size)}</p>
            </div>

            <div className="rounded-xl border border-[#15233c] bg-[#0e1830] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-500">Assinatura SHA256</span>
              <p className="text-xs font-mono font-bold text-[#f1f5f9]">{activeBuild.hash}...</p>
            </div>

            <div className="rounded-xl border border-[#15233c] bg-[#0e1830] p-4 flex flex-col gap-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-500">Publicado em</span>
              <p className="text-xs font-mono font-bold text-[#f1f5f9]">
                {new Date(activeBuild.mtime).toLocaleDateString('pt-BR')} {new Date(activeBuild.mtime).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BUILD HISTORY & 1-CLICK ROLLBACK */}
      <div className="card-in rounded-2xl border border-[#15233c] bg-[#0b1222] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#15233c] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#f1f5f9]">
              Histórico de Versões & Rollback
            </h2>
            <p className="text-xs text-slate-400 font-sans font-medium mt-0.5">
              Se uma build apresentar instabilidade, você pode reverter para qualquer versão anterior com 1 clique.
            </p>
          </div>
          <span className="text-[11px] font-sans font-semibold text-slate-500">{history.length} builds armazenadas</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs font-sans text-slate-500">
            Nenhuma versão encontrada no histórico.
          </div>
        ) : (
          <div className="divide-y divide-[#15233c]">
            {history.map((build, i) => {
              const isCurrent = activeBuild?.name === build.name && activeBuild?.mtime === build.mtime
              return (
                <div
                  key={`${build.name}-${build.mtime}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-blue-950/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#15233c] bg-blue-500/10 text-blue-400">
                      <FileCode className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-mono font-bold text-[#f1f5f9] truncate">{build.name}</p>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-sans font-bold uppercase tracking-wider">
                            Ativa em Produção
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {formatBytes(build.size)} · SHA256: {build.hash}... · Publicado: {new Date(build.mtime).toLocaleDateString('pt-BR')} {new Date(build.mtime).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isCurrent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollback(build.name)}
                        className="h-8 border-blue-500/30 bg-[#0e1830] text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 font-sans font-semibold text-xs rounded-xl"
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                        Ativar (Rollback)
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(build.name)}
                      className="h-8 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
