import MemberProfileSettingsPage from "@/myComponents/MemberProfileLayout";
import React from "react";

export default function MemberProfile() {
  return (
    <div>
      <MemberProfileSettingsPage
        params={Promise.resolve({ communitySlug: "community-slug" })}
      />
    </div>
  );
}
