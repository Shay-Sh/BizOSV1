import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// Gmail OAuth 2.0 configuration
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
const GMAIL_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`;
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
];

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized. You must be logged in to connect Gmail.' },
      { status: 401 }
    );
  }
  
  // Generate state to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in cookie for verification in callback
  cookies().set('gmail_oauth_state', state, { 
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  
  // Store user ID in cookie for callback
  cookies().set('gmail_oauth_user_id', user.id, { 
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  
  // Build the authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', GMAIL_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', GMAIL_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', GMAIL_SCOPES.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent'); // Force to get refresh token
  authUrl.searchParams.append('state', state);
  
  // Redirect to Google's OAuth 2.0 authorization endpoint
  return NextResponse.redirect(authUrl.toString());
} 