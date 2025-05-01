'use client'

import './globals.css'
import { AuthProvider } from '@/lib/supabase/auth-context'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get env vars safely for client-side injection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          {/* Expose Supabase config globally for any script to access */}
          <Script
            id="supabase-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Define global Supabase configuration
                window.__SUPABASE_CONFIG__ = {
                  url: "${supabaseUrl}",
                  key: "${supabaseKey}"
                };
                console.log("Supabase config exposed globally");
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