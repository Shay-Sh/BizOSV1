'use client'

import './globals.css'
import { AuthProvider } from '@/lib/supabase/auth-context'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          {children}
        </body>
      </html>
    </AuthProvider>
  )
} 