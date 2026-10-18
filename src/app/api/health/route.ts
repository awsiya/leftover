import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "leftover-tile-planner",
      environment: process.env.NODE_ENV || "development",
      supabaseConfigured: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && !env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")),
    },
    { status: 200 }
  );
}
