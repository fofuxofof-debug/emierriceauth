import { NextResponse, type NextRequest } from 'next/server'
import { getSystemStatus, updateSystemStatus } from '@/lib/system-state'
import { isAuthenticated, SESSION_COOKIE_NAME } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const status = getSystemStatus()
  return NextResponse.json({ success: true, data: status })
}

export async function POST(request: NextRequest) {
  // Check admin session
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updated = updateSystemStatus(body)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'invalid_body' }, { status: 400 })
  }
}
