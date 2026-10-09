import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { createSupabaseServerClient } from "@/lib/server-client";
import { STRIPE_PRICE_IDS, stripeClient } from "@/lib/stripe";

const allowedPlans = ["pro", "premium"] as const;
type PaidPlan = (typeof allowedPlans)[number];

function isPaidPlan(value: unknown): value is PaidPlan {
  return typeof value === "string" && allowedPlans.includes(value as PaidPlan);
}

// Expose only public price details so pricing cards match Stripe Checkout.
export async function GET() {
  try {
    const plans = await Promise.all(
      allowedPlans.map(async (plan) => {
        const price = await stripeClient.prices.retrieve(
          STRIPE_PRICE_IDS[plan],
        );
        return [
          plan,
          {
            amount:
              price.unit_amount_decimal ?? String(price.unit_amount ?? ""),
            currency: price.currency,
            interval: price.recurring?.interval ?? null,
            interval_count: price.recurring?.interval_count ?? null,
          },
        ] as const;
      }),
    );

    return NextResponse.json({ prices: Object.fromEntries(plans) });
  } catch (error) {
    console.error("Unable to load Stripe prices:", error);
    return NextResponse.json(
      { error: "Unable to load subscription prices." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the requested plan; the browser never supplies a Stripe price ID.
    let body: { plan?: unknown; community_id?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    if (!isPaidPlan(body.plan)) {
      return NextResponse.json(
        { error: "Choose a valid plan: pro or premium." },
        { status: 400 },
      );
    }

    if (
      body.community_id !== undefined &&
      (typeof body.community_id !== "string" || !body.community_id.trim())
    ) {
      return NextResponse.json(
        { error: "A valid community is required for community membership." },
        { status: 400 },
      );
    }

    // Only authenticated accounts with a valid creator/member role may pay.
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: "Could not verify your account role." },
        { status: 500 },
      );
    }

    if (
      body.community_id
        ? !profile || !["creator", "member"].includes(profile.role)
        : profile?.role !== "creator"
    ) {
      return NextResponse.json(
        {
          error: body.community_id
            ? "Only signed-in creators or members can join a community."
            : "Only creator accounts can subscribe to a platform plan.",
        },
        { status: 403 },
      );
    }

    let community: { id: string; slug: string } | null = null;
    if (typeof body.community_id === "string") {
      // Community checkouts must point at a real community and should not
      // create a second active subscription for the same member/community.
      const { data, error } = await supabase
        .from("communities")
        .select("id, slug")
        .eq("id", body.community_id)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { error: "Could not verify this community." },
          { status: 500 },
        );
      }
      if (!data) {
        return NextResponse.json(
          { error: "Community not found." },
          { status: 404 },
        );
      }
      community = data;

      const { data: existingSubscription, error: subscriptionLookupError } =
        await supabase
          .from("subscriptions")
          .select("status")
          .eq("member_id", user.id)
          .eq("community_id", community.id)
          .maybeSingle();

      if (subscriptionLookupError) {
        return NextResponse.json(
          { error: "Could not check your community membership." },
          { status: 500 },
        );
      }
      if (existingSubscription?.status === "active") {
        return NextResponse.json(
          { error: "You already have an active membership in this community." },
          { status: 409 },
        );
      }
    } else {
      // Platform-plan purchases remain creator-only and block duplicate plans.
      const { data: currentSubscription, error: currentSubscriptionError } =
        await supabase
          .from("creator_subscriptions")
          .select("status")
          .eq("creator_id", user.id)
          .maybeSingle();

      if (currentSubscriptionError) {
        return NextResponse.json(
          {
            error:
              "Could not check your current plan. Apply the creator subscriptions database migration and try again.",
          },
          { status: 500 },
        );
      }

      if (
        currentSubscription &&
        ["active", "trialing", "past_due", "incomplete"].includes(
          currentSubscription.status,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Your account already has a subscription in progress. Manage or cancel it before starting another plan.",
          },
          { status: 409 },
        );
      }
    }

    // Resolve the server-configured Stripe Price and verify it is recurring.
    const priceId = STRIPE_PRICE_IDS[body.plan];
    const price = await stripeClient.prices.retrieve(priceId);

    if (!price.active || !price.recurring) {
      return NextResponse.json(
        { error: "The selected subscription price is unavailable." },
        { status: 400 },
      );
    }

    // Stripe redirects back to these same-origin pages after checkout.
    const metadata: Stripe.MetadataParam = community
      ? {
          member_id: user.id,
          community_id: community.id,
          plan: body.plan,
        }
      : { creator_id: user.id, plan: body.plan };
    const redirectPath = community
      ? `/${encodeURIComponent(community.slug)}/feed`
      : "/dashboard/settings";

    const checkoutSession = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      success_url: `${request.nextUrl.origin}${redirectPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}${redirectPath}?checkout=cancelled`,
      metadata,
      subscription_data: {
        trial_period_days: !community && body.plan === "pro" ? 14 : undefined,
        metadata,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Unable to start checkout right now." },
      { status: 500 },
    );
  }
}
