import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

/**
 * POST /api/debug-agent
 * 
 * Debug endpoint for agent creation issues
 */
export async function POST(req: NextRequest) {
  try {
    const debugLog = [];
    let user = null;
    
    // Step 1: Try to create the Supabase client
    debugLog.push('1. Creating Supabase client');
    let supabase;
    try {
      supabase = createRouteHandlerClient<Database>({ cookies });
      debugLog.push('✓ Supabase client created successfully');
    } catch (clientError) {
      debugLog.push(`✗ Error creating Supabase client: ${clientError instanceof Error ? clientError.message : String(clientError)}`);
      return NextResponse.json({ 
        success: false, 
        step: 'create_client',
        debugLog,
        error: clientError instanceof Error ? clientError.message : String(clientError)
      }, { status: 500 });
    }
    
    // Step 2: Verify authentication
    debugLog.push('2. Verifying user authentication');
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) {
        debugLog.push(`✗ Authentication error: ${authError.message}`);
        return NextResponse.json({ 
          success: false, 
          step: 'auth',
          debugLog,
          error: authError.message
        }, { status: 401 });
      }
      
      user = data.user;
      if (!user) {
        debugLog.push('✗ No user found in auth response');
        return NextResponse.json({ 
          success: false, 
          step: 'auth_user',
          debugLog,
          error: 'No user found'
        }, { status: 401 });
      }
      
      debugLog.push(`✓ User authenticated successfully: ${user.id}`);
    } catch (authError) {
      debugLog.push(`✗ Error checking authentication: ${authError instanceof Error ? authError.message : String(authError)}`);
      return NextResponse.json({ 
        success: false, 
        step: 'auth_check',
        debugLog,
        error: authError instanceof Error ? authError.message : String(authError)
      }, { status: 500 });
    }
    
    // Step 3: Parse request body
    debugLog.push('3. Parsing request body');
    let body;
    try {
      body = await req.json();
      debugLog.push(`✓ Request body parsed: ${JSON.stringify(body, null, 2)}`);
    } catch (parseError) {
      debugLog.push(`✗ Error parsing request body: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      return NextResponse.json({ 
        success: false, 
        step: 'parse_body',
        debugLog,
        error: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 400 });
    }
    
    // Step 4: Prepare agent data
    debugLog.push('4. Preparing agent data');
    const agentData = {
      name: body.name || 'Debug Test Agent',
      description: body.description || 'Created for debugging',
      type: body.type || 'gmail',
      flow_data: body.flowData || null,
      nodes: body.nodes || [],
      edges: body.edges || [],
      is_active: body.isActive !== undefined ? body.isActive : false,
      user_id: user.id,
      organization_id: body.organizationId || null,
      settings: body.settings || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    debugLog.push(`✓ Agent data prepared: ${JSON.stringify(agentData, null, 2)}`);
    
    // Step 5: Insert into database
    debugLog.push('5. Inserting into database');
    try {
      const { data, error } = await supabase
        .from('agent_flows')
        .insert([agentData])
        .select()
        .single();
      
      if (error) {
        debugLog.push(`✗ Database error: ${error.message}`);
        // Try to get more details
        if (error.details) {
          debugLog.push(`Error details: ${error.details}`);
        }
        if (error.hint) {
          debugLog.push(`Error hint: ${error.hint}`);
        }
        
        return NextResponse.json({ 
          success: false, 
          step: 'db_insert',
          debugLog,
          error: error.message,
          details: error
        }, { status: 500 });
      }
      
      debugLog.push(`✓ Agent created successfully with ID: ${data.id}`);
      return NextResponse.json({ 
        success: true, 
        agent: data,
        debugLog
      }, { status: 201 });
    } catch (dbError) {
      debugLog.push(`✗ Unexpected database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
      return NextResponse.json({ 
        success: false, 
        step: 'db_operation',
        debugLog,
        error: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 