import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return NextResponse.json({ user: null });
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      supabaseId: data.user.id, // or email: data.user.email
    },
  });

  return NextResponse.json({ user: dbUser });
}
