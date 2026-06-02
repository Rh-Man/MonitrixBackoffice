"use client";

import Link from "next/link";
import { Building2, Eye, PlusCircle } from "lucide-react";
import { MOCK_REGULATEURS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegulateurListPage() {
  const items = MOCK_REGULATEURS;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Régulateur</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Liste régulateur</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sélectionnez un régulateur pour ouvrir sa fiche via `regulateur/[id]`.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/regulateur/creer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer un régulateur
          </Link>
        </Button>
      </section>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Régulateurs enregistrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">pays_id</th>
                    <th className="px-4 py-3">regulateur_id</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((regulateur) => (
                    <tr key={regulateur.regulateur_id} className="border-t">
                      <td className="px-4 py-3 font-medium">{regulateur.nom}</td>
                      <td className="px-4 py-3">{regulateur.status || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{regulateur.pays_id || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{regulateur.regulateur_id}</td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/regulateur/${regulateur.regulateur_id}`}>
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
              Aucun régulateur disponible dans les données mockées.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
