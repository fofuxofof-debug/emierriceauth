import { NextResponse, type NextRequest } from 'next/server'
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_VALUE,
  USER_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  isPanelConfigured,
  isAuthenticated,
  verifyAdminCredentials,
  getUserByUsername,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ONE_WEEK = 60 * 60 * 24 * 7

// POST /api/auth/session  → login
export async function POST(request: NextRequest) {
  if (!isPanelConfigured()) {
    return NextResponse.json(
      { success: false, error: 'panel_not_configured', message: 'Painel sem credenciais configuradas.' },
      { status: 500 }
    )
  }

  let body: { username?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_body' }, { status: 400 })
  }

  const username = body.username?.trim() ?? ''
  const password = body.password ?? ''

  const user = verifyAdminCredentials(username, password)
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'invalid_credentials', message: 'Usuário ou senha incorretos.' },
      { status: 401 }
    )
  }

  const isProd = process.env.NODE_ENV === 'production'
  const response = NextResponse.json({
    success: true,
    user: {
      username: user.username,
      role: user.role,
      defaultPath: user.defaultPath,
      allowedPaths: user.allowedPaths,
    },
    redirectTo: user.defaultPath,
  })

  // Cookie de sessão (httpOnly)
  response.cookies.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  })

  // Cookie do nome canônico do usuário
  response.cookies.set(USER_COOKIE_NAME, user.username, {
    httpOnly: false, // Disponível para client e server
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  })

  // Cookie da role do usuário
  response.cookies.set(ROLE_COOKIE_NAME, user.role, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  })

  return response
}

// DELETE /api/auth/session  → logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  for (const name of [SESSION_COOKIE_NAME, USER_COOKIE_NAME, ROLE_COOKIE_NAME]) {
    response.cookies.set(name, '', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }
  return response
}

// GET /api/auth/session  → status
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const username = request.cookies.get(USER_COOKIE_NAME)?.value ?? null
  const isAuthed = isAuthenticated(cookie)
  const userConfig = username ? getUserByUsername(username) : null

  return NextResponse.json({
    authenticated: isAuthed,
    user: isAuthed && userConfig
      ? {
          username: userConfig.username,
          role: userConfig.role,
          defaultPath: userConfig.defaultPath,
          allowedPaths: userConfig.allowedPaths,
        }
      : null,
  })
}
