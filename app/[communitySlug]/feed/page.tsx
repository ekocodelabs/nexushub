import Link from "next/link";
import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/server-client";
import CommunityFeedPosts from "@/myComponents/CommunityFeedPosts";

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: community } = await supabase
    .from("communities")
    .select("id, name, description")
    .eq("slug", communitySlug)
    .maybeSingle();

  if (!community) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  const canPost = profile?.role === "creator" || profile?.role === "member";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-[32px] border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-violet-950 p-6 text-white shadow-xl shadow-slate-200/50 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-violet-200">
              Community feed
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {community.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              {community.description || "Community updates and conversations."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/register?role=member&community=${encodeURIComponent(communitySlug)}`}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Join the community
            </Link>
            <Link
              href={`/${encodeURIComponent(communitySlug)}/member`}
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Profile settings
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <CommunityFeedPosts communityId={community.id} canPost={canPost} />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                About this community
              </h4>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {community.description ||
                  "Community updates and conversations."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xl font-bold text-slate-900">1,240</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Active members
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">98%</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Member retention
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600">
                Quick win
              </p>
              <h5 className="mt-2 text-lg font-semibold text-slate-900">
                Your next edge starts here
              </h5>
              <p className="mt-2 text-sm text-slate-600">
                New members unlock access to premium market notes, founder Q&As,
                and launch alerts.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
