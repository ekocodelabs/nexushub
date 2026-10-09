"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";

type Plan = "pro" | "premium";
type StripePrice = {
  amount: string;
  currency: string;
  interval: string | null;
  interval_count: number | null;
};

const plans: {
  id: Plan;
  name: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "pro",
    name: "Pro Membership",
    description:
      "Everything you need to participate and grow with the community.",
    features: [
      "Access to members-only posts",
      "Join community discussions",
      "Recurring membership",
    ],
  },
  {
    id: "premium",
    name: "Premium Membership",
    description: "A deeper level of access for the most engaged members.",
    features: [
      "Everything in Pro",
      "Premium community resources",
      "Recurring membership",
    ],
  },
];

export default function CommunityMembershipPlans({
  communityId,
  communitySlug,
}: {
  communityId: string;
  communitySlug: string;
}) {
  const [prices, setPrices] = useState<Partial<Record<Plan, StripePrice>>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/stripe/checkout")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Could not load membership prices.");
        }
        if (active) setPrices(result.prices);
      })
      .catch((priceError: unknown) => {
        if (active) {
          setError(
            priceError instanceof Error
              ? priceError.message
              : "Could not load membership prices.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingPrices(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const startCheckout = async (plan: Plan) => {
    setLoadingPlan(plan);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, community_id: communityId }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sign in or create a member account before joining.");
        }
        throw new Error(result.error ?? "Could not start membership checkout.");
      }
      if (typeof result.url !== "string") {
        throw new Error("Stripe did not return a checkout link.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start membership checkout.",
      );
      setLoadingPlan(null);
    }
  };

  return (
    <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Membership plans
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your level of access
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Secure recurring checkout powered by Stripe. Your membership applies
            to this community only.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-400/40 bg-red-950/60 p-4 text-center text-sm text-red-100"
          >
            <p>{error}</p>
            {error.startsWith("Sign in") ? (
              <div className="mt-2 flex justify-center gap-4">
                <Link
                  href={`/login?next=${encodeURIComponent(`/${communitySlug}`)}`}
                  className="font-semibold underline underline-offset-4"
                >
                  Sign in
                </Link>
                <Link
                  href={`/register?role=member&community=${encodeURIComponent(communitySlug)}`}
                  className="font-semibold underline underline-offset-4"
                >
                  Create member account
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {plans.map((plan, index) => {
            const price = prices[plan.id];
            const amount = price ? Number(price.amount) / 100 : null;
            const formattedPrice =
              price && amount !== null
                ? new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: price.currency.toUpperCase(),
                  }).format(amount)
                : loadingPrices
                  ? "Loading price…"
                  : "Price unavailable";
            const interval = price?.interval ?? "month";
            const intervalCount = price?.interval_count ?? 1;
            const period = `${intervalCount > 1 ? `${intervalCount} ` : ""}${interval}${intervalCount > 1 ? "s" : ""}`;

            return (
              <article
                key={plan.id}
                className={`flex flex-col rounded-3xl border p-7 sm:p-8 ${
                  index === 1
                    ? "border-violet-400 bg-white text-slate-900 shadow-xl shadow-violet-950/20"
                    : "border-slate-700 bg-slate-900 text-white"
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p
                    className={`mt-2 text-sm ${index === 1 ? "text-slate-600" : "text-slate-300"}`}
                  >
                    {plan.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      {formattedPrice}
                    </span>
                    {price ? (
                      <span
                        className={
                          index === 1 ? "text-slate-500" : "text-slate-400"
                        }
                      >
                        /{period}
                      </span>
                    ) : null}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <FiCheck className="mt-0.5 shrink-0 text-violet-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => void startCheckout(plan.id)}
                  disabled={loadingPrices || !price || loadingPlan !== null}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    index === 1
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "bg-white text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "Opening secure checkout…"
                    : "Join this community"}
                  <FiArrowRight />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
