'use client'

import './globals.css'
import { AuthProvider } from '@/lib/supabase/auth-context'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          {/* Environment variables script */}
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                // Inject environment variables to window for easier access
                window.ENV_SUPABASE_URL = "${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}";
                window.ENV_SUPABASE_KEY = "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}";
              `
            }}
          />
        </head>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}