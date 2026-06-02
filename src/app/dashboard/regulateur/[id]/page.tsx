"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, Building2, Copy } from "lucide-react";
import { MOCK_REGULATEURS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegulateurDetailPage() {
  const params = useParams<{ id: string }>();
  const regulateur = MOCK_REGULATEURS.find((item) => item.regulateur_id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Régulateur / {params.id}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Détail du régulateur</h1>
      </div>

      {!regulateur && (
        <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Régulateur introuvable dans les données mockées.</p>
        </div>
      )}

      <Card className="border-border/60 shadow-sm">
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
                ["Catégorie", regulateur.categorie || "-"],
                ["Statut", regulateur.status || "-"],
                ["Admin", regulateur.admin_nom || "-"],
                ["Email admin", regulateur.admin_email || "-"],
                ["pays_id", regulateur.pays_id || "-"],
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
    </div>
  );
}
