"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Globe2,
  List,
  LogOut,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { clearSession } from "@/lib/session";
import { useSession } from "@/hooks/use-session";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  {
    href: "/dashboard/pays",
    label: "Pays",
    icon: Globe2,
    children: [
      { href: "/dashboard/pays/creer", label: "Créer un pays", icon: PlusCircle },
      { href: "/dashboard/pays", label: "Liste des pays", icon: List },
    ],
  },
  {
    href: "/dashboard/regulateur",
    label: "Régulateur",
    icon: Building2,
    children: [
      { href: "/dashboard/regulateur/creer", label: "Créer régulateur + compte", icon: PlusCircle },
      { href: "/dashboard/regulateur", label: "Régulateurs et accès", icon: List },
    ],
  },
  { href: "/dashboard/profil", label: "Profil", icon: UserRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const session = useSession();

  const handleLogout = () => {
    clearSession();
    router.push("/auth/login");
  };

  return (
    <>
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-1 overflow-x-auto rounded-2xl border border-sidebar-border/40 bg-sidebar/95 p-2 text-sidebar-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl md:hidden">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        className="flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      >
        <LogOut className="h-5 w-5" />
        <span className="max-w-full truncate">Sortir</span>
      </button>
    </nav>

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
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

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
                <div key={item.href} className="space-y-1">
                  <Link
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
                    {item.children && <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-60" />}
                  </Link>
                  {item.children && active && (
                    <div className="ml-5 border-l border-sidebar-border/50 pl-3 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                              childActive
                                ? "bg-background/20 text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground",
                            )}
                          >
                            <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                  <p className="truncate text-sm font-semibold">{session?.nom || "Super Admin"}</p>
                  <p className="truncate text-xs text-sidebar-foreground/60">
                    {session?.email || "Déploiements"}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/profil"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-1.5 text-xs font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/80"
              >
                <UserRound className="h-3.5 w-3.5" />
                Mon profil
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-1.5 text-xs font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/80 transition-colors"
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
    </>
  );
}
