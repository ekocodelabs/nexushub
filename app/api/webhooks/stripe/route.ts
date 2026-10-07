import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  if (!webhookSecret || !signature) {
    return {
      valid: true,
      reason:
        "Webhook signature validation is skipped because no secret was configured.",
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

    const isSuccessfulCheckout =
      eventType === "checkout.session.completed" ||
      eventType === "invoice.payment_succeeded" ||
      eventType === "subscription.created" ||
      eventType === "customer.subscription.created";

    if (!isSuccessfulCheckout) {
      return NextResponse.json(
        { received: true, event: eventType },
        { status: 200 },
      );
    }

    if (!memberId || !communityId) {
      return NextResponse.json(
        {
          error: "Missing subscription metadata",
          details: "Expected member_id and community_id in the metadata.",
        },
        { status: 400 },
      );
    }

    const supabase = createWebhookSupabaseClient();
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          member_id: memberId,
          community_id: communityId,
          status: "active",
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
