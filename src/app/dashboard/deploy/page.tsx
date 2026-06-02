"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Database,
  Globe2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { MOCK_PAYS } from "@/lib/mock-data";
import type { GeneratedIds, PaysOption } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
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

export default function DeployPage() {
  const [ids, setIds] = useState<GeneratedIds>({});
  const [paysOptions, setPaysOptions] = useState<PaysOption[]>([]);
  const [countryMode, setCountryMode] = useState<"select" | "create">("select");
  const [loading, setLoading] = useState<StepKey | "pays-list" | null>(null);
  const [errors, setErrors] = useState<Partial<Record<StepKey | "pays-list", string>>>({});

  const completedCount = useMemo(() => STEPS.filter((step) => ids[step.idKey]).length, [ids]);

  useEffect(() => {
    setLoading("pays-list");
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
    setLoading("permission");
    setErrors((current) => ({ ...current, permission: undefined }));
    try {
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
    setLoading("role");
    setErrors((current) => ({ ...current, role: undefined }));
    try {
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
    setLoading("regulateur");
    setErrors((current) => ({ ...current, regulateur: undefined }));
    try {
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
    setLoading("admin");
    setErrors((current) => ({ ...current, admin: undefined }));
    try {
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
      {/* Formulaire de déploiement */}
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-primary">Créer un déploiement</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Ajouter un nouveau pays</h1>
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
