"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

/**
 * Interactive Earning Calculator Component
 * Calculates community monetization projections based on active members and price per month.
 */
export default function EarningsCalculatorLayout() {
  const [memberCount, setMemberCount] = useState<number>(250);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(35);

  // Calculations
  const grossMonthlyEarnings = memberCount * monthlyPrice;
  const grossAnnualEarnings = grossMonthlyEarnings * 12;

  return (
    <section id="calculator" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Monetization Potential
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            How Much Could You Earn With Your Community?
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Adjust the sliders below to estimate your potential recurring income
            when shifting from social followers to a paid community model.
          </p>
        </div>

        {/* Calculator Widget Wrapper */}
        <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-7 space-y-8">
              {/* Slider 1: Member Count */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Active Paid Members
                  </label>
                  <span className="text-xl font-bold text-blue-400 font-mono">
                    {memberCount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="5000"
                  step="10"
                  value={memberCount}
                  onChange={(e) => setMemberCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>20 members</span>
                  <span>5,000 members</span>
                </div>
              </div>

              {/* Slider 2: Subscription Price */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Monthly Membership Fee
                  </label>
                  <span className="text-xl font-bold text-blue-400 font-mono">
                    ${monthlyPrice}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>$5/mo</span>
                  <span>$250/mo</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                <FiInfo className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Based on industry benchmarks showing a typical 1% - 3%
                  conversion rate from free followers to paid recurring
                  community members.
                </span>
              </div>
            </div>

            {/* Right Display: Earnings Output */}
            <div className="lg:col-span-5 bg-linear-to-b from-blue-950/80 to-slate-900 border border-blue-800/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-center lg:text-left relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
                    Estimated Monthly Revenue
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-mono tracking-tight">
                    ${grossMonthlyEarnings.toLocaleString()}
                    <span className="text-base font-normal text-slate-400">
                      /mo
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                    Estimated Annual Revenue
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-300 mt-1 font-mono">
                    ${grossAnnualEarnings.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">
                      /yr
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?role=creator"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-600/30"
              >
                <span>Claim This Revenue</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
