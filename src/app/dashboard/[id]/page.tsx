"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  Shield,
  Users,
  UserCog,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building2,
  Activity,
  TrendingUp,
  Zap,
  ExternalLink,
} from "lucide-react";
import { MOCK_DEPLOYMENTS, MOCK_REGULATEURS, MOCK_ADMIN_ACCOUNTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ─── helpers ─── */
function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR");
}

/* ─── fake extra data per country (operators list, monthly stats) ─── */
function generateOperators(count: number) {
  const names = [
    "1xBet", "Melbet", "PremierBet", "Betclic", "Bet365",
    "BetWinner", "22Bet", "Supabet", "MozzartBet", "BetPawa",
    "SportyBet", "Paripesa", "Linebet", "MSport", "BetKing",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `op_${i + 1}`,
    name: names[i % names.length],
    status: i < count - 1 ? "ACTIF" as const : (Math.random() > 0.5 ? "ACTIF" as const : "EN_ATTENTE" as const),
    betsCount: Math.floor(Math.random() * 150000) + 10000,
    revenue: Math.floor(Math.random() * 2_000_000_000) + 100_000_000,
    usersCount: Math.floor(Math.random() * 20000) + 1000,
    joinedAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 86400000).toISOString(),
  }));
}

function generateMonthlyStats() {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  return months.map((m) => ({
    month: m,
    bets: Math.floor(Math.random() * 500000) + 50000,
    revenue: Math.floor(Math.random() * 1_500_000_000) + 200_000_000,
    users: Math.floor(Math.random() * 15000) + 2000,
  }));
}

/* ─── Timeline step component ─── */
function TimelineStep({
  title,
  date,
  description,
  status,
  icon: Icon,
  isLast,
}: {
  title: string;
  date: string;
  description: string;
  status: "done" | "active" | "pending";
  icon: typeof CheckCircle2;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
            status === "done"
              ? "bg-success/10 text-success border-success/20"
              : status === "active"
                ? "bg-primary/10 text-primary border-primary/20 animate-pulse"
                : "bg-muted/50 text-muted-foreground border-border/30"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-8",
              status === "done" ? "bg-success/30" : "bg-border/30"
            )}
          />
        )}
      </div>
      <div className="pb-8">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deployId = params.id as string;

  const deploy = useMemo(
    () => MOCK_DEPLOYMENTS.find((d) => d.id === deployId),
    [deployId]
  );

  const regulateur = useMemo(
    () =>
      deploy
        ? MOCK_REGULATEURS.find((r) => r.regulateur_id === deploy.regulateur_id)
        : null,
    [deploy]
  );

  const adminAccount = useMemo(
    () =>
      deploy
        ? MOCK_ADMIN_ACCOUNTS.find(
            (a) => a.regulateurId === deploy.regulateur_id
          )
        : null,
    [deploy]
  );

  const operators = useMemo(
    () => (deploy ? generateOperators(deploy.operateurs_count) : []),
    [deploy]
  );

  const monthlyStats = useMemo(() => generateMonthlyStats(), []);

  if (!deploy) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col items-center justify-center py-20">
          <Globe2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h1 className="text-2xl font-bold">Déploiement introuvable</h1>
          <p className="text-muted-foreground mt-2">
            L&apos;identifiant &quot;{deployId}&quot; ne correspond à aucun
            déploiement.
          </p>
          <Button className="mt-6" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isActive = deploy.status === "ACTIF";
  const totalRevenue = operators.reduce((sum, op) => sum + op.revenue, 0);
  const totalBets = operators.reduce((sum, op) => sum + op.betsCount, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {deploy.pays_nom}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-xl border",
                  isActive
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                )}
              >
                {isActive ? "✓ Actif" : "⏳ En cours"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="font-mono text-sm bg-muted/50 px-2 py-0.5 rounded">
                {deploy.code_iso}
              </span>
              <span className="text-xs">·</span>
              <span className="text-sm">
                Déployé le {formatDate(deploy.created_at)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl">
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Ouvrir le portail
          </Button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Opérateurs
                </p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {deploy.operateurs_count}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {operators.filter((o) => o.status === "ACTIF").length} actifs
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Utilisateurs
                </p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {formatNumber(deploy.users_count)}
                </p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.4%
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Paris totaux
                </p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {formatNumber(totalBets)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ce trimestre
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-2 border border-success/20 shadow-inner group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Revenu total
                </p>
                <p className="mt-2.5 text-2xl font-black text-foreground">
                  {(totalRevenue / 1_000_000_000).toFixed(1)}B
                </p>
                <p className="text-xs text-muted-foreground mt-1">XOF</p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-2 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Main content grid ─── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Operators table + monthly chart */}
        <div className="space-y-6">
          {/* Operators */}
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-background/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Opérateurs déployés
                </CardTitle>
                <Badge variant="outline" className="rounded-xl text-xs">
                  {operators.length} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 text-muted-foreground">
                      <th className="text-left px-5 py-3 font-medium">Nom</th>
                      <th className="text-left px-5 py-3 font-medium">
                        Statut
                      </th>
                      <th className="text-right px-5 py-3 font-medium">
                        Paris
                      </th>
                      <th className="text-right px-5 py-3 font-medium">
                        Utilisateurs
                      </th>
                      <th className="text-right px-5 py-3 font-medium">
                        Revenu (XOF)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {operators.map((op, i) => (
                      <tr
                        key={op.id}
                        className={cn(
                          "border-b border-border/20 hover:bg-muted/30 transition-colors",
                          i % 2 === 0 && "bg-muted/10"
                        )}
                      >
                        <td className="px-5 py-3 font-medium">{op.name}</td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                              op.status === "ACTIF"
                                ? "bg-success/15 text-success"
                                : "bg-warning/15 text-warning"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                op.status === "ACTIF"
                                  ? "bg-success"
                                  : "bg-warning"
                              )}
                            />
                            {op.status === "ACTIF" ? "Actif" : "En attente"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs">
                          {formatNumber(op.betsCount)}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs">
                          {formatNumber(op.usersCount)}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs">
                          {formatNumber(op.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Monthly stats */}
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-background/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Activité mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-6 gap-3">
                {monthlyStats.map((stat) => (
                  <div
                    key={stat.month}
                    className="text-center space-y-2 p-3 rounded-xl bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-xs font-bold text-muted-foreground uppercase">
                      {stat.month}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-black">
                        {(stat.bets / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[10px] text-muted-foreground">paris</p>
                    </div>
                    <Separator className="opacity-30" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-success">
                        {(stat.revenue / 1_000_000_000).toFixed(1)}B
                      </p>
                      <p className="text-[10px] text-muted-foreground">XOF</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar: Regulateur info + Timeline */}
        <div className="space-y-6">
          {/* Regulateur card */}
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-background/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Régulateur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-sm">
                  {deploy.regulateur_nom}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Organisme de régulation principal
                </p>
              </div>
              <Separator className="opacity-30" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserCog className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deploy.admin_nom}</p>
                    <p className="text-xs text-muted-foreground">
                      Administrateur
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deploy.admin_email}</p>
                    <p className="text-xs text-muted-foreground">
                      Email de contact
                    </p>
                  </div>
                </div>
                {regulateur && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {regulateur.telephone}
                      </p>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-background/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Historique du déploiement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <TimelineStep
                icon={Globe2}
                title="Pays créé"
                date={formatDate(deploy.created_at)}
                description="Le pays a été ajouté dans la plateforme."
                status="done"
              />
              <TimelineStep
                icon={Shield}
                title="Régulateur configuré"
                date={formatDate(deploy.created_at)}
                description={`${deploy.regulateur_nom} a été enregistré.`}
                status="done"
              />
              <TimelineStep
                icon={UserCog}
                title="Compte admin créé"
                date={formatDate(deploy.created_at)}
                description={`Cognito + RDS provisionnés pour ${deploy.admin_nom}.`}
                status="done"
              />
              <TimelineStep
                icon={Building2}
                title="Opérateurs intégrés"
                date={formatDate(deploy.completed_at)}
                description={`${deploy.operateurs_count} opérateurs connectés.`}
                status={isActive ? "done" : "active"}
              />
              <TimelineStep
                icon={isActive ? CheckCircle2 : Clock}
                title={isActive ? "Déploiement terminé" : "En cours de déploiement"}
                date={
                  isActive
                    ? formatDate(deploy.completed_at)
                    : "En attente"
                }
                description={
                  isActive
                    ? "Le pays est opérationnel."
                    : "Le déploiement est en cours de finalisation."
                }
                status={isActive ? "done" : "pending"}
                isLast
              />
            </CardContent>
          </Card>

          {/* Admin account info */}
          {adminAccount && (
            <Card className="glass-card border-border/50 overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-background/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-primary" />
                  Compte Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="grid gap-3">
                  <div className="rounded-xl bg-muted/30 border border-border/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Email
                    </p>
                    <p className="text-sm font-medium mt-0.5 font-mono">
                      {adminAccount.email}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/30 border border-border/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Type projet
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {adminAccount.type_projet}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/30 border border-border/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      ID Admin
                    </p>
                    <code className="text-xs font-semibold text-primary mt-0.5 block">
                      {adminAccount.admin_id}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
