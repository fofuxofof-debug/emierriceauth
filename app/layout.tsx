import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Painel de Controle — Hooked Store',
  description: 'Sistema central de autenticação e gerenciamento de licenças.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#000000] text-[#fafafa] min-h-screen selection:bg-[#ff2d8d]/30 selection:text-white">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0a0d',
              border: '1px solid rgb(20, 20, 20)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
