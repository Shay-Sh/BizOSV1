import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// Gmail OAuth 2.0 configuration
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '';
const GMAIL_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`;

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Get the URL parameters
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Check for errors in the OAuth process
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/agent-builder?error=${encodeURIComponent(error)}`
    );
  }
  
  // Verify state parameter to prevent CSRF attacks
  const storedState = cookies().get('gmail_oauth_state')?.value;
  const userId = cookies().get('gmail_oauth_user_id')?.value;
  
  if (!state || !storedState || state !== storedState || !userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/agent-builder?error=${encodeURIComponent('Invalid state parameter')}`
    );
  }
  
  // Clear the state and user ID cookies
  cookies().delete('gmail_oauth_state');
  cookies().delete('gmail_oauth_user_id');
  
  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/agent-builder?error=${encodeURIComponent('Authorization code missing')}`
    );
  }
  
  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        redirect_uri: GMAIL_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange code for tokens: ${JSON.stringify(errorData)}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Calculate token expiration time
    const expiresIn = tokenData.expires_in || 3600; // Default to 1 hour if not provided
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    
    // Store the tokens in the database
    const { data: existingToken, error: fetchError } = await supabase
      .from('gmail_auth_tokens')
      .select('*') // Select all fields to get the refresh_token
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'no rows returned' error
      throw new Error(`Error fetching existing token: ${fetchError.message}`);
    }
    
    // If a token already exists for this user, update it
    if (existingToken) {
      const { error: updateError } = await supabase
        .from('gmail_auth_tokens')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || existingToken.refresh_token, // Keep old refresh token if not provided
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingToken.id);
      
      if (updateError) {
        throw new Error(`Error updating token: ${updateError.message}`);
      }
    } else {
      // Otherwise, insert a new token
      const { error: insertError } = await supabase
        .from('gmail_auth_tokens')
        .insert({
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (insertError) {
        throw new Error(`Error inserting token: ${insertError.message}`);
      }
    }
    
    // Redirect back to the agent builder page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/agent-builder?success=Gmail connected successfully`
    );
    
  } catch (error) {
    console.error('Error in Gmail OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/agent-builder?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`
    );
  }
} 