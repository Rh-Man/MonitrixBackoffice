"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  GitBranch,
  Globe2,
  LoaderCircle,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDashboardStats, listPays, listRegulateurs } from "@/lib/backoffice-api";
import type { DashboardStats, PaysOption, RegulateurOption } from "@/types/backoffice";

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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();
  const [pays, setPays] = useState<PaysOption[]>([]);
  const [regulateurs, setRegulateurs] = useState<RegulateurOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    Promise.all([getDashboardStats(), listPays(), listRegulateurs()])
      .then(([statsData, paysItems, regulateurItems]) => {
        setDashboardStats(statsData);
        setPays(paysItems);
        setRegulateurs(regulateurItems);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, []);

  const activeRegulateurs = useMemo(
    () => regulateurs.filter((item) => item.status.toLowerCase() === "active"),
    [regulateurs],
  );
  const principalCount = regulateurs.filter((item) => item.is_parent).length;
  const childrenCount = regulateurs.length - principalCount;
  const viewerCount = regulateurs.filter((item) => item.access_level === "viewer").length;
  const successRate = regulateurs.length
    ? Math.round((activeRegulateurs.length / regulateurs.length) * 100)
    : 0;

  const stats = [
    {
      label: "Pays actifs",
      value: dashboardStats?.totalPays ?? 0,
      detail: `${pays.length} pays suivis`,
      icon: Globe2,
      tone: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Régulateurs principaux",
      value: principalCount,
      detail: `${childrenCount} régulateur fils`,
      icon: GitBranch,
      tone: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Comptes viewer",
      value: viewerCount,
      detail: "Lecture seule régulateur",
      icon: Users,
      tone: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Régulateurs",
      value: dashboardStats?.totalRegulateurs ?? 0,
      detail: "Tous niveaux confondus",
      icon: Building2,
      tone: "text-success bg-success/10 border-success/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        Chargement du dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

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
              <p className="text-sm font-bold">{successRate}%</p>
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
            {regulateurs.slice(0, 6).map((regulateur) => (
              <Link
                key={regulateur.regulateur_id}
                href={`/dashboard/regulateur/${regulateur.regulateur_id}`}
                className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">
                      {regulateur.pays_nom || "Pays non renseigné"}
                    </p>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-semibold",
                        regulateur.status.toLowerCase() === "active"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning",
                      )}
                    >
                      {regulateur.status.toLowerCase() === "active" ? "Actif" : "En cours"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {regulateur.nom}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-bold capitalize">{regulateur.project_type}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {regulateur.access_level}
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
              <p className="mt-2 text-3xl font-black">{activeRegulateurs.length}</p>
            </div>
            <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
              <div className="flex items-center gap-2 text-warning">
                <Clock3 className="h-4 w-4" />
                <p className="text-sm font-semibold">À finaliser</p>
              </div>
              <p className="mt-2 text-3xl font-black">
                {Math.max(regulateurs.length - activeRegulateurs.length, 0)}
              </p>
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
