"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/browser-client";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError("");

    try {
      const { error: signOutError } =
        await getSupabaseBrowserClient().auth.signOut();

      if (signOutError) {
        setError("Unable to log out. Please try again.");
        setIsLoggingOut(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
      >
        <SignOut size={16} />
        {isLoggingOut ? "Logging out…" : "Log out"}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
