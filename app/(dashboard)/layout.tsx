import type { Metadata } from "next";
import Layout from "@/components/Layout";
import "../globals.css";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your income and expenses easily",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return <Layout>{children}</Layout>;
}
