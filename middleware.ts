import { NextResponse, type NextRequest } from 'next/server'
import {
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
  isAuthenticated,
  getUserByUsername,
  isPathAllowedForUser,
} from '@/lib/admin-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const username = request.cookies.get(USER_COOKIE_NAME)?.value
  const isAuthed = isAuthenticated(session)

  // Ao acessar a raiz (/), vai direto para o painel de controle
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    if (isAuthed) {
      const user = username ? getUserByUsername(username) : null
      url.pathname = user?.defaultPath || '/dashboard'
    } else {
      url.pathname = '/login'
    }
    return NextResponse.redirect(url)
  }

  // Protege rotas do painel /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthed) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Usuário autenticado: validação de permissão de acesso à rota
    if (username) {
      const user = getUserByUsername(username)
      if (user && !isPathAllowedForUser(username, pathname)) {
        // Redireciona para o caminho padrão permitido do usuário (ex: /dashboard/keys)
        const url = request.nextUrl.clone()
        url.pathname = user.defaultPath
        return NextResponse.redirect(url)
      }
    }
  }

  // Se já está logado e acessa /login → redireciona para sua página padrão
  if (pathname === '/login' && isAuthed) {
    const user = username ? getUserByUsername(username) : null
    const url = request.nextUrl.clone()
    url.pathname = user?.defaultPath || '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
