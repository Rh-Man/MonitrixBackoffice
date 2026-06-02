"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Copy,
  Database,
  Globe2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Users,
  UserPlus,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_PAYS,
  MOCK_PERMISSIONS,
  MOCK_ROLES,
  MOCK_REGULATEURS,
  MOCK_ADMIN_ACCOUNTS,
  MOCK_DEPLOYMENTS,
  DEPLOYMENT_STATS,
} from "@/lib/mock-data";
import type { GeneratedIds, PaysOption } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StepKey = "pays" | "permission" | "role" | "regulateur" | "admin";
type StepStatus = "locked" | "ready" | "done";

const STEPS: Array<{
  key: StepKey;
  title: string;
  description: string;
  icon: typeof Globe2;
  idKey: keyof GeneratedIds;
}> = [
  {
    key: "pays",
    title: "Pays",
    description: "Créer ou sélectionner le pays",
    icon: Globe2,
    idKey: "pays_id",
  },
  {
    key: "permission",
    title: "Permission",
    description: "Créer la permission initiale",
    icon: KeyRound,
    idKey: "permission_id",
  },
  {
    key: "role",
    title: "Rôle",
    description: "Lier le rôle à la permission",
    icon: ShieldCheck,
    idKey: "role_id",
  },
  {
    key: "regulateur",
    title: "Régulateur",
    description: "Créer le régulateur principal",
    icon: Database,
    idKey: "regulateur_id",
  },
  {
    key: "admin",
    title: "Compte Admin",
    description: "Déclencher Cognito + RDS + SQS",
    icon: UserPlus,
    idKey: "admin_id",
  },
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Une erreur inconnue est survenue.";
}

function previousStepDone(stepKey: StepKey, ids: GeneratedIds) {
  const index = STEPS.findIndex((step) => step.key === stepKey);
  if (index <= 0) return true;
  const previous = STEPS[index - 1];
  return Boolean(ids[previous.idKey]);
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function GeneratedId({ label, value }: { label: string; value?: string }) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2",
        value ? "border-success/25 bg-success/5" : "border-dashed bg-muted/30",
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <code
          className={cn(
            "truncate text-sm font-semibold",
            value ? "text-success" : "text-muted-foreground",
          )}
        >
          {value || "En attente"}
        </code>
        {value && (
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(value)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Copier l'identifiant"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function StepShell({
  stepKey,
  children,
  ids,
  loading,
  error,
}: {
  stepKey: StepKey;
  children: ReactNode;
  ids: GeneratedIds;
  loading?: boolean;
  error?: string;
}) {
  const step = STEPS.find((item) => item.key === stepKey)!;
  const status: StepStatus = ids[step.idKey]
    ? "done"
    : stepKey === "pays" || previousStepDone(stepKey, ids)
      ? "ready"
      : "locked";
  const Icon = step.icon;

  return (
    <Card
      className={cn(
        "glass-card border-border/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/20",
        status === "locked" ? "opacity-50 pointer-events-none" : "hover:-translate-y-0.5"
      )}
    >
      <CardHeader className={cn(
        "border-b border-border/40 p-5 bg-background/5 transition-colors",
        status === "ready" && "bg-primary/5",
        status === "done" && "bg-success/5"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all shadow-inner",
                status === "done"
                  ? "bg-success/10 text-success border-success/20"
                  : status === "ready"
                    ? "bg-primary/10 text-primary border-primary/20 animate-pulse"
                    : "bg-muted/50 text-muted-foreground border-border/30"
              )}
            >
              {status === "done" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5">
                {step.title}
              </CardTitle>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{step.description}</p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-xl px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border transition-all",
              status === "done"
                ? "bg-success/20 text-success border-success/30"
                : status === "ready"
                  ? loading
                    ? "bg-warning/20 text-warning border-warning/30 animate-pulse"
                    : "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground border-border/30"
            )}
          >
            {status === "done"
              ? "Terminé"
              : status === "ready"
                ? loading
                  ? "En cours"
                  : "Disponible"
                : "Bloqué"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {children}
        {error && (
          <div className="mt-4 flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BackofficeDashboard() {
  const [ids, setIds] = useState<GeneratedIds>({});
  const [paysOptions, setPaysOptions] = useState<PaysOption[]>([]);
  const [countryMode, setCountryMode] = useState<"select" | "create">("select");
  const [loading, setLoading] = useState<StepKey | "pays-list" | null>(null);
  const [errors, setErrors] = useState<Partial<Record<StepKey | "pays-list", string>>>({});

  const completedCount = useMemo(() => STEPS.filter((step) => ids[step.idKey]).length, [ids]);

  useEffect(() => {
    setLoading("pays-list");
    // Simule le chargement avec délai
    const timer = setTimeout(() => {
      setPaysOptions(MOCK_PAYS);
      setLoading(null);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  async function submitPays(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setErrors((current) => ({ ...current, pays: undefined }));

    if (countryMode === "select") {
      const selected = String(form.get("pays_id") || "");
      if (!selected) {
        setErrors((current) => ({
          ...current,
          pays: "Sélectionnez un pays existant ou passez en création.",
        }));
        return;
      }
      setIds((current) => ({ ...current, pays_id: selected }));
      return;
    }

    setLoading("pays");
    try {
      // Simule une création de pays
      await new Promise((resolve) => setTimeout(resolve, 800));

      const nom = String(form.get("nom") || "");
      const code_iso = String(form.get("code_iso") || "").toUpperCase();
      const newPaysId = `pays_${Date.now()}`;

      setIds((current) => ({ ...current, pays_id: newPaysId }));
      const newPays: PaysOption = { pays_id: newPaysId, nom, code_iso };
      setPaysOptions((current) => [...current, newPays]);
    } catch (error) {
      setErrors((current) => ({ ...current, pays: getErrorMessage(error) }));
    } finally {
      setLoading(null);
    }
  }

  async function submitPermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading("permission");
    setErrors((current) => ({ ...current, permission: undefined }));
    try {
      // Simule la création d'une permission
      await new Promise((resolve) => setTimeout(resolve, 800));

      const permissionId = `perm_${Date.now()}`;
      setIds((current) => ({ ...current, permission_id: permissionId }));
    } catch (error) {
      setErrors((current) => ({ ...current, permission: getErrorMessage(error) }));
    } finally {
      setLoading(null);
    }
  }

  async function submitRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ids.permission_id) return;
    const form = new FormData(event.currentTarget);
    setLoading("role");
    setErrors((current) => ({ ...current, role: undefined }));
    try {
      // Simule la création d'un rôle
      await new Promise((resolve) => setTimeout(resolve, 800));

      const roleId = `role_${Date.now()}`;
      setIds((current) => ({ ...current, role_id: roleId }));
    } catch (error) {
      setErrors((current) => ({ ...current, role: getErrorMessage(error) }));
    } finally {
      setLoading(null);
    }
  }

  async function submitRegulateur(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ids.pays_id) return;
    const form = new FormData(event.currentTarget);
    setLoading("regulateur");
    setErrors((current) => ({ ...current, regulateur: undefined }));
    try {
      // Simule la création d'un régulateur
      await new Promise((resolve) => setTimeout(resolve, 800));

      const regulateurId = `reg_${Date.now()}`;
      setIds((current) => ({ ...current, regulateur_id: regulateurId }));
    } catch (error) {
      setErrors((current) => ({ ...current, regulateur: getErrorMessage(error) }));
    } finally {
      setLoading(null);
    }
  }

  async function submitAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ids.role_id || !ids.regulateur_id) return;
    const form = new FormData(event.currentTarget);
    setLoading("admin");
    setErrors((current) => ({ ...current, admin: undefined }));
    try {
      // Simule la création d'un compte admin (Cognito + RDS + SQS)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const adminId = `admin_${Date.now()}`;
      setIds((current) => ({ ...current, admin_id: adminId }));
    } catch (error) {
      setErrors((current) => ({ ...current, admin: getErrorMessage(error) }));
    } finally {
      setLoading(null);
    }
  }

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

      {/* Formulaire de déploiement */}
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-primary">Créer un déploiement</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ajouter un nouveau pays</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Ce flow respecte strictement les contraintes de clés étrangères en base de données. Chaque étape est bloquante et
            expose l'ID retourné par l'API avant de débloquer la suivante.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div></div>
          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Progression</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {completedCount} / {STEPS.length} étapes validées
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LockKeyhole className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        <GeneratedId label="pays_id" value={ids.pays_id} />
        <GeneratedId label="permission_id" value={ids.permission_id} />
        <GeneratedId label="role_id" value={ids.role_id} />
        <GeneratedId label="regulateur_id" value={ids.regulateur_id} />
        <GeneratedId label="admin_id" value={ids.admin_id} />
      </section>

      {errors["pays-list"] && (
        <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
          Impossible de charger la liste des pays: {errors["pays-list"]}. Vous pouvez tout de même
          créer un nouveau pays.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <StepShell stepKey="pays" ids={ids} loading={loading === "pays"} error={errors.pays}>
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={countryMode === "select" ? "default" : "outline"}
              size="sm"
              onClick={() => setCountryMode("select")}
              disabled={!paysOptions.length}
            >
              Sélectionner
            </Button>
            <Button
              type="button"
              variant={countryMode === "create" ? "default" : "outline"}
              size="sm"
              onClick={() => setCountryMode("create")}
            >
              Créer
            </Button>
          </div>
          <form onSubmit={submitPays} className="space-y-4">
            {countryMode === "select" ? (
              <Field label="Pays existant">
                <select
                  name="pays_id"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Choisir un pays</option>
                  {paysOptions.map((pays) => (
                    <option key={pays.pays_id} value={pays.pays_id}>
                      {pays.nom} · {pays.code_iso} · {pays.pays_id}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom">
                  <Input name="nom" placeholder="Sénégal" required />
                </Field>
                <Field label="Code ISO">
                  <Input name="code_iso" placeholder="SN" maxLength={3} required />
                </Field>
              </div>
            )}
            <Button type="submit" disabled={loading === "pays" || Boolean(ids.pays_id)}>
              {ids.pays_id
                ? "Pays validé"
                : countryMode === "select"
                  ? "Utiliser ce pays"
                  : "Créer le pays"}
            </Button>
          </form>
        </StepShell>

        <StepShell
          stepKey="permission"
          ids={ids}
          loading={loading === "permission"}
          error={errors.permission}
        >
          <form onSubmit={submitPermission} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Libellé">
                <Input
                  name="libelle"
                  placeholder="Administration régulateur"
                  required
                  disabled={!ids.pays_id || Boolean(ids.permission_id)}
                />
              </Field>
              <Field label="Code">
                <Input
                  name="code"
                  placeholder="REGULATEUR_ADMIN"
                  required
                  disabled={!ids.pays_id || Boolean(ids.permission_id)}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                name="desc_permission"
                placeholder="Permissions initiales du régulateur pays"
                required
                disabled={!ids.pays_id || Boolean(ids.permission_id)}
              />
            </Field>
            <Button
              type="submit"
              disabled={!ids.pays_id || loading === "permission" || Boolean(ids.permission_id)}
            >
              {ids.permission_id ? "Permission créée" : "Créer la permission"}
            </Button>
          </form>
        </StepShell>

        <StepShell stepKey="role" ids={ids} loading={loading === "role"} error={errors.role}>
          <form onSubmit={submitRole} className="space-y-4">
            <GeneratedId label="permission_id injecté" value={ids.permission_id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Libellé">
                <Input
                  name="libelle"
                  placeholder="Admin régulateur"
                  required
                  disabled={!ids.permission_id || Boolean(ids.role_id)}
                />
              </Field>
              <Field label="Code">
                <Input
                  name="code"
                  placeholder="ADMIN_REGULATEUR"
                  required
                  disabled={!ids.permission_id || Boolean(ids.role_id)}
                />
              </Field>
            </div>
            <Button
              type="submit"
              disabled={!ids.permission_id || loading === "role" || Boolean(ids.role_id)}
            >
              {ids.role_id ? "Rôle créé" : "Créer le rôle"}
            </Button>
          </form>
        </StepShell>

        <StepShell
          stepKey="regulateur"
          ids={ids}
          loading={loading === "regulateur"}
          error={errors.regulateur}
        >
          <form onSubmit={submitRegulateur} className="space-y-4">
            <GeneratedId label="pays_id injecté" value={ids.pays_id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom">
                <Input
                  name="nom"
                  placeholder="Autorité nationale des jeux"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
              <Field label="Téléphone">
                <Input
                  name="telephone"
                  placeholder="+221 77 000 00 00"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
              <Field label="Catégorie">
                <Input
                  name="categorie"
                  defaultValue="REGULATEUR"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
              <Field label="Statut">
                <Input
                  name="status"
                  defaultValue="ACTIF"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
              <Field label="Nom admin">
                <Input
                  name="admin_nom"
                  placeholder="Aminata Diallo"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
              <Field label="Email admin">
                <Input
                  name="admin_email"
                  type="email"
                  placeholder="admin@regulateur.sn"
                  required
                  disabled={!ids.role_id || Boolean(ids.regulateur_id)}
                />
              </Field>
            </div>
            <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              isParent est envoyé à true mais l’unicité du régulateur principal est arbitrée côté
              serveur.
            </p>
            <Button
              type="submit"
              disabled={!ids.role_id || loading === "regulateur" || Boolean(ids.regulateur_id)}
            >
              {ids.regulateur_id ? "Régulateur créé" : "Créer le régulateur"}
            </Button>
          </form>
        </StepShell>

        <StepShell stepKey="admin" ids={ids} loading={loading === "admin"} error={errors.admin}>
          <form onSubmit={submitAdmin} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <GeneratedId label="roleId injecté" value={ids.role_id} />
              <GeneratedId label="regulateurId injecté" value={ids.regulateur_id} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <Input
                  name="email"
                  type="email"
                  placeholder="admin@regulateur.sn"
                  required
                  disabled={!ids.regulateur_id || Boolean(ids.admin_id)}
                />
              </Field>
              <Field label="Mot de passe temporaire">
                <Input
                  name="password"
                  type="password"
                  required
                  disabled={!ids.regulateur_id || Boolean(ids.admin_id)}
                />
              </Field>
            </div>
            <Field label="Type projet" hint="societeId est envoyé à NULL pour un admin régulateur.">
              <Input
                name="type_projet"
                defaultValue="REGULATEUR"
                required
                disabled={!ids.regulateur_id || Boolean(ids.admin_id)}
              />
            </Field>
            <Button
              type="submit"
              disabled={!ids.regulateur_id || loading === "admin" || Boolean(ids.admin_id)}
            >
              {ids.admin_id ? "Compte admin créé" : "Créer le compte admin"}
            </Button>
          </form>
        </StepShell>
      </div>
    </div>
  );
}
