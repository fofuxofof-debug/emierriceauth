import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { isAuthenticated, SESSION_COOKIE_NAME } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getBuildsDir() {
  const p = path.join(process.cwd(), 'builds')
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
  return p
}

export async function GET() {
  const dir = getBuildsDir()
  const files = fs.readdirSync(dir)

  if (files.length === 0) {
    return NextResponse.json({ success: true, activeBuild: null, history: [] })
  }

  const allBuilds: Array<{ name: string; size: number; mtime: string; hash: string }> = []

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      const buffer = fs.readFileSync(filePath)
      const hash = crypto.createHash('sha256').update(buffer).digest('hex')
      allBuilds.push({
        name: file,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        hash: hash.slice(0, 16),
      })
    }
  }

  // Sort descending by modified date
  allBuilds.sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime())
  const activeBuild = allBuilds[0] ?? null

  return NextResponse.json({ success: true, activeBuild, history: allBuilds })
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'no_file' }, { status: 400 })
    }

    const dir = getBuildsDir()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = file.name || 'latest_build.bin'
    const filePath = path.join(dir, filename)

    fs.writeFileSync(filePath, buffer)

    const hash = crypto.createHash('sha256').update(buffer).digest('hex')

    return NextResponse.json({
      success: true,
      activeBuild: {
        name: filename,
        size: buffer.length,
        mtime: new Date().toISOString(),
        hash: hash.slice(0, 16),
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'upload_failed' }, { status: 500 })
  }
}

// Ativar uma build anterior (Rollback)
export async function PUT(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { filename } = await request.json()
    const dir = getBuildsDir()
    const filePath = path.join(dir, filename)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 })
    }

    // Touch file modified date to make it newest
    const now = new Date()
    fs.utimesSync(filePath, now, now)

    return NextResponse.json({ success: true, message: 'Build ativada com sucesso!' })
  } catch {
    return NextResponse.json({ success: false, error: 'update_failed' }, { status: 500 })
  }
}

// Excluir uma build
export async function DELETE(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ success: false, error: 'missing_filename' }, { status: 400 })
  }

  const dir = getBuildsDir()
  const filePath = path.join(dir, filename)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true, message: 'Build excluída!' })
  }

  return NextResponse.json({ success: false, error: 'file_not_found' }, { status: 404 })
}
