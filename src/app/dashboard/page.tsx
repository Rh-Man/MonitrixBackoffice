"use client";

import {
  AlertCircle,
  CheckCircle,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_DEPLOYMENTS,
  DEPLOYMENT_STATS,
} from "@/lib/mock-data";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function BackofficeDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* KPIs Section */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pays déployés</p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {DEPLOYMENT_STATS.total_deployed}
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-2 border border-success/20 shadow-inner group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">En cours</p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {DEPLOYMENT_STATS.total_in_progress}
                </p>
              </div>
              <div className="rounded-xl bg-warning/10 p-2 border border-warning/20 shadow-inner group-hover:scale-110 transition-transform">
                <AlertCircle className="h-5 w-5 text-warning animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Régulateurs</p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {DEPLOYMENT_STATS.total_regulateurs}
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Opérateurs</p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {DEPLOYMENT_STATS.total_operateurs}
                </p>
              </div>
              <div className="rounded-xl bg-accent/10 p-2 border border-accent/20 shadow-inner group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group col-span-2 md:col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Utilisateurs</p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {DEPLOYMENT_STATS.total_users.toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Déploiements réussis */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Déploiements réussis</h2>
          <p className="text-sm text-muted-foreground">Historique des pays déployés</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_DEPLOYMENTS.map((deploy) => (
            <Link key={deploy.id} href={`/dashboard/${deploy.id}`} className="block group">
              <Card className="glass-card border-border/50 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{deploy.pays_nom}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {deploy.code_iso}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium shrink-0",
                        deploy.status === "ACTIF"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      )}
                    >
                      {deploy.status === "ACTIF" ? "✓ Actif" : "⏳ En cours"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Régulateur</p>
                    <p className="font-medium truncate">{deploy.regulateur_nom}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground">Opérateurs</p>
                      <p className="font-bold">{deploy.operateurs_count}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground">Utilisateurs</p>
                      <p className="font-bold">{deploy.users_count.toLocaleString("fr-FR", { notation: "compact" })}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground">Admin</p>
                      <p className="font-bold text-xs truncate">{deploy.admin_nom.split(" ")[0]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
