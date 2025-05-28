import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhogzexdeoooylwrtjhc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob2d6ZXhkZW9vb3lsd3J0amhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTM2MjMsImV4cCI6MjA2Mzg2OTYyM30.nZ-rnWqkjGovnNLd0WYFTT3kBLJnn3jV3gB3AKS3uHU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          username: string;
          email: string;
          password: string;
          first_name: string;
          last_name: string;
          avatar: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          username: string;
          email: string;
          password: string;
          first_name: string;
          last_name: string;
          avatar?: string | null;
          role?: string;
          is_active?: boolean;
        };
        Update: {
          username?: string;
          email?: string;
          password?: string;
          first_name?: string;
          last_name?: string;
          avatar?: string | null;
          role?: string;
          is_active?: boolean;
        };
      };
      communities: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          logo: string | null;
          domain: string | null;
          theme: any | null;
          owner_id: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          logo?: string | null;
          domain?: string | null;
          theme?: any | null;
          owner_id: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          logo?: string | null;
          domain?: string | null;
          theme?: any | null;
          owner_id?: number;
          is_active?: boolean;
        };
      };
      spaces: {
        Row: {
          id: number;
          name: string;
          type: string;
          description: string | null;
          community_id: number;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          type: string;
          description?: string | null;
          community_id: number;
          is_public?: boolean;
        };
        Update: {
          name?: string;
          type?: string;
          description?: string | null;
          community_id?: number;
          is_public?: boolean;
        };
      };
      posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          author_id: number;
          space_id: number;
          likes_count: number;
          comments_count: number;
          is_pinned: boolean;
          created_at: string;
        };
        Insert: {
          title: string;
          content: string;
          author_id: number;
          space_id: number;
          likes_count?: number;
          comments_count?: number;
          is_pinned?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          author_id?: number;
          space_id?: number;
          likes_count?: number;
          comments_count?: number;
          is_pinned?: boolean;
        };
      };
      events: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          location: string | null;
          is_online: boolean;
          space_id: number;
          organizer_id: number;
          attendees_count: number;
          max_attendees: number | null;
          created_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          location?: string | null;
          is_online?: boolean;
          space_id: number;
          organizer_id: number;
          attendees_count?: number;
          max_attendees?: number | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          location?: string | null;
          is_online?: boolean;
          space_id?: number;
          organizer_id?: number;
          attendees_count?: number;
          max_attendees?: number | null;
        };
      };
      member_points: {
        Row: {
          id: number;
          user_id: number;
          community_id: number;
          points: number;
          level: number;
          created_at: string;
        };
        Insert: {
          user_id: number;
          community_id: number;
          points?: number;
          level?: number;
        };
        Update: {
          user_id?: number;
          community_id?: number;
          points?: number;
          level?: number;
        };
      };
    };
  };
}