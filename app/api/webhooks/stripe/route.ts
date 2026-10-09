import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripeClient } from "@/lib/stripe";

function createWebhookSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Stripe webhook requires NEXT_PUBLIC_SUPABASE_URL and a server-only SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function validateStripeSignature(payload: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return {
      valid: false,
      reason: "Stripe webhook signing secret is not configured.",
    };
  }

  if (!signature) {
    return {
      valid: false,
      reason: "Missing Stripe signature header.",
    };
  }

  const values = signature
    .split(",")
    .reduce<Record<string, string>>((acc, item) => {
      const [key, value] = item.split("=");
      if (key && value) acc[key] = value;
      return acc;
    }, {});

  const timestamp = values.t;
  const signedVersion = values.v1;

  if (!timestamp || !signedVersion) {
    return {
      valid: false,
      reason: "Malformed Stripe signature header.",
    };
  }

  const timestampSeconds = Number(timestamp);
  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(Date.now() / 1000 - timestampSeconds) > 300
  ) {
    return {
      valid: false,
      reason: "Stripe signature timestamp is invalid or expired.",
    };
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signedVersion, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return {
      valid: false,
      reason: "Invalid Stripe signature length.",
    };
  }

  if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return {
      valid: false,
      reason: "Invalid Stripe signature.",
    };
  }

  return { valid: true, reason: null };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const validation = validateStripeSignature(rawBody, signature);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: validation.reason,
        },
        { status: 401 },
      );
    }

    let event: Record<string, any>;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid webhook payload",
        },
        { status: 400 },
      );
    }

    const eventType = event?.type;
    const object = event?.data?.object ?? {};
    const metadata = object?.metadata ?? {};

    // Creator platform plans are stored separately from community memberships.
    const creatorId = metadata.creator_id ?? metadata.creatorId ?? null;
    const creatorPlan = metadata.plan;
    const isCreatorPlanEvent =
      eventType === "checkout.session.completed" ||
      eventType === "customer.subscription.created" ||
      eventType === "customer.subscription.updated" ||
      eventType === "customer.subscription.deleted";

    if (
      isCreatorPlanEvent &&
      creatorId &&
      (creatorPlan === "pro" || creatorPlan === "premium")
    ) {
      // A Checkout Session has a subscription ID; subscription events already
      // contain the full Stripe subscription object.
      const subscriptionId =
        typeof object.subscription === "string"
          ? object.subscription
          : (object.subscription?.id ?? object.id);

      if (!subscriptionId) {
        return NextResponse.json(
          { error: "Missing Stripe subscription ID." },
          { status: 400 },
        );
      }

      const stripeSubscription =
        eventType === "checkout.session.completed"
          ? await stripeClient.subscriptions.retrieve(subscriptionId)
          : object;
      const customerId =
        typeof stripeSubscription.customer === "string"
          ? stripeSubscription.customer
          : (stripeSubscription.customer?.id ?? null);
      const currentPeriodEnd = stripeSubscription.current_period_end
        ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
        : null;
      const supabase = createWebhookSupabaseClient();
      const { error: subscriptionError } = await supabase
        .from("creator_subscriptions")
        .upsert(
          {
            creator_id: creatorId,
            stripe_customer_id: customerId,
            stripe_subscription_id: stripeSubscription.id,
            plan: creatorPlan,
            status: stripeSubscription.status,
            current_period_end: currentPeriodEnd,
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "creator_id" },
        );

      if (subscriptionError) {
        return NextResponse.json(
          {
            error: "Failed to save creator subscription",
            details: subscriptionError.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { ok: true, event: eventType, creatorId, plan: creatorPlan },
        { status: 200 },
      );
    }

    const memberId =
      metadata.member_id ??
      metadata.memberId ??
      metadata.user_id ??
      metadata.userId ??
      object?.client_reference_id ??
      null;

    const communityId =
      metadata.community_id ??
      metadata.communityId ??
      object?.community_id ??
      null;

    const isCommunitySubscriptionEvent =
      eventType === "checkout.session.completed" ||
      eventType === "customer.subscription.created" ||
      eventType === "customer.subscription.updated" ||
      eventType === "customer.subscription.deleted";

    if (!isCommunitySubscriptionEvent) {
      return NextResponse.json(
        { received: true, event: eventType },
        { status: 200 },
      );
    }

    if (
      !memberId ||
      !communityId ||
      (metadata.plan !== "pro" && metadata.plan !== "premium")
    ) {
      return NextResponse.json(
        {
          error: "Missing subscription metadata",
          details:
            "Expected member_id, community_id, and a valid plan in the metadata.",
        },
        { status: 400 },
      );
    }

    // Checkout completion and later subscription lifecycle events may carry
    // different objects, so retrieve the Stripe subscription for its period end.
    const membershipSubscriptionId =
      typeof object.subscription === "string"
        ? object.subscription
        : (object.subscription?.id ?? object.id);

    if (!membershipSubscriptionId) {
      return NextResponse.json(
        { error: "Missing Stripe subscription ID." },
        { status: 400 },
      );
    }

    const membershipSubscription =
      eventType === "checkout.session.completed"
        ? await stripeClient.subscriptions.retrieve(membershipSubscriptionId)
        : object;
    const stripeStatus = membershipSubscription.status;
    const membershipStatus =
      eventType === "customer.subscription.deleted" ||
      stripeStatus === "canceled" ||
      stripeStatus === "unpaid"
        ? "cancelled"
        : stripeStatus === "incomplete_expired"
          ? "expired"
          : stripeStatus === "active" || stripeStatus === "trialing"
            ? "active"
            : "pending";
    const supabase = createWebhookSupabaseClient();
    const expiresAt = membershipSubscription.current_period_end
      ? new Date(membershipSubscription.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          member_id: memberId,
          community_id: communityId,
          plan: metadata.plan,
          status: membershipStatus,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "member_id,community_id",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to upsert subscription",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        event: eventType,
        subscription: data,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: message,
      },
      { status: 500 },
    );
  }
}
