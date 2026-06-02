"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Copy, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Une erreur inconnue est survenue.";
}

export default function CreatePaysPage() {
  const [paysId, setPaysId] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submitPays(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setPaysId(`pays_mock_${Date.now().toString().slice(-6)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Pays</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Créer un pays</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mode mock pour l’instant. Le formulaire reste aligné sur `POST
          /monitrix/backoffice/admin/pays`.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-primary" />
            Informations pays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitPays} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input name="nom" placeholder="Sénégal" required disabled={Boolean(paysId)} />
              </div>
              <div className="space-y-2">
                <Label>Code ISO</Label>
                <Input
                  name="code_iso"
                  placeholder="SN"
                  maxLength={3}
                  required
                  disabled={Boolean(paysId)}
                />
              </div>
            </div>

            {error && (
              <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {paysId && (
              <div className="rounded-md border border-success/25 bg-success/5 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Pays créé
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2">
                  <code className="truncate text-sm font-semibold">{paysId}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(paysId)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copier pays_id"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading || Boolean(paysId)}>
                {paysId ? "Pays créé" : loading ? "Création..." : "Créer le pays"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/pays">Retour à la liste</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
