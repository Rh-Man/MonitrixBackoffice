"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  KeyRound,
  MailCheck,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import type {
  PaysOption,
  ProjectType,
  RegulateurAccessLevel,
  RegulateurOption,
} from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createRegulateur, listPays, listRegulateurs } from "@/lib/backoffice-api";

const PROJECTS: Array<{ value: ProjectType; label: string; detail: string }> = [
  { value: "betting", label: "Betting", detail: "Inclut automatiquement Payment" },
  { value: "payment", label: "Payment", detail: "Accès limité au produit Payment" },
  { value: "monitoring", label: "Monitoring", detail: "Supervision et alertes" },
];

const ACCESS_LEVELS: Array<{
  value: RegulateurAccessLevel;
  label: string;
  detail: string;
}> = [
  { value: "admin", label: "Admin", detail: "Lecture et écriture sur son périmètre" },
  { value: "viewer", label: "Viewer", detail: "Consultation uniquement" },
];

export default function CreateRegulateurPage() {
  const [parentId, setParentId] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("betting");
  const [accessLevel, setAccessLevel] = useState<RegulateurAccessLevel>("admin");
  const [result, setResult] = useState<{ regulateurId: string; accountId: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string>();
  const [pays, setPays] = useState<PaysOption[]>([]);
  const [regulateurs, setRegulateurs] = useState<RegulateurOption[]>([]);

  useEffect(() => {
    Promise.all([listPays(), listRegulateurs()])
      .then(([paysItems, regulateurItems]) => {
        setPays(paysItems);
        setRegulateurs(regulateurItems);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const selectedParent = useMemo(
    () => regulateurs.find((item) => item.regulateur_id === parentId),
    [parentId, regulateurs],
  );

  async function submitRegulateur(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const created = await createRegulateur({
        nom: String(form.get("nom")).trim(),
        telephone: String(form.get("telephone")).trim(),
        categorie: String(form.get("categorie")).trim(),
        status: String(form.get("status")),
        admin_email: String(form.get("admin_email")).trim(),
        admin_nom: String(form.get("admin_nom")).trim(),
        isParent: !parentId,
        pays_id: String(form.get("pays_id")),
        parent_regulateur_id: parentId || null,
        project_type: projectType,
        access_level: accessLevel,
      });
      setResult(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible.");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { label: "Régulateur", icon: Building2 },
    { label: "Rôle résolu", icon: ShieldCheck },
    { label: "Compte créé", icon: UserPlus },
    { label: "Invitation envoyée", icon: MailCheck },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Nouveau déploiement</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Créer un régulateur et son compte
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Le rôle système et le compte utilisateur sont créés automatiquement à partir du projet
            et du niveau d’accès sélectionnés.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/regulateur">Retour à la liste</Link>
        </Button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              Configuration du régulateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitRegulateur} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pays</Label>
                  <select
                    name="pays_id"
                    required
                    disabled={Boolean(result) || loadingOptions}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Choisir un pays</option>
                    {pays.map((item) => (
                      <option key={item.pays_id} value={item.pays_id}>
                        {item.nom} · {item.code_iso}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Régulateur parent</Label>
                  <select
                    name="parent_regulateur_id"
                    value={parentId}
                    onChange={(event) => setParentId(event.target.value)}
                    disabled={Boolean(result)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Aucun · Régulateur principal</option>
                    {regulateurs.filter((item) => item.is_parent).map((item) => (
                      <option key={item.regulateur_id} value={item.regulateur_id}>
                        {item.nom}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {selectedParent
                      ? `Ce régulateur sera rattaché à ${selectedParent.nom}.`
                      : "Sans parent, il devient le régulateur principal du pays."}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom du régulateur</Label>
                  <Input
                    name="nom"
                    placeholder="Autorité nationale des jeux"
                    required
                    disabled={Boolean(result)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Input
                    name="categorie"
                    placeholder="Jeux et paris"
                    required
                    disabled={Boolean(result)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <select
                    name="status"
                    defaultValue="active"
                    disabled={Boolean(result)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    name="telephone"
                    placeholder="+221 77 000 00 00"
                    required
                    disabled={Boolean(result)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom du responsable</Label>
                  <Input
                    name="admin_nom"
                    placeholder="Aminata Diallo"
                    required
                    disabled={Boolean(result)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de connexion</Label>
                  <Input
                    name="admin_email"
                    type="email"
                    placeholder="admin@regulateur.sn"
                    required
                    disabled={Boolean(result)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Label>Projet</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PROJECTS.map((project) => (
                    <button
                      key={project.value}
                      type="button"
                      onClick={() => setProjectType(project.value)}
                      disabled={Boolean(result)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-colors",
                        projectType === project.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      <p className="text-sm font-semibold">{project.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{project.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Niveau d’accès du compte</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ACCESS_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setAccessLevel(level.value)}
                      disabled={Boolean(result)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-colors",
                        accessLevel === level.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      <p className="text-sm font-semibold">{level.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{level.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              {result && (
                <div className="rounded-lg border border-success/25 bg-success/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Régulateur et compte créés
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[
                      ["regulateur_id", result.regulateurId],
                      ["account_id", result.accountId],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-md bg-background px-3 py-2"
                      >
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
                          <code className="text-xs font-semibold">{value}</code>
                        </div>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(value)}>
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" disabled={loading || loadingOptions || Boolean(result)}>
                {result
                  ? "Création terminée"
                  : loading
                    ? "Création en cours..."
                    : "Créer le régulateur et le compte"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-4 w-4 text-primary" />
                Rôle attribué
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["scope_type", "regulateur"],
                ["project_type", projectType],
                ["access_level", accessLevel],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <code className="text-xs font-semibold text-primary">{value}</code>
                </div>
              ))}
              {projectType === "betting" && (
                <p className="rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
                  Le projet Betting donne automatiquement accès à Payment.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Traitement automatique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium">{step.label}</span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
