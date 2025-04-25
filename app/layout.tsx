'use client'

import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
} 