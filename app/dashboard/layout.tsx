import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard-shell'
import {
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
  isAuthenticated,
  getUserByUsername,
} from '@/lib/admin-auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!isAuthenticated(session)) {
    redirect('/login')
  }

  const username = cookieStore.get(USER_COOKIE_NAME)?.value || 'admin'
  const userConfig = getUserByUsername(username)

  const shellUser = {
    id: 'panel-user',
    email: userConfig?.username || username,
    role: userConfig?.role || 'admin',
    allowedPaths: userConfig?.allowedPaths || ['*'],
  }

  return <DashboardShell user={shellUser}>{children}</DashboardShell>
}
