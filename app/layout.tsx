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
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="light" style={{ colorScheme: 'light' }}>
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased bg-[#f8fafc] text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900`}>
        {children}
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgb(255, 255, 255)',
              border: '1px solid rgb(226, 232, 240)',
              color: 'rgb(15, 23, 42)',
            },
          }}
        />
      </body>
    </html>
  )
}
