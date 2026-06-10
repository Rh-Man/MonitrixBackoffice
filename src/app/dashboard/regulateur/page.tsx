"use client";

import Link from "next/link";
import { Building2, Eye, GitBranch, PlusCircle, ShieldCheck } from "lucide-react";
import { MOCK_PAYS, MOCK_REGULATEURS } from "@/lib/mock-data";
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
            Consultez les régulateurs principaux, leurs régulateurs fils et les comptes associés.
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
            Régulateurs et accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Hiérarchie</th>
                    <th className="px-4 py-3">Projet</th>
                    <th className="px-4 py-3">Accès</th>
                    <th className="px-4 py-3">Compte</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((regulateur) => (
                    <tr key={regulateur.regulateur_id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium">{regulateur.nom}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {MOCK_PAYS.find((pays) => pays.pays_id === regulateur.pays_id)?.nom}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                          <GitBranch className="h-3 w-3" />
                          {regulateur.parent_regulateur_id ? "Régulateur fils" : "Principal"}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{regulateur.project_type}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold capitalize text-primary">
                          <ShieldCheck className="h-3 w-3" />
                          {regulateur.access_level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium">
                          {regulateur.account_status.replaceAll("_", " ")}
                        </p>
                        <p className="mt-0.5 max-w-40 truncate text-xs text-muted-foreground">
                          {regulateur.admin_email}
                        </p>
                      </td>
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
