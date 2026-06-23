"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Eye, Globe2, LoaderCircle, PlusCircle } from "lucide-react";
import { listPays } from "@/lib/backoffice-api";
import type { PaysOption } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaysListPage() {
  const [items, setItems] = useState<PaysOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    listPays()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Pays</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Liste des pays</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sélectionnez un pays pour ouvrir sa fiche via `pays/[id]`.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pays/creer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer un pays
          </Link>
        </Button>
      </section>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-primary" />
            Pays enregistrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-10 text-muted-foreground">
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Chargement des pays...
            </div>
          ) : error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : items.length ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Code ISO</th>
                    <th className="px-4 py-3">pays_id</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((pays) => (
                    <tr key={pays.pays_id} className="border-t">
                      <td className="px-4 py-3 font-medium">{pays.nom}</td>
                      <td className="px-4 py-3">{pays.code_iso || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{pays.pays_id}</td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/pays/${pays.pays_id}`}>
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Détail
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              Aucun pays enregistré.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
