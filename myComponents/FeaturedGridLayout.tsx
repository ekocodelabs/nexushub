"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiLock,
  FiMessageSquare,
  FiCreditCard,
  FiVideo,
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

/**
 * Feature Grid Component
 * Highlights core platform value propositions: Paywall management,
 * real-time community chat, global Stripe payouts, and native courses.
 */
export default function FeatureGridLayout() {
  const features = [
    {
      id: "paywall",
      badge: "Monetization",
      icon: FiLock,
      title: "Smart Paywalls & Tiered Memberships",
      description:
        "Gate your content, chat rooms, and courses behind custom subscription tiers or one-off payments with zero setup code.",
      bullets: [
        "Flexible monthly, annual, or lifetime pricing tiers",
        "Free trial periods with automatic card charging",
        "Instant access revoking upon subscriber cancellation",
      ],
      previewType: "paywall-preview",
    },
    {
      id: "chat",
      badge: "Engagement",
      icon: FiMessageSquare,
      title: "Real-Time Chat & Organized Channels",
      description:
        "Ditch noisy Discord channels and messy Slack threads. Keep discussions structured with rich-text spaces, voice notes, and DM groups.",
      bullets: [
        "Nested comment threads and emoji reactions",
        "Private 1-on-1 direct messaging between members",
        "Custom moderation rules and automated spam filters",
      ],
      previewType: "chat-preview",
    },
    {
      id: "payouts",
      badge: "Finance",
      icon: FiCreditCard,
      title: "Automated Global Payouts",
      description:
        "Accept 135+ currencies and local payment methods via native Stripe integration. Manage VAT, tax collection, and refunds effortlessly.",
      bullets: [
        "Direct payouts straight into your local bank account",
        "Built-in compliance with EU VAT and global sales taxes",
        "Detailed financial analytics, MRR tracking, and churn charts",
      ],
      previewType: "payouts-preview",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-slate-950 text-white relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Engineered For Scale
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything You Need To Build A Million-Dollar Creator Business
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Stop stitching together 5 different tools. Run your community, sell
            online courses, and receive instant payouts under one unified roof.
          </p>
        </div>

        {/* Feature Cards List */}
        <div className="space-y-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 hover:border-slate-700 transition-all duration-300 shadow-xl"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
                >
                  {/* Text Content */}
                  <div
                    className={`lg:col-span-6 space-y-6 ${isEven ? "" : "lg:order-2"}`}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span>{feature.badge}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      {feature.title}
                    </h3>

                    <p className="text-slate-300 text-base leading-relaxed">
                      {feature.description}
                    </p>

                    <ul className="space-y-3 pt-2">
                      {feature.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <FiCheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* UI Preview Card Visual */}
                  <div
                    className={`lg:col-span-6 ${isEven ? "" : "lg:order-1"}`}
                  >
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
                      {/* Interactive Visual Mockup 1: Paywalls */}
                      {feature.id === "paywall" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <span className="text-xs font-semibold text-slate-400">
                              MEMBERSHIP TIERS
                            </span>
                            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Active Stripe Sync
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                              <span className="text-xs text-slate-400 font-medium">
                                Pro VIP Inner Circle
                              </span>
                              <div className="text-2xl font-black text-white">
                                $49
                                <span className="text-xs text-slate-500 font-normal">
                                  /mo
                                </span>
                              </div>
                              <span className="inline-block text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                                1,240 Members
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-2 relative">
                              <span className="text-xs text-blue-300 font-medium">
                                Mastermind Cohort
                              </span>
                              <div className="text-2xl font-black text-white">
                                $299
                                <span className="text-xs text-slate-500 font-normal">
                                  /mo
                                </span>
                              </div>
                              <span className="inline-block text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                                150 Members
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center gap-2">
                              <FiLock className="text-blue-400" />
                              Auto-gate exclusive channels & video courses
                            </span>
                            <span className="text-blue-400 font-semibold">
                              Configured
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Interactive Visual Mockup 2: Chat */}
                      {feature.id === "chat" && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              AK
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-200">
                                  Alex K.
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  12:42 PM
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate">
                                Just launched my first cohort! Thanks for the
                                feedback everyone 🎉
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-blue-950/40 rounded-xl border border-blue-500/30 ml-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              YOU
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-blue-300">
                                  You (Host)
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  12:44 PM
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 truncate">
                                Congrats Alex! Pinning this in the wins channel!
                                🔥
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <span className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800">
                              👍 24
                            </span>
                            <span className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800">
                              🚀 48
                            </span>
                            <span className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800">
                              ❤️ 19
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Interactive Visual Mockup 3: Payouts */}
                      {feature.id === "payouts" && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-end bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-xs text-slate-400 font-medium">
                                Payout Balance
                              </span>
                              <div className="text-3xl font-black text-white font-mono mt-1">
                                $18,420.00
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                              <FiTrendingUp className="w-3.5 h-3.5" />
                              <span>+28.4% this month</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/50 text-slate-300">
                              <span>Next Scheduled Payout</span>
                              <span className="font-mono text-white font-medium">
                                Tomorrow, 09:00 AM
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/50 text-slate-300">
                              <span>Payout Bank</span>
                              <span className="font-mono text-slate-400">
                                Chase Bank (•••• 8921)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
