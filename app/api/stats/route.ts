import { NextResponse, type NextRequest } from 'next/server'
import { buildStats } from '@/lib/db'
import {
  getSessionUser,
  isSamuca,
  isMrcrlq,
} from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const user = getSessionUser(request)
  const ownerParam = request.nextUrl.searchParams.get('owner')?.toLowerCase()

  let filter: string | null = null
  if (user && isSamuca(user.username)) {
    filter = 'samucax'
  } else if (user && isMrcrlq(user.username)) {
    if (!ownerParam || ownerParam === 'me' || ownerParam === 'mrcrlq') {
      filter = 'mrcrlq'
    } else if (ownerParam === 'samuca' || ownerParam === 'samucax') {
      filter = 'samucax'
    } else {
      filter = null // 'all'
    }
  } else if (ownerParam) {
    filter = ownerParam
  }

  return NextResponse.json({ data: await buildStats(filter) })
}
