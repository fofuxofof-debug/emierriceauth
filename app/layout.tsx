import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Smooth Store — Alta Performance, Comunidade & Segurança',
  description: 'Softwares de alto rendimento, entrega automática e suporte exclusivo. Smooth Store is not just a store but also a community.',
}

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
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
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300..1000;1,300..1000&family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#0c0c0c] text-[#fafafa] min-h-screen selection:bg-[#db00ff]/30 selection:text-white">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#101010',
              border: '1px solid rgb(23, 24, 25)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
