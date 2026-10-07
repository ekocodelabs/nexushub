"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiLayers,
  FiShield,
  FiCpu,
} from "react-icons/fi";

/**
 * About / Business Problem Solver Component
 * Highlights creator friction points (algorithms, fragmented tools) and shows how the platform unifies business models.
 */
export default function AboutLayout() {
  const problems = [
    {
      title: "Algorithmic Invisibility",
      desc: "Social algorithms dictate who sees your content. You only reach 5% - 10% of your actual followers unless you pay for ads.",
    },
    {
      title: "Fragmented Tool Overload",
      desc: "Juggling Slack for chat, Teachable for courses, Eventbrite for calls, and Patreon for subscriptions burns profits and confuses users.",
    },
    {
      title: "Low Retention & High Churn",
      desc: "One-way content platforms lack real peer-to-peer engagement, leading to members unsubscribing after consuming a single course.",
    },
  ];

  const solutions = [
    {
      icon: FiLayers,
      title: "Unified Ecosystem",
      desc: "Combine feeds, group chats, native course modules, paid tiers, and live streams into one cohesive platform.",
    },
    {
      icon: FiShield,
      title: "100% Owned Audience Data",
      desc: "Export your customer email list, transaction logs, and member activity analytics anytime without platform lock-in.",
    },
    {
      icon: FiCpu,
      title: "Automated Onboarding & AI",
      desc: "AI co-hosts welcome new members, prompt engaging discussions, and maintain vibrant activity even when you are offline.",
    },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Why We Built This Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
            The Creator Business Model Is Broken. We Fixed It.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Building a audience on social media gives you attention—not
            ownership. Here is how we help modern creators transition from
            fragmented platforms into an automated community business.
          </p>
        </div>

        {/* Section 1: Problem vs Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Old Way vs New Way */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wide">
              <FiXCircle className="w-5 h-5" />
              <span>The Old Way (Fragmented Stack)</span>
            </div>

            <div className="space-y-4">
              {problems.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <h3 className="font-bold text-slate-900 text-lg">
                    {p.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wide">
              <FiCheckCircle className="w-5 h-5" />
              <span>The Platform Way (Unified Growth)</span>
            </div>

            <div className="space-y-4">
              {solutions.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-4"
                  >
                    <div className="p-3 bg-blue-600 text-white rounded-xl shrink-0 mt-1">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {s.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Product Solution in Action with Dual Vertical Videos */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Seamless Experience
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Engage Members Across Mobile & Desktop Native Spaces
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Whether hosting cohort-based masterclasses or sparking daily
                member discussions, give your subscribers an intuitive
                experience that keeps them coming back every day.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-blue-400 w-5 h-5 shrink-0" />
                  <span>
                    Real-time chat rooms with thread replies and reactions
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-blue-400 w-5 h-5 shrink-0" />
                  <span>
                    Integrated video course library with completion tracking
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-blue-400 w-5 h-5 shrink-0" />
                  <span>
                    Native mobile push notifications for instant engagement
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/register?role=creator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
                >
                  <span>Build Your Community Free</span>
                </Link>
              </div>
            </div>

            {/* Right Showcase: 2 Vertical Solution Videos */}
            <div className="lg:col-span-6 flex justify-center items-center gap-4 sm:gap-6">
              {/* Vertical Video 1: Mobile Community App */}
              <div className="relative w-1/2 max-w-50 aspect-9/16 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/hubabout.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-lg text-[11px] text-center text-slate-200 border border-slate-800">
                  Mobile Community
                </div>
              </div>

              {/* Vertical Video 2: Course LMS & Live Events */}
              <div className="relative w-1/2 max-w-50 aspect-9/16 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl translate-y-4">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/hubabout2.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                <div className="absolute bottom-3 left-3 right-3 bg-blue-600/90 backdrop-blur-md p-2 rounded-lg text-[11px] text-center text-white font-medium">
                  Live Workshops
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
