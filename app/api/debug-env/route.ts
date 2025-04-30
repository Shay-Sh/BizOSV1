import { NextResponse } from 'next/server';

export async function GET() {
  // Only check if the variables exist, not their actual values for security
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV || 'unknown',
  };

  // Safely return partial URLs to help with debugging
  let urlHint = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    urlHint = url.substring(0, 10) + '...' + url.substring(url.length - 5);
  }

  // Return safe information
  return NextResponse.json({
    status: 'success',
    message: 'Environment variables check',
    envStatus,
    urlHint
  });
} 