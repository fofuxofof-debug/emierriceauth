import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Painel de Controle — Hooked Store',
  description: 'Sistema central de autenticação e gerenciamento de licenças.',
}

export const viewport: Viewport = {
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#f8fafc] text-[#0f172a] min-h-screen selection:bg-orange-500/20 selection:text-orange-600">
        {children}
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            },
          }}
        />
      </body>
    </html>
  )
}
