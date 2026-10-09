"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { getSupabaseBrowserClient } from "@/lib/browser-client";

/**
 * Login Page Component
 * Clean split view authentication form with password eye toggle and Google login.
 */
export default function LoginPageLayout() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (signInError) {
        throw signInError;
      }

      setSuccess("Signed in successfully. Redirecting to your dashboard...");
      const requestedNext = new URLSearchParams(window.location.search).get(
        "next",
      );
      const safeNext =
        requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
          ? requestedNext
          : null;

      if (safeNext) {
        router.push(safeNext);
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", signInData.user.id)
          .maybeSingle();
        router.push(profile?.role === "member" ? "/feed" : "/dashboard");
      }
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Brand Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/auth2.jpg"
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
        <div className="max-w-md w-full mx-auto my-12 space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to manage your community, courses, and payouts.
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all duration-200"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold absolute">
              or
            </span>
          </div>

          {/* Login Form */}
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

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password Field with Hide/Show Eye */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  href="/password"
                  className="text-xs text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
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

            {/* Remember Me Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950"
              />
              <label htmlFor="remember" className="text-xs text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>
                {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
              </span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Registration Link */}
          <p className="text-center text-xs text-slate-400 pt-2">
            Don&apos;t have a creator account?{" "}
            <Link
              href="/register?role=creator"
              className="text-blue-400 font-semibold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-600 text-center lg:text-left">
          © NexusHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Visual Image Banner */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 flex-col justify-center overflow-hidden border-l border-slate-800/80">
        <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="/assets/auth2.jpg"
            alt="Creator Community Analytics Showcase"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
