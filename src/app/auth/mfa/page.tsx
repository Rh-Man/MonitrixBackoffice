"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateMfa } from "@/lib/auth-api";
import { getPendingSession, saveSession } from "@/lib/session";

export default function MfaPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getPendingSession()) router.replace("/auth/login");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getPendingSession();
    if (!session) return router.replace("/auth/login");

    setError(undefined);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await validateMfa(session.idCognito, String(form.get("code")));
      saveSession(session);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code invalide.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center app-surface p-6">
      <Card className="w-full max-w-md border-border/70 shadow-xl">
        <CardContent className="p-8">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold">Vérification MFA</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saisissez le code à six chiffres envoyé à votre adresse email.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="pl-9 font-mono tracking-[0.3em]"
                  placeholder="000000"
                  required
                  autoFocus
                />
              </div>
            </div>
            {error && (
              <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Valider le code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
