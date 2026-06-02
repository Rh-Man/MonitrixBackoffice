"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, Copy, Globe2 } from "lucide-react";
import { MOCK_PAYS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaysDetailPage() {
  const params = useParams<{ id: string }>();
  const pays = MOCK_PAYS.find((item) => item.pays_id === params.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Pays / {params.id}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Détail du pays</h1>
      </div>

      {!pays && (
        <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Pays introuvable dans les données mockées.</p>
        </div>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-primary" />
            Fiche pays
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pays ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-xs uppercase text-muted-foreground">Nom</p>
                <p className="mt-1 font-semibold">{pays.nom}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs uppercase text-muted-foreground">Code ISO</p>
                <p className="mt-1 font-semibold">{pays.code_iso || "-"}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs uppercase text-muted-foreground">pays_id</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="truncate text-sm font-semibold">{pays.pays_id}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(pays.pays_id)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copier pays_id"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <Button asChild variant="outline">
            <Link href="/dashboard/pays">Retour à la liste</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
