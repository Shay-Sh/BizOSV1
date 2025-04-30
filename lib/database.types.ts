export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agent_execution_logs: {
        Row: {
          id: string
          agent_id: string
          status: string
          start_time: string
          end_time: string | null
          error_message: string | null
          execution_details: Json | null
          triggered_by: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          status: string
          start_time?: string
          end_time?: string | null
          error_message?: string | null
          execution_details?: Json | null
          triggered_by?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          status?: string
          start_time?: string
          end_time?: string | null
          error_message?: string | null
          execution_details?: Json | null
          triggered_by?: string | null
          user_id?: string | null
        }
      }
      agent_flows: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          flow_data: Json | null
          nodes: Json | null
          edges: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
          last_run_at: string | null
          user_id: string | null
          organization_id: string | null
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: string
          flow_data?: Json | null
          nodes?: Json | null
          edges?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_run_at?: string | null
          user_id?: string | null
          organization_id?: string | null
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          flow_data?: Json | null
          nodes?: Json | null
          edges?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_run_at?: string | null
          user_id?: string | null
          organization_id?: string | null
          settings?: Json | null
        }
      }
      agent_schedules: {
        Row: {
          id: string
          agent_id: string
          frequency: string
          interval: number
          is_active: boolean
          last_run_at: string | null
          next_run_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          frequency: string
          interval: number
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          frequency?: string
          interval?: number
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gmail_auth_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string
          token_type: string
          scope: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token: string
          token_type: string
          scope: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string
          token_type?: string
          scope?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      llm_api_keys: {
        Row: {
          id: string
          provider: string
          api_key: string
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          provider: string
          api_key: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          provider?: string
          api_key?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 