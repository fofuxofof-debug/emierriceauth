import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Smooth Store — Alta Performance, Comunidade & Segurança',
  description: 'Softwares de alto rendimento, entrega automática e suporte exclusivo. Smooth Store is not just a store but also a community.',
}

export const viewport: Viewport = {
  themeColor: '#09090b',
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
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Kanit:ital,wght@0,100..900;1,100..900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#09090b] text-[#fafafa] min-h-screen selection:bg-[#db00ff]/30 selection:text-white">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#101012',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
