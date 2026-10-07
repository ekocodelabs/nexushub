"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiTwitter,
  FiYoutube,
  FiInstagram,
  FiGithub,
  FiArrowRight,
  FiCheck,
  FiGlobe,
} from "react-icons/fi";

/**
 * Footer Component
 * Provides comprehensive legal, social, category navigation, and branding assets.
 */
export default function FooterLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="NexusHub Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Nexus<span className="text-blue-500">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The all-in-one community, course, and monetization OS built for
              creators, educators, and digital leaders. Own your audience
              forever.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Subscribe to Creator Weekly
              </span>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 max-w-md"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1"
                >
                  <span>Join</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-blue-400 transition-colors"
                >
                  Community Chat
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-blue-400 transition-colors"
                >
                  Course LMS
                </Link>
              </li>
              <li>
                <Link
                  href="#calculator"
                  className="hover:text-blue-400 transition-colors"
                >
                  Monetization Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-blue-400 transition-colors"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Changelog & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Creator Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/migration"
                  className="hover:text-blue-400 transition-colors"
                >
                  Migration Service
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="hover:text-blue-400 transition-colors"
                >
                  Developer API
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-blue-400 transition-colors"
                >
                  Official Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-blue-400 transition-colors"
                >
                  Security & Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Social Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          {/* Copyright Notice & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span>© {currentYear} NexusHub, Inc. All rights reserved.</span>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-white p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <FiTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-white p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <FiYoutube className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <FiInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
