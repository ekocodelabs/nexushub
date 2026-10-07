"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { getSupabaseBrowserClient } from "@/lib/browser-client";

type SignupRole = "creator" | "member";

type SignupPageLayoutProps = {
  role: SignupRole;
  community: string;
};

/**
 * Sign Up Page Component
 * Split view featuring a registration form with password visibility toggle,
 * Google OAuth trigger, and a promotional feature showcase banner.
 */
export default function SignUpPageLayout({
  role,
  community,
}: SignupPageLayoutProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    communityName: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.fullName.trim(),
          role,
          community_name:
            role === "creator" ? formData.communityName.trim() : undefined,
          community_slug: community || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.details || result?.error || "Signup failed.");
      }

      setSuccess(
        role === "creator"
          ? "Your creator account and community are set up. Check your email to confirm your account."
          : "Your account is created. Check your email to confirm it, then you can join the community.",
      );
      setFormData({
        fullName: "",
        communityName: "",
        email: "",
        password: "",
        agreedToTerms: false,
      });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    if (role === "creator" && !formData.communityName.trim()) {
      setError("Enter a community name before continuing with Google.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("role", role);
    if (role === "member" && community) {
      callbackUrl.searchParams.set("community", community);
    }
    if (role === "creator") {
      callbackUrl.searchParams.set(
        "community_name",
        formData.communityName.trim(),
      );
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Brand Navigation */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/auth1.jpg"
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
        </div>

        {/* Center Form Container */}
        <div className="max-w-md w-full mx-auto my-10 space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {role === "member"
                ? "Join the community"
                : "Create your creator account"}
            </h1>
            <p className="text-sm text-slate-400">
              {role === "member"
                ? `Create an account${community ? ` to join ${community}` : " to join this community"}.`
                : "Start building your thriving paid community in less than 2 minutes."}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all duration-200"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold absolute">
              or
            </span>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {success}
              </div>
            ) : null}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {role === "creator" ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="community-name"
                  className="text-xs font-semibold text-slate-300"
                >
                  Community Name
                </label>
                <input
                  id="community-name"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="The Growth Collective"
                  value={formData.communityName}
                  onChange={(e) =>
                    setFormData({ ...formData, communityName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-slate-500">
                  We’ll create your community when your account is set up.
                </p>
              </div>
            ) : null}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder={
                  role === "member" ? "you@example.com" : "alex@creator.com"
                }
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password with Hide/Show Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.agreedToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreedToTerms: e.target.checked })
                }
                className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950"
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-400 leading-snug"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-blue-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>
                {isSubmitting
                  ? "Creating Account..."
                  : role === "member"
                    ? "Join Community"
                    : "Get Started Free"}
              </span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="text-xs text-slate-600 text-center lg:text-left">
          © NexusHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: High-End Marketing Image Showcase */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden border-l border-slate-800/80">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/30 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />

        {/* Showcase Image */}
        <div className="relative z-0 h-full w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="/assets/auth1.jpg"
            alt="Creator Community Platform Overview"
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        {/* Floating Testimonial Overlay */}
        <div className="relative z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-lg mt-6">
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
            ★★★★★
          </div>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            &ldquo;NexusHub let me migrate 3,000 members off Slack in a weekend.
            Our monthly recurring revenue grew by 40% in just two months.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              JD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Jessica Devlin</p>
              <p className="text-[11px] text-slate-400">
                Founder, DesignGuild Community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
