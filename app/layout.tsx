import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Smooth Store — Alta Performance, Segurança & Entrega Automática',
  description: 'Plataforma oficial Smooth Store. Ativação instantânea, proteção de ponta e softwares de alto rendimento para Free Fire e Valorant.',
}

export const viewport: Viewport = {
  themeColor: '#07070a',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#07070a] text-[#f8fafc] min-h-screen selection:bg-rose-500/30 selection:text-rose-200">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#0e0e14',
              border: '1px solid #272230',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  )
}
