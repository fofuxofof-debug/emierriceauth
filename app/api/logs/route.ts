import { NextResponse, type NextRequest } from 'next/server'
import { logsDb, keysDb } from '@/lib/db'
import {
  getSessionUser,
  isSamuca,
  isMrcrlq,
} from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 100
  const ownerParam = request.nextUrl.searchParams.get('owner')?.toLowerCase()
  const user = getSessionUser(request)

  let logs = await logsDb.list(limit)

  if (user && isSamuca(user.username)) {
    // Samuca só vê logs pertinentes às keys dele
    const allKeys = await keysDb.list()
    const samucaKeyIds = new Set(
      allKeys.filter((k) => isSamuca(k.created_by)).map((k) => k.id)
    )
    logs = logs.filter((l) => {
      if (l.key_id && samucaKeyIds.has(l.key_id)) return true
      const d = l.details as Record<string, unknown> | undefined
      if (d && (isSamuca(d.created_by as string) || isSamuca(d.by as string) || isSamuca(d.renewed_by as string))) {
        return true
      }
      return false
    })
  } else if (user && isMrcrlq(user.username)) {
    // mrcrlq por padrão vê seus logs, ou todos se filtrar por all
    if (!ownerParam || ownerParam === 'me' || ownerParam === 'mrcrlq') {
      const allKeys = await keysDb.list()
      const mrcrlqKeyIds = new Set(
        allKeys.filter((k) => !k.created_by || isMrcrlq(k.created_by)).map((k) => k.id)
      )
      logs = logs.filter((l) => {
        if (l.key_id && mrcrlqKeyIds.has(l.key_id)) return true
        const d = l.details as Record<string, unknown> | undefined
        if (d && (isSamuca(d.created_by as string) || isSamuca(d.by as string) || isSamuca(d.renewed_by as string))) {
          return false
        }
        return true
      })
    } else if (ownerParam === 'samuca' || ownerParam === 'samucax') {
      const allKeys = await keysDb.list()
      const samucaKeyIds = new Set(
        allKeys.filter((k) => isSamuca(k.created_by)).map((k) => k.id)
      )
      logs = logs.filter((l) => {
        if (l.key_id && samucaKeyIds.has(l.key_id)) return true
        const d = l.details as Record<string, unknown> | undefined
        return !!(d && (isSamuca(d.created_by as string) || isSamuca(d.by as string) || isSamuca(d.renewed_by as string)))
      })
    }
  }

  return NextResponse.json({ data: logs })
}
