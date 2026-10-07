"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiHelpCircle, FiMessageCircle } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

/**
 * Interactive FAQ Component
 * Addresses objection points, SEO questions, and creator concerns.
 */
export default function FAQLayout() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Migration",
      question:
        "Can I migrate my existing community from Mighty Networks, Circle, or Teachable?",
      answer:
        "Yes! We provide free automated migration utilities and dedicated concierge migration support for communities with over 500 members. You can import member email lists, course structures, videos, and subscription data seamlessly without losing revenue.",
    },
    {
      category: "Payouts & Payments",
      question: "How do payouts work, and what payment gateways are supported?",
      answer:
        "We connect directly with your Stripe account. Earnings from subscriptions, course sales, or paid events are deposited automatically into your bank account according to your Stripe payout schedule (typically daily or weekly). We support 135+ currencies and local credit cards.",
    },
    {
      category: "Mobile Access",
      question: "Do my members get access to a mobile app?",
      answer:
        "Yes, your community is completely accessible via iOS and Android apps. Members can receive instant push notifications, participate in chat rooms, listen to audio modules on the go, and watch video courses seamlessly from their mobile devices.",
    },
    {
      category: "Branding",
      question: "Can I use my own custom domain and branding colors?",
      answer:
        "Absolutely. On Pro and Enterprise plans, you can map your custom domain (e.g., community.yourbrand.com), upload your custom logo and favicons, and customize primary accent colors to reflect your unique brand identity.",
    },
    {
      category: "Fees",
      question:
        "Are there any hidden transaction fees on course sales or subscriptions?",
      answer:
        "On our Pro Growth and Enterprise plans, we charge 0% platform transaction fees. You only pay standard credit card processing fees via Stripe (typically 2.9% + 30¢ per transaction). On our Starter tier, a minimal 2.9% platform fee applies.",
    },
    {
      category: "Hosting & Video",
      question:
        "Do I need to pay for separate video hosting like Vimeo or Wistia?",
      answer:
        "No. Unlimited video hosting and streaming bandwidth are included natively in all plans. Upload high-definition 1080p videos directly to your courses, events, and community feeds without paying third-party hosting charges.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to know about setting up your community,
            managing payouts, and migrating your platform.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-100 pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-lg bg-slate-900 text-blue-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-blue-600 text-white" : ""}`}
                  >
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-900 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Hook */}
        <div className="mt-16 text-center bg-slate-950/60 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="text-lg font-bold text-white">
              Have more questions?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Our creator support team is available 24/7 to assist with
              migration questions.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all shrink-0 border border-slate-700"
          >
            <FiMessageCircle className="w-4 h-4 text-blue-400" />
            <span>Chat With Support</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
