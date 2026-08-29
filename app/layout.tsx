import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
})
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'MRC Bypass',
  description: 'Sistema de gerenciamento de licenças com HWID binding, expiração e Discord ID.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased bg-[#09090b] text-neutral-100 min-h-screen selection:bg-neutral-800 selection:text-white`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgb(18,18,22)',
              border: '1px solid rgb(38,38,46)',
              color: 'rgb(245,245,245)',
            },
          }}
        />
      </body>
    </html>
  )
}
