import { NextResponse } from 'next/server'
import { getLatestBuildBinary } from '@/lib/builds-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Retorna info da versao mais recente (JSON) ou o arquivo binario (.exe)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const download = searchParams.get('download')

  const build = getLatestBuildBinary()
  if (!build) {
    return NextResponse.json({ success: false, error: 'no_build_available', message: 'Nenhuma build configurada.' }, { status: 404 })
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
