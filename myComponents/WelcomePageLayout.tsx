"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiUsers,
  FiTv,
} from "react-icons/fi";

interface WelcomeProps {
  creatorName?: string;
}

/**
 * Welcome / Onboarding Page Component
 * Directs newly registered creators to their dashboard with quick orientation checklists.
 */
export default function WelcomePageLayout({
  creatorName = "Creator",
}: WelcomeProps) {
  const setupSteps = [
    {
      icon: FiUsers,
      title: "Customize Your Community Space",
      desc: "Set up chat channels, upload your logo, and pick accent colors.",
    },
    {
      icon: FiTv,
      title: "Create Your First Paid Tier or Course",
      desc: "Gate exclusive content or schedule a live video session.",
    },
    {
      icon: FiCompass,
      title: "Invite Your First Members",
      desc: "Share your unique community link with your social followers.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative z-10 space-y-8">
        {/* Header Hero Graphic */}
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-600 shadow-xl shadow-blue-600/20">
            <Image
              src="/assets/auth4.jpg"
              alt="Welcome Creator Avatar"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              Account Created Successfully
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome to NexusHub, {creatorName}! 🎉
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Your digital community platform is ready. Here are three quick
              steps to get your paid community launched today.
            </p>
          </div>
        </div>

        {/* Step Breakdown Cards */}
        <div className="space-y-3">
          {setupSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl shrink-0 mt-0.5 border border-blue-500/30">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-200 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
                <div className="text-slate-600 text-xs font-mono shrink-0">
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button to Dashboard */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FiCheckCircle className="text-blue-400 w-4 h-4" />
            <span>14-day free trial active</span>
          </div>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50"
          >
            <span>Go To Creator Dashboard</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
