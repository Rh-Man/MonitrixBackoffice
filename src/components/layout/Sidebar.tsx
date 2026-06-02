"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Globe2, LogOut, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV = [
  { href: "/dashboard", label: "Déploiements pays", icon: Globe2 },
  { href: "/dashboard/deploy", label: "Créer un déploiement", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <div className="sticky top-0 p-6 pr-0 h-screen hidden md:flex md:flex-col shrink-0">
      <aside
        className={cn(
          "flex shrink-0 flex-col bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground border border-sidebar-border/50 shadow-2xl shadow-primary/5 rounded-2xl h-full sticky transition-all duration-300 overflow-visible",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-8 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-primary/20 hover:text-primary focus:outline-none"
          title={collapsed ? "Agrandir" : "Réduire"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Header - Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/50 shrink-0">
          {!collapsed && (
            <>
              <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden shadow-inner bg-background">
                <Image
                  src="/logo-small.png"
                  alt="Monitrix Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Monitrix
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
                  BackOffice
                </p>
              </div>
            </>
          )}
          {collapsed && (
            <div className="relative h-10 w-10 shrink-0 mx-auto rounded-xl overflow-hidden shadow-inner bg-background">
              <Image
                src="/logo-small.png"
                alt="Monitrix Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 h-10",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-sidebar-accent/30"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-sidebar-accent/30"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </TooltipProvider>

        {/* Footer - User Profile */}
        <div className="mt-auto border-t border-sidebar-border/50 p-4 space-y-3 shrink-0">
          {!collapsed && (
            <div className="rounded-lg border border-sidebar-border/50 bg-sidebar-accent/35 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-sidebar-border shadow-inner bg-gradient-to-br from-primary to-accent">
                  <AvatarFallback className="text-sidebar-accent-foreground text-xs font-semibold">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">Super Admin</p>
                  <p className="truncate text-xs text-sidebar-foreground/60">Déploiements</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-1.5 text-xs font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/80 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Déconnexion
              </button>
            </div>
          )}
          {collapsed && (
            <button
              onClick={handleLogout}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-sidebar-accent/60 text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
          <p className="px-2 text-[11px] text-sidebar-foreground/40">© 2026 Monitrix</p>
        </div>
      </aside>
    </div>
  );
}
