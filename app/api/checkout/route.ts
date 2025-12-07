import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "price_1SZrmGBXZ8A3C1p61dODogsO", // dari Stripe Dashboard
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    customer_email: data.user.email,
    metadata: {
      supabaseUserId: data.user.id,
      email: data.user.email ?? "",
    },
  });

  return NextResponse.json({ url: session.url, id: session.id });
}
