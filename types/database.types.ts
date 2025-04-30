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
      agent_integrations: {
        Row: {
          id: string
          agent_id: string
          integration_type: string
          integration_id: string
          config: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          integration_type: string
          integration_id: string
          config: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          integration_type?: string
          integration_id?: string
          config?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_integrations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_flows"
            referencedColumns: ["id"]
          }
        ]
      }
      agent_metrics: {
        Row: {
          id: string
          agent_id: string
          metric_type: string
          value: number
          metadata: Json
          created_at: string
          updated_at: string
          computed_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          metric_type: string
          value: number
          metadata?: Json
          created_at?: string
          updated_at?: string
          computed_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          metric_type?: string
          value?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
          computed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_flows"
            referencedColumns: ["id"]
          }
        ]
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
          user_id: string | null
          organization_id: string | null
          settings: Json | null
          created_at: string
          updated_at: string
          last_run_at: string | null
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
          user_id?: string | null
          organization_id?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
          last_run_at?: string | null
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
          user_id?: string | null
          organization_id?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
          last_run_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_flows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      gmail_auth_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gmail_auth_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      llm_api_keys: {
        Row: {
          id: string
          provider: string
          api_key: string
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider: string
          api_key: string
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: string
          api_key?: string
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      api_keys: {
        Row: {
          id: string
          name: string
          key: string
          user_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          key: string
          user_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          key?: string
          user_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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