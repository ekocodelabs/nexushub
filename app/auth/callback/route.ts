import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server-client";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const role = requestUrl.searchParams.get("role");
  const communitySlug = requestUrl.searchParams.get("community")?.trim();
  const communityName = requestUrl.searchParams.get("community_name")?.trim();
  const safeNext =
    next?.startsWith("/") && !next.startsWith("//") ? next : null;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL("/login?error=oauth_callback", requestUrl.origin),
      );
    }

    if (role === "member" && communitySlug) {
      const { data: community } = await supabase
        .from("communities")
        .select("slug")
        .eq("slug", communitySlug)
        .maybeSingle();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!community || !user) {
        return NextResponse.redirect(
          new URL(
            `/register?role=member&community=${encodeURIComponent(communitySlug)}&error=invalid_community`,
            requestUrl.origin,
          ),
        );
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "member" })
        .eq("id", user.id);

      if (profileError) {
        return NextResponse.redirect(
          new URL(
            `/register?role=member&community=${encodeURIComponent(communitySlug)}&error=profile_setup`,
            requestUrl.origin,
          ),
        );
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { role: "member", community_slug: communitySlug },
      });

      if (metadataError) {
        return NextResponse.redirect(
          new URL(
            `/register?role=member&community=${encodeURIComponent(communitySlug)}&error=profile_setup`,
            requestUrl.origin,
          ),
        );
      }

      return NextResponse.redirect(
        new URL(`/${encodeURIComponent(communitySlug)}`, requestUrl.origin),
      );
    }

    if (role === "creator" && communityName) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(
          new URL("/login?error=oauth_callback", requestUrl.origin),
        );
      }

      const { data: existingCommunity, error: lookupError } = await supabase
        .from("communities")
        .select("id")
        .eq("creator_id", user.id)
        .maybeSingle();

      if (lookupError) {
        return NextResponse.redirect(
          new URL("/dashboard?error=community_setup", requestUrl.origin),
        );
      }

      if (!existingCommunity) {
        const baseSlug = communityName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const slug = `${baseSlug || "community"}-${user.id.slice(0, 8)}`;
        const { error: communityError } = await supabase
          .from("communities")
          .insert({
            name: communityName,
            slug,
            creator_id: user.id,
          });

        if (communityError) {
          return NextResponse.redirect(
            new URL("/dashboard?error=community_setup", requestUrl.origin),
          );
        }
      }

      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }

    return NextResponse.redirect(
      new URL(safeNext ?? "/dashboard", requestUrl.origin),
    );
  }

  return NextResponse.redirect(new URL(safeNext ?? "/", requestUrl.origin));
}
