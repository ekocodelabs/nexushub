import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server-client";

const isValidText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function GET(request: NextRequest) {
  // Read the community ID from the query string before contacting Supabase.
  const communityId = request.nextUrl.searchParams.get("community_id");

  if (!isValidText(communityId)) {
    return NextResponse.json(
      {
        error: "Missing or invalid query parameter: community_id",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Only authenticated users can view the feed.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Load the newest posts for the requested community.
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch posts",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Fetch author display details in one query and attach them to each post.
    const authorIds = [...new Set((data ?? []).map((post) => post.author_id))];
    const { data: authors } = authorIds.length
      ? await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", authorIds)
      : { data: [] };
    const authorById = new Map(
      (authors ?? []).map((author) => [author.id, author]),
    );
    const posts = (data ?? []).map((post) => ({
      ...post,
      author_name:
        authorById.get(post.author_id)?.full_name ?? "Community member",
      author_avatar: authorById.get(post.author_id)?.avatar_url ?? null,
    }));

    return NextResponse.json({ data: posts }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        error: "Unable to fetch posts",
        details: message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify the request has an authenticated Supabase user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: authError?.message ?? "User is not authenticated.",
        },
        { status: 401 },
      );
    }

    // Parse the submitted post fields and reject malformed JSON.
    let body: {
      title?: string;
      content?: string;
      image_url?: string | null;
      community_id?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
        },
        { status: 400 },
      );
    }

    const { title, content, image_url, community_id } = body;

    if (
      !isValidText(title) ||
      !isValidText(content) ||
      !isValidText(community_id)
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, content, and community_id",
        },
        { status: 400 },
      );
    }

    // Require a profile with a creator or member role.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        {
          error: "Failed to verify account role",
          details: profileError.message,
        },
        { status: 500 },
      );
    }

    if (!profile || !["creator", "member"].includes(profile.role)) {
      return NextResponse.json(
        { error: "Forbidden", details: "Only creators and members can post." },
        { status: 403 },
      );
    }

    // Confirm that the destination community exists.
    const { data: community, error: communityError } = await supabase
      .from("communities")
      .select("id")
      .eq("id", community_id)
      .maybeSingle();

    if (communityError) {
      return NextResponse.json(
        {
          error: "Failed to validate community ownership",
          details: communityError.message,
        },
        { status: 500 },
      );
    }

    if (!community) {
      return NextResponse.json(
        {
          error: "Community not found",
        },
        { status: 404 },
      );
    }

    // Insert the post as the authenticated user; database RLS also enforces the allowed roles.
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          image_url: image_url && image_url.trim() ? image_url.trim() : null,
          community_id,
          author_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to create post",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        error: "Unable to create post",
        details: message,
      },
      { status: 500 },
    );
  }
}
