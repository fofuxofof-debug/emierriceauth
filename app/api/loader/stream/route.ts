import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { keysDb } from '@/lib/db'
import { getSystemStatus } from '@/lib/system-state'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getLatestBuildBuffer() {
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
  return {
    filename: path.basename(latestPath),
    buffer: fs.readFileSync(latestPath),
    size: fs.statSync(latestPath).size,
  }
}

export async function POST(request: NextRequest) {
  const systemStatus = getSystemStatus()
  if (!systemStatus.auth_enabled) {
    return NextResponse.json(
      { success: false, error: 'auth_paused', message: systemStatus.maintenance_message },
      { status: 503 }
    )
  }

  let body: { key?: string; hwid?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_body' }, { status: 400 })
  }

  const { key, hwid } = body
  if (!key) {
    return NextResponse.json({ success: false, error: 'missing_key' }, { status: 400 })
  }

  // Validate Key
  const keyData = await keysDb.findByKey(key)
  if (!keyData || keyData.status === 'banned' || keyData.status === 'paused') {
    return NextResponse.json({ success: false, error: 'invalid_or_inactive_key' }, { status: 403 })
  }

  if (new Date(keyData.expires_at) <= new Date()) {
    return NextResponse.json({ success: false, error: 'key_expired' }, { status: 403 })
  }

  const build = getLatestBuildBuffer()
  if (!build) {
    return NextResponse.json(
      { success: false, error: 'no_build_available', message: 'Nenhuma build foi enviada ainda.' },
      { status: 404 }
    )
  }

  // Return raw binary stream directly to loader memory
  return new NextResponse(build.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${build.filename}"`,
      'Content-Length': build.size.toString(),
      'X-Build-Name': build.filename,
    },
  })
}
