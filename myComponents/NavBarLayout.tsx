"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/browser-client";

type AccountLink = {
  label: string;
  href: string;
};

/**
 * Navbar Component
 * Features sticky backdrop blur, responsive mobile drawer menu,
 * logo asset rendering via Next.js Image component, and conversion actions.
 */
export default function NavBarLayout() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [accountLink, setAccountLink] = useState<AccountLink | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let isMounted = true;

    const loadAccountLink = async (user: User | null) => {
      if (!user) {
        if (isMounted) {
          setAccountLink(null);
          setIsAuthLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const role = profile?.role ?? user.user_metadata?.role;

      if (role === "creator") {
        if (isMounted) {
          setAccountLink({ label: "Dashboard", href: "/dashboard" });
          setIsAuthLoading(false);
        }
        return;
      }

      if (role === "member") {
        if (isMounted) {
          setAccountLink({ label: "Community feed", href: "/feed" });
          setIsAuthLoading(false);
        }
        return;
      }

      if (isMounted) {
        setAccountLink(null);
        setIsAuthLoading(false);
      }
    };

    void supabase.auth.getUser().then(({ data: { user } }) => {
      void loadAccountLink(user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // The auth event supplies the user session; avoid auth API calls inside
      // this callback to prevent re-entering Supabase's auth lock.
      void loadAccountLink(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Track scroll position to enhance navbar border and background density
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Monetization", href: "#calculator" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl"
          : "bg-slate-950/40 backdrop-blur-sm py-5 border-b border-slate-900/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <Image
                src="/logo.svg"
                alt="Platform Logo"
                width={24}
                height={24}
                priority
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Nexus<span className="text-blue-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Authentication Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthLoading && accountLink ? (
              <Link
                href={accountLink.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20"
              >
                <span>{accountLink.label}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            ) : !isAuthLoading ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register?role=creator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-500/40"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-blue-400 py-2 border-b border-slate-900"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            {!isAuthLoading && accountLink ? (
              <Link
                href={accountLink.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
              >
                {accountLink.label}
              </Link>
            ) : !isAuthLoading ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-slate-800 text-slate-200 font-semibold text-sm bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/register?role=creator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
                >
                  Get Started Free
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
