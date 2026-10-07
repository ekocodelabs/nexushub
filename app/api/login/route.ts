import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email?.trim();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Login failed",
          details: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Signed in successfully",
        user: data.user,
        session: data.session,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        error: "Unable to sign in",
        details: message,
      },
      { status: 500 },
    );
  }
}
