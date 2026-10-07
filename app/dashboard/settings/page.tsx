import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/myComponents/LogoutButton";
import { createSupabaseServerClient } from "@/lib/server-client";

export default async function SettingsPage() {
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
    .select("description")
    .eq("creator_id", user.id)
    .maybeSingle();

  const communityDescription =
    community?.description || "No description provided.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Settings
          </h1>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Display name
              </label>
              <Input defaultValue={fullName} className="border-slate-200" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <Input
                value={user.email ?? ""}
                readOnly
                className="border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Brand handle
              </label>
              <Input defaultValue="@mayacreates" className="border-slate-200" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Community bio
              </label>
              <textarea
                defaultValue={communityDescription}
                className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-violet-400"
              />
            </div>

            <div className="flex justify-end">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              "Enable member emails",
              "Send weekly growth recap",
              "Show launch reminders",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
