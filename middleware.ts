import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // Create a response to modify
  let res = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check auth for protected routes
  const url = req.nextUrl.clone();
  const isProtectedRoute = url.pathname.startsWith('/dashboard') || 
                           url.pathname.startsWith('/agents');
  const isAuthRoute = url.pathname.startsWith('/sign-in') || 
                      url.pathname.startsWith('/sign-up');
                      
  // Redirect logic based on auth state
  if (isProtectedRoute && !session) {
    // Redirect to sign-in if trying to access protected route without session
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  } 
  
  if (isAuthRoute && session) {
    // Redirect to dashboard if already signed in
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return res;
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/agents/:path*',
    // Auth routes that redirect to dashboard if already authenticated
    '/sign-in',
    '/sign-up',
  ],
}; 