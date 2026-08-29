import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getLatestBuild() {
  const dir = path.join(process.cwd(), 'builds')
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir)
  if (files.length === 0) return null

  let latestPath: string | null = null
  let latestMtime = 0

  for (const f of files) {
    const full = path.join(dir, f)
    const stat = fs.statSync(full)
    if (stat.isFile() && stat.mtimeMs > latestMtime) {
      latestMtime = stat.mtimeMs
      latestPath = full
    }
  }

  if (!latestPath) return null
  const buffer = fs.readFileSync(latestPath)
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')

  return {
    filename: path.basename(latestPath),
    buffer,
    size: fs.statSync(latestPath).size,
    hash: hash.slice(0, 16),
    mtime: latestMtime,
  }
}

// Retorna info da versao mais recente (JSON)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const download = searchParams.get('download')

  const build = getLatestBuild()
  if (!build) {
    return NextResponse.json({ success: false, error: 'no_build_available' }, { status: 404 })
  }

  // Se pedir download=true, baixa o arquivo .exe/.dll binário
  if (download === 'true' || download === '1') {
    return new NextResponse(build.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${build.filename}"`,
        'Content-Length': build.size.toString(),
        'X-Build-Hash': build.hash,
      },
    })
  }

  // Senao, retorna info em JSON
  return NextResponse.json({
    success: true,
    filename: build.filename,
    size: build.size,
    hash: build.hash,
    mtime: build.mtime,
  })
}
