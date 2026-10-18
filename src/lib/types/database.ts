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
          price_cents: number;
          verification_status: "draft" | "reviewing" | "verified" | "archived";
          verified_at: string | null;
          verified_by: string | null;
          active_plan_version_id: string | null;
          featured_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      project_requirements: {
        Row: {
          id: string;
          project_id: string;
          min_area_sq_mm: number;
          target_area_sq_mm: number;
          min_tile_count: number;
          recommended_tile_count: number;
          min_tile_length_mm: number;
          max_tile_length_mm: number | null;
          min_tile_width_mm: number;
          max_tile_width_mm: number | null;
          min_tile_thickness_mm: number;
          max_tile_thickness_mm: number;
          allowed_conditions: string[];
          allowed_materials: string[];
          requires_straight_cuts: boolean;
          requires_curved_cuts: boolean;
          is_outdoor_rated: boolean;
          is_wet_area_rated: boolean;
          allow_irregular_shards: boolean;
          nominal_piece_length_mm: number | null;
          nominal_piece_width_mm: number | null;
          grout_joint_width_mm: number;
          waste_safety_factor: number;
          created_at: string;
          updated_at: string;
        };
      };
      project_plan_versions: {
        Row: {
          id: string;
          project_id: string;
          version_number: number;
          version_label: string;
          storage_path: string;
          file_size_bytes: number;
          sha256_checksum: string;
          page_count: number;
          changelog: string | null;
          is_active: boolean;
          created_at: string;
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
