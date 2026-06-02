"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Building2, CheckCircle2, Copy } from "lucide-react";
import { MOCK_PAYS } from "@/lib/mock-data";
import type { PaysOption } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Une erreur inconnue est survenue.";
}

export default function CreateRegulateurPage() {
  const [paysOptions, setPaysOptions] = useState<PaysOption[]>([]);
  const [regulateurId, setRegulateurId] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPaysOptions(MOCK_PAYS);
  }, []);

  async function submitRegulateur(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setRegulateurId(`reg_mock_${Date.now().toString().slice(-6)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Régulateur</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Créer un régulateur</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mode mock pour l’instant. Le formulaire reste aligné sur `POST
          /monitrix/backoffice/admin/regulateur`.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Informations régulateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitRegulateur} className="space-y-4">
            <div className="space-y-2">
              <Label>Pays</Label>
              <select
                name="pays_id"
                required
                disabled={Boolean(regulateurId)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Choisir un pays</option>
                {paysOptions.map((pays) => (
                  <option key={pays.pays_id} value={pays.pays_id}>
                    {pays.nom} · {pays.code_iso} · {pays.pays_id}
                  </option>
                ))}
              </select>
              {!paysOptions.length && (
                <p className="text-xs text-muted-foreground">
                  Aucun pays chargé. Créez d’abord un pays ou vérifiez le endpoint de liste.
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  name="nom"
                  placeholder="Autorité nationale des jeux"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  name="telephone"
                  placeholder="+221 77 000 00 00"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Input
                  name="categorie"
                  defaultValue="REGULATEUR"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Input
                  name="status"
                  defaultValue="ACTIF"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom admin</Label>
                <Input
                  name="admin_nom"
                  placeholder="Aminata Diallo"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email admin</Label>
                <Input
                  name="admin_email"
                  type="email"
                  placeholder="admin@regulateur.sn"
                  required
                  disabled={Boolean(regulateurId)}
                />
              </div>
            </div>

            <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              `isParent` est envoyé à `true`, mais l’unicité du principal par pays reste arbitrée
              côté serveur.
            </p>

            {error && (
              <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {regulateurId && (
              <div className="rounded-md border border-success/25 bg-success/5 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Régulateur créé
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2">
                  <code className="truncate text-sm font-semibold">{regulateurId}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(regulateurId)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copier regulateur_id"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading || Boolean(regulateurId)}>
                {regulateurId ? "Régulateur créé" : loading ? "Création..." : "Créer le régulateur"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/regulateur">Retour à la liste</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
