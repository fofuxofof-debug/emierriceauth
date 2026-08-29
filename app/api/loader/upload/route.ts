import { NextResponse, type NextRequest } from 'next/server'
import { isAuthenticated, SESSION_COOKIE_NAME } from '@/lib/admin-auth'
import { saveBuild, listBuilds, getBuildsDirectory } from '@/lib/builds-storage'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const result = listBuilds()
  return NextResponse.json({ success: true, ...result })
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) {
    return NextResponse.json({ success: false, error: 'unauthorized', message: 'Sessão expirada. Faça login novamente.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'no_file', message: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = file.name || 'loader_update.exe'

    const activeBuild = saveBuild(filename, buffer)

    return NextResponse.json({
      success: true,
      activeBuild,
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ success: false, error: 'upload_failed', message: err?.message || 'Erro interno no upload.' }, { status: 500 })
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
    const dir = getBuildsDirectory()
    const filePath = path.join(dir, filename)

    if (fs.existsSync(filePath)) {
      const now = new Date()
      fs.utimesSync(filePath, now, now)
      return NextResponse.json({ success: true, message: 'Build ativada com sucesso!' })
    }

    return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 })
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

  try {
    const dir = getBuildsDirectory()
    const filePath = path.join(dir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    return NextResponse.json({ success: true, message: 'Build excluída!' })
  } catch {
    return NextResponse.json({ success: false, error: 'file_not_found' }, { status: 404 })
  }
}
