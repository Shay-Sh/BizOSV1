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
            referencedRelation: "agents"
            referencedColumns: ["id"]
          }
        ]
      }
      agent_metrics: {
        Row: {
          id: string
          agent_id: string
          period_start: string
          period_end: string
          execution_count: number
          success_count: number
          error_count: number
          avg_execution_time: number | null
          computed_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          period_start: string
          period_end: string
          execution_count?: number
          success_count?: number
          error_count?: number
          avg_execution_time?: number | null
          computed_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          period_start?: string
          period_end?: string
          execution_count?: number
          success_count?: number
          error_count?: number
          avg_execution_time?: number | null
          computed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          }
        ]
      }
      // Additional tables would be defined here
      // This is a simplified version to get started
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