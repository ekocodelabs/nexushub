import SignUpPageLayout from "@/myComponents/SignupLayout";
import React from "react";

type RegisterPageProps = {
  searchParams: Promise<{
    role?: string;
    community?: string;
  }>;
};

export default async function SignUpPge({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const role = params.role === "member" ? "member" : "creator";
  const community = params.community?.trim() || "";

  return (
    <div>
      <SignUpPageLayout role={role} community={community} />
    </div>
  );
}
