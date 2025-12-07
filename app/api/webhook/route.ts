import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;
  if (!signature) {
    return NextResponse.json("Missing stripe-signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("event", event);
  } catch (err: any) {
    console.log("error", err);

    return NextResponse.json(`Webhook Error: ${err.message}`, { status: 400 });
  }
  console.log("Start session listener");

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email || session.metadata?.email || null;
    const supabaseUserId = session.metadata?.supabaseUserId || null;

    if (!email && !supabaseUserId) {
      console.warn("No identifiers on session, skip");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (email) {
      await prisma.user.upsert({
        where: { email },
        update: { isPremium: true },
        create: {
          email,
          isPremium: true,
          supabaseId: supabaseUserId ?? undefined,
        },
      });
    }
  }

  return NextResponse.json(null, { status: 200 });
}
