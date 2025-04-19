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
      words: {
        Row: {
          id: string
          arabic: string
          root: string | null
          english: string
          ayah: string
          surah: string
          ayah_number: number
          audio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          arabic: string
          root?: string | null
          english: string
          ayah: string
          surah: string
          ayah_number: number
          audio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          arabic?: string
          root?: string | null
          english?: string
          ayah?: string
          surah?: string
          ayah_number?: number
          audio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_words: {
        Row: {
          id: string
          user_id: string
          word_id: string
          status: string
          ease_factor: number
          interval: number
          notes: string | null
          last_reviewed: string | null
          next_review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          status?: string
          ease_factor?: number
          interval?: number
          notes?: string | null
          last_reviewed?: string | null
          next_review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          status?: string
          ease_factor?: number
          interval?: number
          notes?: string | null
          last_reviewed?: string | null
          next_review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          words_learned: number
          words_mastered: number
          current_streak: number
          longest_streak: number
          last_activity_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          words_learned?: number
          words_mastered?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          words_learned?: number
          words_mastered?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}