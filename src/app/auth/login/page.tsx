"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, KeyRound, LoaderCircle, Mail, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth-api";
import {
  savePasswordChallenge,
  savePendingSession,
  saveSession,
  toAuthSession,
} from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await login(String(form.get("email")), String(form.get("password")));

      if ("challengeName" in response) {
        savePasswordChallenge({ email: response.email, session: response.session });
        router.push("/auth/change-password");
        return;
      }

      const session = toAuthSession(response);

      if (response.data.role.scope_type !== "monitrix" || response.data.role.access_level !== "owner") {
        throw new Error("Ce backoffice est réservé au Super Admin Monitrix.");
      }

      if (response.data.mfa_active) {
        savePendingSession(session);
        router.push("/auth/mfa");
      } else {
        saveSession(session);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">Monitrix Backoffice</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              Super Admin
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-md border border-sidebar-border bg-sidebar-accent/60 px-3 py-1.5 text-xs">
            Déploiements pays et régulateurs
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
            Créez un environnement pays sans casser les dépendances.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-sidebar-foreground/72">
            Le backoffice orchestre la création des pays, des régulateurs et de leurs comptes avec
            les rôles système définis par le backend.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/50">© 2026 Monitrix · Console interne</p>
      </section>

      <section className="flex items-center justify-center app-surface p-4 sm:p-6 lg:p-12">
        <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-slate-200/70">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Accès réservé
              </p>
              <h2 className="text-xl font-semibold sm:text-2xl tracking-tight">Connexion Super Admin</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Authentifiez-vous pour gérer les déploiements pays Monitrix.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-9"
                    placeholder="superadmin@monitrix.io"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <Button type="submit" size="lg" className="w-full px-4" disabled={loading}>
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Entrer dans le backoffice
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
