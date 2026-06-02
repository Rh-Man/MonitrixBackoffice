"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Mail, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

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
            Le backoffice respecte l’ordre des contraintes FK: pays, permission, rôle, régulateur,
            puis compte administrateur.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/50">© 2026 Monitrix · Console interne</p>
      </section>

      <section className="flex items-center justify-center app-surface p-6 lg:p-12">
        <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-slate-200/70">
          <CardContent className="p-8">
            <div className="mb-7">
              <p className="mb-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Accès réservé
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">Connexion Super Admin</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Authentifiez-vous pour gérer les déploiements pays Monitrix.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                router.push("/dashboard");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
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
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full px-4">
                Entrer dans le backoffice
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
