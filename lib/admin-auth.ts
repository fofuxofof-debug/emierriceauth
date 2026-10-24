// =============================================================================
// Auth do PAINEL admin (não confundir com auth da API pra C++).
// Suporta múltiplos usuários com controle granular de permissões por rota.
// Compatível com runtime Node e Edge (middleware) — não usa node:crypto.
// =============================================================================

import type { NextRequest } from 'next/server'

function readEnv(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : undefined
}

export type UserRole = 'admin' | 'moderator'

export interface UserCred {
  username: string
  password: string
  role: UserRole
  allowedPaths: string[] // ['*'] para total, ou caminhos permitidos específicos
  defaultPath: string
}

// Lista de usuários autorizados no painel
export const USERS: UserCred[] = [
  {
    username: 'mrcrlq',
    password: '1964f',
    role: 'admin',
    allowedPaths: ['*'], // Acesso irrestrito a todas as abas
    defaultPath: '/dashboard',
  },
  {
    username: 'SamucaX',
    password: 'Bebela',
    role: 'moderator',
    allowedPaths: [
      '/dashboard/keys',
      '/dashboard/logs',
      '/dashboard/system',
    ], // Apenas Keys, Logs e Parar/Status
    defaultPath: '/dashboard/keys',
  },
]

const AUTH_SECRET = readEnv('AUTH_SECRET') ?? 'dev_secret_unsafe_change_me'

export const SESSION_COOKIE_NAME = 'panel_session'
export const USER_COOKIE_NAME = 'panel_user'
export const ROLE_COOKIE_NAME = 'panel_role'

export const SESSION_COOKIE_VALUE = `panel:${AUTH_SECRET.slice(0, 48)}`

export function isPanelConfigured(): boolean {
  return USERS.length > 0
}

export function getUserByUsername(username: string): UserCred | undefined {
  if (!username) return undefined
  const clean = username.trim().toLowerCase()
  return USERS.find((u) => {
    const uName = u.username.toLowerCase()
    return uName === clean || (uName === 'samucax' && clean === 'samuca')
  })
}

export function isSamuca(username?: string | null): boolean {
  if (!username) return false
  const lower = username.trim().toLowerCase()
  return lower === 'samucax' || lower === 'samuca'
}

export function isMrcrlq(username?: string | null): boolean {
  if (!username) return false
  const lower = username.trim().toLowerCase()
  return lower === 'mrcrlq'
}

export function canAccessKey(user: UserCred | null | undefined, keyOwner: string | null | undefined): boolean {
  if (!user) return true
  if (user.role === 'admin') return true
  if (isSamuca(user.username)) {
    return isSamuca(keyOwner)
  }
  return (keyOwner || '').toLowerCase() === user.username.toLowerCase()
}

export function getSessionUser(request: NextRequest): UserCred | null {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!isAuthenticated(session)) return null
  const username = request.cookies.get(USER_COOKIE_NAME)?.value
  if (!username) return null
  return getUserByUsername(username) ?? null
}

export function verifyAdminCredentials(username: string, password: string): UserCred | null {
  if (!isPanelConfigured()) return null
  const user = getUserByUsername(username)
  if (user && user.password === password) {
    return user
  }
  return null
}

export function isAuthenticated(cookieValue: string | undefined | null): boolean {
  if (!cookieValue) return false
  return cookieValue === SESSION_COOKIE_VALUE
}

export function isPathAllowedForUser(username: string | undefined | null, pathname: string): boolean {
  if (!username) return false
  const user = getUserByUsername(username)
  if (!user) return false

  // Se o usuário tem permissão total ('*')
  if (user.allowedPaths.includes('*')) return true

  // Verifica se o caminho atual começa com algum dos caminhos permitidos
  return user.allowedPaths.some(
    (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`)
  )
}
