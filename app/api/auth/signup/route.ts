import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server-client";

const allowedRoles = new Set(["creator", "member"]);

export async function POST(request: NextRequest) {
  try {
    let body: {
      email?: string;
      password?: string;
      full_name?: string;
      role?: string;
      community_name?: string;
      community_slug?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const fullName = body.full_name?.trim();
    const role = body.role ?? "creator";
    const communityName = body.community_name?.trim();
    const communitySlug = body.community_slug?.trim();

    if (!email || !password || !fullName || !allowedRoles.has(role)) {
      return NextResponse.json(
        {
          error:
            "Provide a valid email, password, full name, and role ('creator' or 'member').",
        },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    if (role === "creator" && !communityName) {
      return NextResponse.json(
        { error: "A community name is required for creator registration." },
        { status: 400 },
      );
    }

    if (communityName && communityName.length > 80) {
      return NextResponse.json(
        { error: "Community names must be 80 characters or fewer." },
        { status: 400 },
      );
    }

    if (role === "member") {
      if (!communitySlug) {
        return NextResponse.json(
          { error: "A community is required for member registration." },
          { status: 400 },
        );
      }

      const { data: community, error: communityError } = await supabase
        .from("communities")
        .select("id")
        .eq("slug", communitySlug)
        .maybeSingle();

      if (communityError || !community) {
        return NextResponse.json(
          { error: "The requested community could not be found." },
          { status: 404 },
        );
      }
    }

    // The database's on_auth_user_created trigger inserts this user's profile
    // in the same transaction as the Auth user, including when email
    // confirmation is enabled and signup returns no authenticated session.
    const profileData = {
      full_name: fullName,
      role,
      ...(role === "creator" ? { community_name: communityName } : {}),
      ...(role === "member" ? { community_slug: communitySlug } : {}),
    };

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData,
      },
    });

    if (authError) {
      return NextResponse.json(
        {
          error: "Signup failed",
          details: authError.message,
        },
        { status: 400 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          error: "Signup succeeded but no user record was returned",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        profile: {
          id: authData.user.id,
          email: authData.user.email ?? email,
          full_name: fullName,
          role,
          ...(role === "creator" ? { community_name: communityName } : {}),
          ...(role === "member" ? { community_slug: communitySlug } : {}),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        error: "Unable to complete signup",
        details: message,
      },
      { status: 500 },
    );
  }
}
