"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiPlay,
  FiUsers,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

/**
 * Hero Banner Component
 * Focus: High-impact hero section with primary conversion triggers,
 * vertical preview videos, and responsive layout.
 */
export default function BannerLayout() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-20 lg:pt-32 lg:pb-32">
      {/* Background Decorator Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subheading, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            {/* Social Proof Pill */}
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span>The Next-Gen Community Platform for Creators</span>
            </div> */}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Turn Your Audience Into A{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-300 to-white">
                Thriving Paid Community
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Consolidate your courses, paid memberships, live events, and group
              chats under your own branded ecosystem. Stop renting audiences;
              own your digital empire.
            </p>

            {/* Primary Action & Secondary Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register?role=creator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Free 14-Day Trial</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all duration-200 backdrop-blur-sm"
              >
                <FiPlay className="w-4 h-4 text-blue-400" />
                <span>Calculate Revenue</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-blue-400 w-4 h-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-blue-400 w-4 h-4" />
                <span>Instant Setup in 2 Mins</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-blue-400 w-4 h-4" />
                <span>0% Transaction Fees on Enterprise</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dual Vertical Videos Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center gap-4 sm:gap-6 pt-6 lg:pt-0">
            {/* Background Accent Glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* Vertical Video 1: Community Feed */}
            <div className="relative w-1/2 max-w-52.5 aspect-9/16 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/assets/hero.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-200 border border-slate-700">
                Live Feed
              </div>
            </div>

            {/* Vertical Video 2: Courses & Events */}
            <div className="relative w-1/2 max-w-52.5 aspect-9/16 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl translate-y-6 transition-transform duration-300 hover:scale-[1.02]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/assets/hero2.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
              <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white shadow-sm">
                Native Courses
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
