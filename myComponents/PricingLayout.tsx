"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheck, FiX, FiZap, FiArrowRight } from "react-icons/fi";

type PaidPlan = "pro" | "premium";
type StripePriceDisplay = {
  amount: string;
  currency: string;
  interval: string | null;
  interval_count: number | null;
};

/**
 * Pricing Component
 * Features transparent tiered pricing tables with annual/monthly discount toggle.
 */
export default function PricingLayout() {
  const [stripePrices, setStripePrices] = useState<
    Partial<Record<PaidPlan, StripePriceDisplay>>
  >({});
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/stripe/checkout")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load plan prices.");
        return response.json();
      })
      .then((result) => {
        if (isMounted) setStripePrices(result.prices);
      })
      .catch(() => {
        if (isMounted) {
          setCheckoutError("Plan prices could not be loaded. Please refresh.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const plans = [
    {
      name: "Starter",
      description:
        "Ideal for emerging creators launching their first paid community.",
      monthlyPrice: 39,
      popular: false,
      ctaText: "Create a creator account",
      checkoutPlan: null,
      features: [
        "Up to 500 Active Members",
        "1 Community Space & Chat Channel",
        "5 Native Video Courses",
        "2.9% + Stripe Processing Fees",
        "Standard Email Support",
        "Custom Branding & Domain",
      ],
      notIncluded: [
        "Live Streaming Integration",
        "Automated Drip Courses",
        "0% Platform Transaction Fee",
        "Dedicated Account Manager",
      ],
    },
    {
      name: "Pro Growth",
      description:
        "Designed for scaling creators & educators wanting full control and zero fees.",
      monthlyPrice: 99,
      popular: true,
      ctaText: "Start 14-Day Free Trial",
      checkoutPlan: "pro",
      features: [
        "Up to 10,000 Active Members",
        "Unlimited Chat Channels & Groups",
        "Unlimited Courses & Modules",
        "0% Platform Transaction Fee",
        "Native HD Live Streaming (1080p)",
        "Automated Drip Content & Quizzes",
        "Priority 24/7 Creator Support",
        "Custom Domain & White Label Emails",
      ],
      notIncluded: ["Dedicated Account Manager"],
    },
    {
      name: "Premium",
      description:
        "Tailored solutions for established media brands, agencies, and large cohorts.",
      monthlyPrice: 299,
      popular: false,
      ctaText: "Subscribe to Premium",
      checkoutPlan: "premium",
      features: [
        "Unlimited Active Members",
        "Unlimited Everything",
        "0% Platform Transaction Fee",
        "Dedicated Success Manager",
        "Custom API & Webhook Access",
        "Single Sign-On (SSO) Support",
        "99.9% Uptime Service Level Agreement",
        "Custom Data Migration Assistance",
      ],
      notIncluded: [],
    },
  ];

  const startCheckout = async (plan: "pro" | "premium") => {
    setCheckoutPlan(plan);
    setCheckoutError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Sign in as a creator to continue to checkout."
            : response.status === 403
              ? "This subscription is for creator accounts. Members can choose a plan from their community welcome page."
              : (result.error ?? "Unable to start checkout."),
        );
      }

      if (typeof result.url !== "string") {
        throw new Error("Stripe did not provide a checkout link.");
      }

      window.location.assign(result.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setCheckoutPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Simple Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Predictable Costs. Unlimited Growth Potential.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No hidden charges. Choose a plan that fits your growth stage and
            scale your revenue with confidence.
          </p>
        </div>

        {checkoutError ? (
          <div
            role="alert"
            className="mx-auto mb-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700"
          >
            {checkoutError}{" "}
            {checkoutError.startsWith("Sign in") ? (
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>
            ) : null}
            {checkoutError.startsWith("This subscription") ? (
              <Link href="/feed" className="ml-2 font-semibold underline">
                Find your community plans
              </Link>
            ) : null}
          </div>
        ) : null}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, idx) => {
            const stripePrice = plan.checkoutPlan
              ? stripePrices[plan.checkoutPlan as PaidPlan]
              : null;
            const amount = stripePrice
              ? Number(stripePrice.amount) / 100
              : plan.monthlyPrice;
            const formattedPrice = stripePrice
              ? new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: stripePrice.currency.toUpperCase(),
                }).format(amount)
              : plan.checkoutPlan
                ? "Loading…"
                : `$${amount}`;
            const intervalCount = stripePrice?.interval_count ?? 1;
            const interval = stripePrice?.interval;
            const billingInterval = interval
              ? `/${intervalCount > 1 ? `${intervalCount} ` : ""}${interval}${intervalCount > 1 ? "s" : ""}`
              : "/month";

            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-200 ${
                  plan.popular
                    ? "bg-slate-950 text-white border-2 border-blue-600 shadow-2xl scale-[1.02] lg:-translate-y-2"
                    : "bg-slate-50 text-slate-900 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md flex items-center gap-1">
                    <FiZap className="w-3.5 h-3.5" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Desc */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p
                      className={`text-xs leading-relaxed ${plan.popular ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Header */}
                  <div className="mb-8 pb-6 border-b border-slate-200/20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                        {formattedPrice}
                      </span>
                      <span
                        className={`text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {billingInterval}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                      Included Features
                    </span>
                    {plan.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-3 text-xs sm:text-sm"
                      >
                        <FiCheck
                          className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-blue-400" : "text-blue-600"}`}
                        />
                        <span
                          className={
                            plan.popular ? "text-slate-200" : "text-slate-700"
                          }
                        >
                          {feat}
                        </span>
                      </div>
                    ))}

                    {plan.notIncluded.map((feat, nfIdx) => (
                      <div
                        key={nfIdx}
                        className="flex items-start gap-3 text-xs sm:text-sm opacity-40"
                      >
                        <FiX className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                        <span className="line-through">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                {plan.checkoutPlan ? (
                  <button
                    type="button"
                    onClick={() =>
                      void startCheckout(plan.checkoutPlan as "pro" | "premium")
                    }
                    disabled={checkoutPlan !== null}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>
                      {checkoutPlan === plan.checkoutPlan
                        ? "Redirecting…"
                        : plan.ctaText}
                    </span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/register?role=creator"
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all text-center flex items-center justify-center gap-2"
                  >
                    <span>{plan.ctaText}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
