"use client";

import Link from "next/link";
import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  GitBranch,
  Globe2,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { DEPLOYMENT_STATS, MOCK_DEPLOYMENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    title: "Pays",
    description: "Créer un pays, consulter la liste et ouvrir sa fiche par identifiant.",
    href: "/dashboard/pays",
    createHref: "/dashboard/pays/creer",
    icon: Globe2,
  },
  {
    title: "Régulateur",
    description: "Créer un régulateur et son compte, puis suivre sa hiérarchie et ses accès.",
    href: "/dashboard/regulateur",
    createHref: "/dashboard/regulateur/creer",
    icon: Building2,
  },
];

export default function BackofficeDashboard() {
  const activeDeployments = MOCK_DEPLOYMENTS.filter((deployment) => deployment.status === "ACTIF");
  const pendingDeployments = MOCK_DEPLOYMENTS.filter((deployment) => deployment.status !== "ACTIF");
  const stats = [
    {
      label: "Pays actifs",
      value: DEPLOYMENT_STATS.total_deployed,
      detail: `${DEPLOYMENT_STATS.total_countries} pays suivis`,
      icon: Globe2,
      tone: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Régulateurs principaux",
      value: DEPLOYMENT_STATS.total_regulateurs_principaux,
      detail: `${DEPLOYMENT_STATS.total_regulateurs_fils} régulateur fils`,
      icon: GitBranch,
      tone: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Comptes viewer",
      value: DEPLOYMENT_STATS.total_viewers,
      detail: "Lecture seule régulateur",
      icon: Users,
      tone: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Régulateurs",
      value: DEPLOYMENT_STATS.total_regulateurs,
      detail: "Tous niveaux confondus",
      icon: Building2,
      tone: "text-success bg-success/10 border-success/20",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Backoffice interne Monitrix</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Console Super Admin</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Vue de pilotage des déploiements pays, des régulateurs et des accès administrateurs.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <div>
              <p className="text-sm font-bold">{DEPLOYMENT_STATS.success_rate}%</p>
              <p className="text-xs text-muted-foreground">Taux de succès</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-black">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border",
                      stat.tone,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {MODULES.map((module) => {
          const Icon = module.icon;

          return (
            <Card key={module.href} className="border-border/60 shadow-sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={module.createHref}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={module.href}>Voir la liste</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Déploiements récents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_DEPLOYMENTS.map((deployment) => (
              <Link
                key={deployment.id}
                href={`/dashboard/pays/${deployment.pays_id}`}
                className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{deployment.pays_nom}</p>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-semibold",
                        deployment.status === "ACTIF"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning",
                      )}
                    >
                      {deployment.status === "ACTIF" ? "Actif" : "En cours"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {deployment.regulateur_nom}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-bold">{deployment.operateurs_count} opérateurs</p>
                  <p className="text-xs text-muted-foreground">
                    {deployment.users_count.toLocaleString("fr-FR")} utilisateurs
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">État global</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-success/20 bg-success/5 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-semibold">Déploiements actifs</p>
              </div>
              <p className="mt-2 text-3xl font-black">{activeDeployments.length}</p>
            </div>
            <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
              <div className="flex items-center gap-2 text-warning">
                <Clock3 className="h-4 w-4" />
                <p className="text-sm font-semibold">À finaliser</p>
              </div>
              <p className="mt-2 text-3xl font-black">{pendingDeployments.length}</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/regulateur/creer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Régulateur + compte
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
