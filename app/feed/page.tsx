import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/server-client";

export default async function MemberFeedResolverPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "creator") {
    redirect("/dashboard");
  }

  // Newer member accounts store their selected community in auth metadata.
  const metadataSlug = user.user_metadata?.community_slug;
  if (typeof metadataSlug === "string" && metadataSlug.trim()) {
    redirect(`/${encodeURIComponent(metadataSlug.trim())}/feed`);
  }

  // Older accounts may already have an active membership row to identify a feed.
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("community_id")
    .eq("member_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscription?.community_id) {
    const { data: community } = await supabase
      .from("communities")
      .select("slug")
      .eq("id", subscription.community_id)
      .maybeSingle();

    if (community?.slug) {
      redirect(`/${encodeURIComponent(community.slug)}/feed`);
    }
  }

  // If no community is associated with this account yet, let the member choose.
  const { data: communities } = await supabase
    .from("communities")
    .select("slug, name, description")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Member area
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Choose a community feed
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This account is not linked to a community feed yet. Select a community
          to continue.
        </p>

        {communities?.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {communities.map((community) => (
              <Link
                key={community.slug}
                href={`/${encodeURIComponent(community.slug)}/feed`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
              >
                <h2 className="font-semibold text-slate-900">
                  {community.name}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {community.description || "View this community's feed."}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-violet-700">
                  Open feed →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            There are no communities available yet.
          </p>
        )}
      </section>
    </main>
  );
}
