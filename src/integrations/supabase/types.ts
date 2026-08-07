export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_overrides: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          forced_affiliate_id: string | null
          forced_zone: string | null
          hidden: boolean
          id: string
          lang: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          forced_affiliate_id?: string | null
          forced_zone?: string | null
          hidden?: boolean
          id?: string
          lang: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          forced_affiliate_id?: string | null
          forced_zone?: string | null
          hidden?: boolean
          id?: string
          lang?: string
          slug?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          badge_en: string | null
          badge_tr: string | null
          category: string
          commission_currency: string | null
          commission_rate: number | null
          conversion_intent: string | null
          cookie_days: number | null
          created_at: string
          creative_html: string | null
          creatives: Json
          cta_long_en: string | null
          cta_long_tr: string | null
          cta_short_en: string | null
          cta_short_tr: string | null
          default_format: string | null
          description_en: string | null
          description_tr: string | null
          enabled: boolean
          id: string
          language_restriction: string[]
          logo_color: string | null
          name: string
          priority: number
          target_pages: string[]
          target_results: string[]
          tier: number
          updated_at: string
          url_en: string | null
          url_tr: string | null
        }
        Insert: {
          badge_en?: string | null
          badge_tr?: string | null
          category: string
          commission_currency?: string | null
          commission_rate?: number | null
          conversion_intent?: string | null
          cookie_days?: number | null
          created_at?: string
          creative_html?: string | null
          creatives?: Json
          cta_long_en?: string | null
          cta_long_tr?: string | null
          cta_short_en?: string | null
          cta_short_tr?: string | null
          default_format?: string | null
          description_en?: string | null
          description_tr?: string | null
          enabled?: boolean
          id: string
          language_restriction?: string[]
          logo_color?: string | null
          name: string
          priority?: number
          target_pages?: string[]
          target_results?: string[]
          tier?: number
          updated_at?: string
          url_en?: string | null
          url_tr?: string | null
        }
        Update: {
          badge_en?: string | null
          badge_tr?: string | null
          category?: string
          commission_currency?: string | null
          commission_rate?: number | null
          conversion_intent?: string | null
          cookie_days?: number | null
          created_at?: string
          creative_html?: string | null
          creatives?: Json
          cta_long_en?: string | null
          cta_long_tr?: string | null
          cta_short_en?: string | null
          cta_short_tr?: string | null
          default_format?: string | null
          description_en?: string | null
          description_tr?: string | null
          enabled?: boolean
          id?: string
          language_restriction?: string[]
          logo_color?: string | null
          name?: string
          priority?: number
          target_pages?: string[]
          target_results?: string[]
          tier?: number
          updated_at?: string
          url_en?: string | null
          url_tr?: string | null
        }
        Relationships: []
      }
      clicks: {
        Row: {
          affiliate_id: string
          click_id: string | null
          id: number
          lang: string
          segment: string
          slug: string
          ts: string
          variant_id: string | null
        }
        Insert: {
          affiliate_id: string
          click_id?: string | null
          id?: number
          lang: string
          segment?: string
          slug: string
          ts?: string
          variant_id?: string | null
        }
        Update: {
          affiliate_id?: string
          click_id?: string | null
          id?: number
          lang?: string
          segment?: string
          slug?: string
          ts?: string
          variant_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          subject?: string
        }
        Relationships: []
      }
      conversions: {
        Row: {
          click_id: string | null
          created_at: string
          currency: string | null
          external_tx_id: string
          id: string
          partner: string
          payout_usd: number | null
          raw_payload: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          click_id?: string | null
          created_at?: string
          currency?: string | null
          external_tx_id: string
          id?: string
          partner: string
          payout_usd?: number | null
          raw_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          click_id?: string | null
          created_at?: string
          currency?: string | null
          external_tx_id?: string
          id?: string
          partner?: string
          payout_usd?: number | null
          raw_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      decisions_cache: {
        Row: {
          affiliate_ids: string[]
          cta_override: string | null
          delay_ms: number
          format: string
          generated_at: string
          lang: string
          reasoning: string | null
          segment: string
          slug: string
          zone: string
        }
        Insert: {
          affiliate_ids?: string[]
          cta_override?: string | null
          delay_ms?: number
          format?: string
          generated_at?: string
          lang: string
          reasoning?: string | null
          segment?: string
          slug: string
          zone?: string
        }
        Update: {
          affiliate_ids?: string[]
          cta_override?: string | null
          delay_ms?: number
          format?: string
          generated_at?: string
          lang?: string
          reasoning?: string | null
          segment?: string
          slug?: string
          zone?: string
        }
        Relationships: []
      }
      epc_live: {
        Row: {
          affiliate_id: string
          clicks_30d: number
          conversions_30d: number
          epc_usd: number
          revenue_30d_usd: number
          updated_at: string
          weight: number
        }
        Insert: {
          affiliate_id: string
          clicks_30d?: number
          conversions_30d?: number
          epc_usd: number
          revenue_30d_usd?: number
          updated_at?: string
          weight?: number
        }
        Update: {
          affiliate_id?: string
          clicks_30d?: number
          conversions_30d?: number
          epc_usd?: number
          revenue_30d_usd?: number
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      impressions: {
        Row: {
          affiliate_id: string
          id: number
          lang: string
          segment: string
          slug: string
          ts: string
          variant_id: string | null
        }
        Insert: {
          affiliate_id: string
          id?: number
          lang: string
          segment?: string
          slug: string
          ts?: string
          variant_id?: string | null
        }
        Update: {
          affiliate_id?: string
          id?: number
          lang?: string
          segment?: string
          slug?: string
          ts?: string
          variant_id?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          ip_address: unknown
          last_submission_at: string | null
          submission_count: number | null
        }
        Insert: {
          ip_address: unknown
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Update: {
          ip_address?: unknown
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          client_ip: unknown
          max_requests: number
          window_interval: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      subscribe_newsletter: { Args: { sub_email: string }; Returns: undefined }
      unsubscribe_newsletter_by_email: {
        Args: { unsub_email: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
