"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";

/**
 * Reset Password Page Component
 * Handles password recovery requests and setting new credentials with eye toggle.
 */
export default function PasswordResetLayout() {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Perform password reset API call
    console.log("Resetting password for:", formData.email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Left Column: Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Brand Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/auth3.jpg"
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

        {/* Form Box */}
        <div className="max-w-md w-full mx-auto my-12 space-y-6">
          {isSubmitted ? (
            /* Success Confirmation State */
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Password Updated!
              </h2>
              <p className="text-sm text-slate-400">
                Your password has been successfully reset. You can now log in
                using your new credentials.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all mt-2"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            /* Main Form */
            <>
              <div className="space-y-2 text-center lg:text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                  <FiLock className="w-5 h-5" />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Reset your password
                </h1>
                <p className="text-sm text-slate-400">
                  Enter your email address and create a new secure password
                  below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Account Email
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

                {/* New Password Field with Eye Icon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      aria-label="Toggle Password Visibility"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field with Eye Icon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      aria-label="Toggle Password Visibility"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30 mt-2"
                >
                  Update Password
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-600 text-center lg:text-left">
          © NexusHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Visual Showcase Image */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 flex-col justify-center overflow-hidden border-l border-slate-800/80">
        <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="/assets/auth3.jpg"
            alt="Security and Community Management Platform"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
