import Link from "next/link";

export default async function CommunityWelcomePage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-linear-to-br from-slate-950 via-slate-900 to-violet-950 p-8 text-white sm:p-10 lg:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-200">
              Welcome to {communitySlug}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Join a space built for creators and insiders.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Unlock exclusive posts, live strategy updates, and a real
              community of members who are serious about growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/register?role=member&community=${encodeURIComponent(communitySlug)}`}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign up
              </Link>
              {/* <Link
                href={`/${communitySlug}/feed`}
                className="rounded-full border border-slate-700 bg-slate-900/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Preview feed
              </Link> */}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-slate-50 p-8 sm:p-10">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600">
                Community perks
              </p>
              <ul className="mt-5 space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  Access private creator updates and member-only discussions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  Behind-the-scenes insights and early access to launches
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  A stronger network with founders, operators, and members
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
