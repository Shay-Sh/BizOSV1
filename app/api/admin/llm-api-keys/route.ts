import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

/**
 * GET /api/admin/llm-api-keys
 * 
 * Get all LLM API keys
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to access this resource.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have admin privileges.' },
        { status: 403 }
      );
    }
    
    // Get API keys
    const { data, error } = await supabase
      .from('llm_api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json(
        { error: `Failed to fetch API keys: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ keys: data });
    
  } catch (error) {
    console.error('Unhandled error in GET /api/admin/llm-api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/llm-api-keys
 * 
 * Add a new LLM API key
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to add an API key.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have admin privileges.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }
    
    if (!body.apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }
    
    // Check if there's already an active key for this provider
    if (body.isActive !== false) {
      const { data: existingKeys } = await supabase
        .from('llm_api_keys')
        .select('id')
        .eq('provider', body.provider)
        .eq('is_active', true);
      
      // If there are existing active keys, deactivate them
      if (existingKeys && existingKeys.length > 0) {
        await supabase
          .from('llm_api_keys')
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('provider', body.provider)
          .eq('is_active', true);
      }
    }
    
    // Add the new key
    const { data, error } = await supabase
      .from('llm_api_keys')
      .insert({
        provider: body.provider,
        api_key: body.apiKey,
        is_active: body.isActive !== undefined ? body.isActive : true,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding API key:', error);
      return NextResponse.json(
        { error: `Failed to add API key: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ key: data }, { status: 201 });
    
  } catch (error) {
    console.error('Unhandled error in POST /api/admin/llm-api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/llm-api-keys
 * 
 * Update an existing LLM API key
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to update an API key.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have admin privileges.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (body.isActive !== undefined) {
      updateData.is_active = body.isActive;
      
      // If activating this key, deactivate other keys for the same provider
      if (body.isActive === true) {
        // First, get the provider for this key
        const { data: keyData, error: keyError } = await supabase
          .from('llm_api_keys')
          .select('provider')
          .eq('id', body.id)
          .single();
        
        if (!keyError && keyData) {
          // Deactivate other keys for this provider
          await supabase
            .from('llm_api_keys')
            .update({
              is_active: false,
              updated_at: new Date().toISOString(),
            })
            .eq('provider', keyData.provider)
            .eq('is_active', true)
            .neq('id', body.id);
        }
      }
    }
    
    // Update the key
    const { data, error } = await supabase
      .from('llm_api_keys')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating API key:', error);
      return NextResponse.json(
        { error: `Failed to update API key: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ key: data });
    
  } catch (error) {
    console.error('Unhandled error in PATCH /api/admin/llm-api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/llm-api-keys
 * 
 * Delete an LLM API key
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to delete an API key.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have admin privileges.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the key
    const { error } = await supabase
      .from('llm_api_keys')
      .delete()
      .eq('id', body.id);
    
    if (error) {
      console.error('Error deleting API key:', error);
      return NextResponse.json(
        { error: `Failed to delete API key: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'API key deleted successfully' }
    );
    
  } catch (error) {
    console.error('Unhandled error in DELETE /api/admin/llm-api-keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 