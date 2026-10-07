import { redirect } from "next/navigation";

import LogoutButton from "@/myComponents/LogoutButton";
import { createSupabaseServerClient } from "@/lib/server-client";

export default async function MemberProfileSettingsPage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Account holder";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-2xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              {communitySlug.replaceAll("-", " ")}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Profile settings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Your account details for this community.
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Account information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Signed-in account details from your profile.
            </p>
          </div>

          <dl className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </dt>
              <dd className="mt-1 wrap-break-word text-base font-medium text-slate-900">
                {fullName}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-1 wrap-break-word text-base font-medium text-slate-900">
                {user.email ?? "No email address on this account"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
