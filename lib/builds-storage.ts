import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

export interface BuildFile {
  name: string
  size: number
  mtime: string
  hash: string
  buffer?: Buffer
}

// In-memory fallback cache para serverless (Vercel)
declare global {
  var __GLOBAL_BUILDS__: Map<string, { buffer: Buffer; mtime: number }> | undefined
}

if (!globalThis.__GLOBAL_BUILDS__) {
  globalThis.__GLOBAL_BUILDS__ = new Map()
}

export function getBuildsDirectory(): string {
  // Tenta pasta local 'builds'
  const localDir = path.join(process.cwd(), 'builds')
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    // Testa escrita
    const testFile = path.join(localDir, '.write_test')
    fs.writeFileSync(testFile, 'ok')
    fs.unlinkSync(testFile)
    return localDir
  } catch {
    // Se for Vercel (read-only), usa os.tmpdir()
    const tmpDir = path.join(os.tmpdir(), 'mrc_builds')
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }
    return tmpDir
  }
}

export function saveBuild(filename: string, buffer: Buffer): BuildFile {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  const now = Date.now()

  // 1. Salva em memória global
  globalThis.__GLOBAL_BUILDS__?.set(filename, { buffer, mtime: now })

  // 2. Salva em disco
  try {
    const dir = getBuildsDirectory()
    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, buffer)
  } catch (e) {
    console.error('Aviso: Falha ao salvar no disco, mantido na memória:', e)
  }

  return {
    name: filename,
    size: buffer.length,
    mtime: new Date(now).toISOString(),
    hash: hash.slice(0, 16),
  }
}

export function listBuilds(): { activeBuild: BuildFile | null; history: BuildFile[] } {
  const buildsMap = new Map<string, { size: number; mtime: number; hash: string }>()

  // 1. Lê do disco
  try {
    const dir = getBuildsDirectory()
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        if (file.startsWith('.')) continue
        const filePath = path.join(dir, file)
        try {
          const stat = fs.statSync(filePath)
          if (stat.isFile()) {
            const buf = fs.readFileSync(filePath)
            const hash = crypto.createHash('sha256').update(buf).digest('hex')
            buildsMap.set(file, {
              size: stat.size,
              mtime: stat.mtimeMs,
              hash: hash.slice(0, 16),
            })
          }
        } catch {}
      }
    }
  } catch {}

  // 2. Mescla com a memória
  if (globalThis.__GLOBAL_BUILDS__) {
    for (const [filename, item] of globalThis.__GLOBAL_BUILDS__.entries()) {
      const hash = crypto.createHash('sha256').update(item.buffer).digest('hex')
      buildsMap.set(filename, {
        size: item.buffer.length,
        mtime: item.mtime,
        hash: hash.slice(0, 16),
      })
    }
  }

  const list: BuildFile[] = []
  for (const [name, data] of buildsMap.entries()) {
    list.push({
      name,
      size: data.size,
      mtime: new Date(data.mtime).toISOString(),
      hash: data.hash,
    })
  }

  list.sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime())

  return {
    activeBuild: list[0] ?? null,
    history: list,
  }
}

export function getLatestBuildBinary(): { filename: string; buffer: Buffer; size: number; hash: string; mtime: number } | null {
  const { activeBuild } = listBuilds()
  if (!activeBuild) return null

  // 1. Tenta pegar da memória
  const inMem = globalThis.__GLOBAL_BUILDS__?.get(activeBuild.name)
  if (inMem) {
    return {
      filename: activeBuild.name,
      buffer: inMem.buffer,
      size: inMem.buffer.length,
      hash: activeBuild.hash,
      mtime: inMem.mtime,
    }
  }

  // 2. Tenta pegar do disco
  try {
    const dir = getBuildsDirectory()
    const filePath = path.join(dir, activeBuild.name)
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath)
      const stat = fs.statSync(filePath)
      return {
        filename: activeBuild.name,
        buffer,
        size: stat.size,
        hash: activeBuild.hash,
        mtime: stat.mtimeMs,
      }
    }
  } catch {}

  return null
}
