import type { Metadata } from "next";
import Layout from "@/components/Layout";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Finance Tracker (Premium)",
  description: "As Premium member Track your income and expenses easily",
};

export default async function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: {
      supabaseId: data.user.id,
    },
  });

  if (!user?.isPremium) redirect("/");

  return <>{children}</>;
}
