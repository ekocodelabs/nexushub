import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/server-client";
import { redirect } from "next/navigation";

const stats = [
  { label: "Monthly revenue", value: "$24.8K", change: "+18.4%" },
  { label: "Active members", value: "8,942", change: "+12.1%" },
  { label: "Conversion rate", value: "5.6%", change: "+1.2%" },
  { label: "Avg. watch time", value: "22m", change: "+4.8%" },
];

const quickActions = [
  {
    title: "Launch new workshop",
    description: "Schedule your next community session",
  },
  { title: "Invite creators", description: "Share your latest referral offer" },
  { title: "Review payouts", description: "Check pending creator settlements" },
];

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  //get the user's profile information from the database
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

  //get the user's community information from the database
  const { data: community } = await supabase
    .from("communities")
    .select("description, slug")
    .eq("creator_id", user.id)
    .maybeSingle();
  const communityDescription =
    community?.description || "No description provided.";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-violet-950 p-8 text-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
              Creator overview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back, {fullName}.
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              {communityDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              Create campaign
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900/40 text-white hover:bg-slate-800"
            >
              View reports
            </Button>
            {community?.slug ? (
              <Link
                href={`/${encodeURIComponent(community.slug)}/feed`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Open community feed
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <p className="text-sm text-slate-500">{stat.label}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-emerald-600">
                {stat.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Community growth
            </CardTitle>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
              +14.2%
            </span>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div className="flex h-56 items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {[42, 58, 48, 72, 66, 84, 96, 88, 112, 104, 130, 142].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-2xl bg-linear-to-t from-violet-500 to-indigo-300"
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-900">
                  {action.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {action.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Top performing creators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Lena Hart", "$3.4K", "92% retention"],
              ["Aaron Cole", "$2.9K", "88% retention"],
              ["Nia Brooks", "$2.4K", "86% retention"],
            ].map(([name, revenue, retention]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{name}</p>
                  <p className="text-sm text-slate-500">{retention}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {revenue}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Next milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-sm text-violet-700">Membership goal</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                8,500 / 10,000
              </p>
              <div className="mt-3 h-2 rounded-full bg-violet-200">
                <div className="h-2 w-[85%] rounded-full bg-violet-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Next payout date</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                June 28
              </p>
            </div>

            <Link
              href="/dashboard/members"
              className="inline-flex items-center text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Review members →
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
