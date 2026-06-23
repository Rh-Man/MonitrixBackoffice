"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Copy,
  GitBranch,
  KeyRound,
  LoaderCircle,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  getRegulateur,
  listRegulateurs,
  resendAccountInvitation,
  updateAccountStatus,
} from "@/lib/backoffice-api";
import type { RegulateurOption } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegulateurDetailPage() {
  const params = useParams<{ id: string }>();
  const [regulateur, setRegulateur] = useState<RegulateurOption>();
  const [allRegulateurs, setAllRegulateurs] = useState<RegulateurOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = () => {
    setLoading(true);
    Promise.all([getRegulateur(params.id), listRegulateurs()])
      .then(([item, items]) => {
        setRegulateur(item);
        setAllRegulateurs(items);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [params.id]);

  const parent = useMemo(
    () =>
      regulateur?.parent_regulateur_id
        ? allRegulateurs.find(
            (item) => item.regulateur_id === regulateur.parent_regulateur_id,
          )
        : undefined,
    [allRegulateurs, regulateur],
  );
  const children = allRegulateurs.filter(
    (item) => item.parent_regulateur_id === params.id,
  );

  async function changeStatus(accountId: string, currentStatus: string) {
    try {
      await updateAccountStatus(
        accountId,
        currentStatus.toLowerCase() === "active" ? "inactive" : "active",
      );
      toast.success("Statut du compte mis à jour.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mise à jour impossible.");
    }
  }

  async function resendInvitation(accountId: string) {
    try {
      await resendAccountInvitation(accountId);
      toast.success("Invitation renvoyée.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Envoi impossible.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Régulateur / {params.id}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Détail du régulateur</h1>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Chargement du régulateur...
        </div>
      )}

      {!loading && (error || !regulateur) && (
        <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error || "Régulateur introuvable."}</p>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              Fiche régulateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {regulateur ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Nom", regulateur.nom],
                  ["Téléphone", regulateur.telephone || "-"],
                  ["Statut", regulateur.status || "-"],
                  ["Admin", regulateur.admin_nom || "-"],
                  ["Email admin", regulateur.admin_email || "-"],
                  [
                    "Pays",
                    regulateur.pays_nom || regulateur.pays_code || "-",
                  ],
                  ["regulateur_id", regulateur.regulateur_id],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border p-3">
                    <p className="text-xs uppercase text-muted-foreground">{label}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <code className="truncate text-sm font-semibold">{value}</code>
                      {label.endsWith("_id") && (
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(value)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`Copier ${label}`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <Button asChild variant="outline">
              <Link href="/dashboard/regulateur">Retour à la liste</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-4 w-4 text-primary" />
                Accès attribué
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {regulateur &&
                [
                  ["scope_type", "regulateur"],
                  ["project_type", regulateur.project_type],
                  ["access_level", regulateur.access_level],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <code className="text-xs font-semibold text-primary">{value}</code>
                  </div>
                ))}
              {regulateur?.accounts?.map((account) => (
                <div key={account.id} className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{account.email}</p>
                      <p className="text-[10px] capitalize text-muted-foreground">
                        {account.status} · {account.access_level}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => changeStatus(account.id, account.status)}
                    >
                      {account.status.toLowerCase() === "active" ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resendInvitation(account.id)}
                    >
                      <RefreshCw className="mr-1 h-3.5 w-3.5" />
                      Invitation
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="h-4 w-4 text-primary" />
                Hiérarchie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Régulateur parent</p>
                <p className="mt-1 font-semibold">
                  {parent?.nom || "Aucun · régulateur principal"}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Régulateurs fils</p>
                <p className="mt-1 font-semibold">{children.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
