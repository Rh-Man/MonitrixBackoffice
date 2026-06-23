"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { updatePassword } from "@/lib/auth-api";
import { clearSession } from "@/lib/session";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSuccess(false);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get("newPassword") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (!PASSWORD_RULE.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      return;
    }

    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (!session?.token) {
      setError("Session utilisateur introuvable. Reconnectez-vous.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(session.token, password);
      setSuccess(true);
      formElement.reset();
      window.setTimeout(() => {
        clearSession();
        router.replace("/auth/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Compte Super Admin</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Mon profil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Consultez votre compte et sécurisez votre accès au backoffice.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="h-4 w-4 text-primary" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border p-3">
            <p className="text-xs uppercase text-muted-foreground">Nom</p>
            <p className="mt-1 text-sm font-semibold">{session?.nom || "Super Admin"}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs uppercase text-muted-foreground">Email</p>
            <p className="mt-1 truncate text-sm font-semibold">{session?.email || "-"}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs uppercase text-muted-foreground">Scope</p>
            <p className="mt-1 text-sm font-semibold">{session?.role.scope_type || "-"}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs uppercase text-muted-foreground">Niveau d’accès</p>
            <p className="mt-1 text-sm font-semibold">{session?.role.access_level || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-primary" />
            Changer le mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="pl-9"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">Confirmer le mot de passe</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmation"
                  name="confirmation"
                  type="password"
                  className="pl-9"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              12 caractères minimum avec une majuscule, une minuscule, un chiffre et un caractère
              spécial.
            </p>

            {error && (
              <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Mot de passe mis à jour. Reconnexion en cours...</p>
              </div>
            )}

            <Button type="submit" disabled={loading || success}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
