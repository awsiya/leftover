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
      categories: {
        Row: {
          id: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          category_id: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          estimated_time_minutes: number;
          min_tile_count: number;
          min_area_sq_mm: number;
          tile_compatibility: "intact_only" | "cuts_required" | "broken_mosaic" | "any";
          is_outdoor_safe: boolean;
          is_wet_area_safe: boolean;
          price_cents: number;
          verification_status: "draft" | "reviewing" | "verified" | "archived";
          verified_at: string | null;
          verified_by: string | null;
          pdf_storage_path: string | null;
          featured_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      project_translations: {
        Row: {
          id: string;
          project_id: string;
          locale: "en" | "de" | "fr" | "es";
          title: string;
          subtitle: string;
          short_description: string;
          dimensions_summary: string;
          overview_html: string;
          safety_notes: Json;
          instructions_summary: Json;
          meta_title: string;
          meta_description: string;
          created_at: string;
          updated_at: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          project_id: string;
          customer_email: string;
          amount_cents: number;
          currency: string;
          stripe_session_id: string;
          stripe_payment_intent_id: string | null;
          status: "pending" | "completed" | "refunded" | "disputed";
          customer_country: string | null;
          created_at: string;
        };
      };
      download_tokens: {
        Row: {
          token: string;
          purchase_id: string;
          expires_at: string;
          access_count: number;
          max_access_count: number;
          last_accessed_at: string | null;
          created_at: string;
        };
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          author_name: string;
          reading_time_minutes: number;
          is_published: boolean;
          published_at: string | null;
          featured_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      article_translations: {
        Row: {
          id: string;
          article_id: string;
          locale: "en" | "de" | "fr" | "es";
          title: string;
          excerpt: string;
          content_markdown: string;
          meta_title: string;
          meta_description: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
