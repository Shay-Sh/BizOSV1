/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com'],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Define public variables for client-side usage - ensure Edge runtimes have access
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || ''
  },
  
  // Add redirects for any direct routes to their proper app/(app) versions
  async redirects() {
    return [
      // Redirect direct routes to their /app prefixed versions
      {
        source: '/agents',
        destination: '/app/agents',
        permanent: true,
      },
      {
        source: '/agents/:path*',
        destination: '/app/agents/:path*',
        permanent: true,
      },
      {
        source: '/workflows',
        destination: '/app/workflows',
        permanent: true,
      },
      {
        source: '/workflows/:path*',
        destination: '/app/workflows/:path*',
        permanent: true,
      },
      {
        source: '/analytics',
        destination: '/app/analytics',
        permanent: true,
      },
      {
        source: '/conversations',
        destination: '/app/conversations',
        permanent: true,
      },
      {
        source: '/messages',
        destination: '/app/messages',
        permanent: true,
      },
      {
        source: '/knowledge',
        destination: '/app/knowledge',
        permanent: true,
      },
      {
        source: '/knowledge/:path*',
        destination: '/app/knowledge/:path*',
        permanent: true,
      },
      {
        source: '/approvals',
        destination: '/app/approvals',
        permanent: true,
      },
      {
        source: '/calendar',
        destination: '/app/calendar',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/app/settings',
        permanent: true,
      },
      {
        source: '/settings/:path*',
        destination: '/app/settings/:path*',
        permanent: true,
      },
      {
        source: '/workspace',
        destination: '/app/workspace',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/app',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig 