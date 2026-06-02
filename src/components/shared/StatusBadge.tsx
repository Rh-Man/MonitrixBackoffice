import { cn } from "@/lib/utils";

type Variant = "success" | "destructive" | "warning" | "info" | "muted" | "primary";

const styles: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/15 text-primary border-primary/30",
};

const map: Record<string, Variant> = {
  // bets
  Won: "success",
  Lost: "destructive",
  Pending: "warning",
  Cancelled: "muted",
  Refunded: "info",
  Cashout: "primary",
  // payments
  Réussie: "success",
  Échouée: "destructive",
  "En attente": "warning",
  Annulée: "muted",
  // KYC
  Vérifié: "success",
  Rejeté: "destructive",
  // tax / reversements
  payée: "success",
  payée_automatique: "success",
  approuvé: "success",
  traité: "success",
  en_attente: "warning",
  en_attente_de_confirmation: "warning",
  initié: "info",
  en_retard: "destructive",
  rejeté: "destructive",
  annulée: "muted",
  // alerts severity
  low: "muted",
  medium: "info",
  high: "warning",
  critical: "destructive",
  open: "warning",
  acknowledged: "info",
  closed: "muted",
  Actif: "success",
  Inactif: "muted",
};

export function StatusBadge({ status }: { status: string }) {
  const v = map[status] ?? "muted";
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[v],
      )}
    >
      {label}
    </span>
  );
}
