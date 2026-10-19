import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'MRC Bypass',
  description: 'Sistema de gerenciamento de licenças com HWID binding, expiração e Discord ID.',
}

export const viewport: Viewport = {
  themeColor: '#060911',
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
      <body className="font-sans antialiased bg-[#060911] text-[#f1f5f9] min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#0b1222',
              border: '1px solid #15233c',
              color: '#f1f5f9',
            },
          }}
        />
      </body>
    </html>
  )
}
