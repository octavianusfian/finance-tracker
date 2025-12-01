import { createServerSupabase } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (!code) {
    // No code: user denied or something went wrong
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  // ✅ Session cookies are set by Supabase; redirect to your app
  return NextResponse.redirect(new URL(next, request.url));
}
