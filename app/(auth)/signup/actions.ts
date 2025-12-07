"use server";

import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function syncUser() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }
  

  try {
    await prisma.user.upsert({
      where: { email: data.user.email },
      update: {
        supabaseId: data.user.id,
      },
      create: {
        email: data.user.email as string,
        supabaseId: data.user.id,
        isPremium: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
