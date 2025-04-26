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
      approval_decisions: {
        Row: {
          approval_request_id: string
          comment: string | null
          decided_at: string
          decided_by: string
          decision: string
          id: string
        }
        Insert: {
          approval_request_id: string
          comment?: string | null
          decided_at?: string
          decided_by: string
          decision: string
          id?: string
        }
        Update: {
          approval_request_id?: string
          comment?: string | null
          decided_at?: string
          decided_by?: string
          decision?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_decisions_approval_request_id_fkey"
            columns: ["approval_request_id"]
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_decisions_decided_by_fkey"
            columns: ["decided_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      approval_requests: {
        Row: {
          assigned_to: string | null
          context_data: Json
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          requested_by: string
          status: string
          title: string
          updated_at: string
          workflow_execution_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          context_data?: Json
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          requested_by: string
          status?: string
          title: string
          updated_at?: string
          workflow_execution_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          context_data?: Json
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          requested_by?: string
          status?: string
          title?: string
          updated_at?: string
          workflow_execution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_bases: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_bases_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_documents: {
        Row: {
          content: string | null
          created_at: string
          created_by: string
          file_type: string | null
          file_url: string | null
          id: string
          knowledge_base_id: string
          metadata: Json
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          knowledge_base_id: string
          metadata?: Json
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          knowledge_base_id?: string
          metadata?: Json
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json
          sender_id: string
          sender_type: string
          type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json
          sender_id: string
          sender_type: string
          type?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          sender_id?: string
          sender_type?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      // Add existing tables from your database here
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