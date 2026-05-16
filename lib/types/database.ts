export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cuisines: {
        Row: {
          id: number;
          name: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cuisines"]["Insert"]>;
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          cuisine_id: number | null;
          prep_time: number | null;
          instructions: Json;
          voice_script: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          cuisine_id?: number | null;
          prep_time?: number | null;
          instructions?: Json;
          voice_script?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
      };
      ingredients: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ingredients"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
    };
  };
}

export type Cuisine = Database["public"]["Tables"]["cuisines"]["Row"];
