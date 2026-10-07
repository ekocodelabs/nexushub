"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChartBar, Gear, House, Sparkle, Users } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: House },
  { label: "Members", href: "/dashboard/members", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartBar },
  { label: "Settings", href: "/dashboard/settings", icon: Gear },
];

export default function SideBarComponent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-slate-100">
        <Sidebar
          side="left"
          variant="sidebar"
          collapsible="offcanvas"
          className="border-r border-slate-200 bg-slate-950 text-slate-100"
        >
          <SidebarHeader className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30">
                <Sparkle size={18} weight="fill" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  CreatorHub
                </p>
                <p className="text-sm font-semibold text-white">
                  Creator Console
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarMenu>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.href}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-violet-500/20 text-white ring-1 ring-violet-400/30"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            )}
                          >
                            <Icon
                              size={16}
                              weight={isActive ? "fill" : "regular"}
                            />
                            <span>{item.label}</span>
                          </Link>
                        }
                        isActive={isActive}
                        className={cn(
                          "w-full",
                          isActive
                            ? "bg-violet-500/20 text-white"
                            : "text-slate-300",
                        )}
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-800 p-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Membership
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Gold Tier
                  </p>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                  Active
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
              >
                View plan
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-x-hidden bg-slate-100">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                  <SidebarTrigger className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-100" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Dashboard
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Creator overview
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Share link
                </Button>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500">
                  Publish update
                </Button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
