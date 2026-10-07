import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import SideBarComponent from "@/myComponents/SideBarComponent";
import { createSupabaseServerClient } from "@/lib/server-client";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Fail closed: only a verified creator profile can render dashboard routes.
  if (error || profile?.role !== "creator") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <SideBarComponent>{children}</SideBarComponent>
    </div>
  );
}
