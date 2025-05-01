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
        </head>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
          {/* Inject environment variables using Next.js Script component which handles SSR properly */}
          <Script
            id="environment-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Inject environment variables to window for easier access
                window.ENV_SUPABASE_URL = "${supabaseUrl}";
                window.ENV_SUPABASE_KEY = "${supabaseKey}";
                console.log("Environment variables injected to window");
              `
            }}
          />
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