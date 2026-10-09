import Stripe from "stripe";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

export const STRIPE_PRICE_IDS = {
  premium: "price_1UOIJmJy29PHjKOYkx2y2UKv",
  pro: "price_1UOIL1Jy29PHjKOYn3Ut1eKQ",
} as const;

export type StripePriceId =
  (typeof STRIPE_PRICE_IDS)[keyof typeof STRIPE_PRICE_IDS];
