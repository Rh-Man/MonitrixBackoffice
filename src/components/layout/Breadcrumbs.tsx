"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  auth: "Authentification",
  betting: "Paris",
  payments: "Paiements",
  kyc: "KYC",
  taxes: "Taxes",
  audit: "Audit",
  alerts: "Alertes",
  reports: "Rapports",
  documents: "Documents",
  settings: "Paramètres",
  profil: "Profil",
  login: "Connexion",
  mfa: "MFA",
  reset: "Réinitialisation",
  onboarding: "Onboarding",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
      <span>Monitrix</span>
      {crumbs.map((crumb, index) => (
        <span key={`${crumb}-${index}`} className="flex items-center gap-1.5">
          <span>/</span>
          <span
            className={
              index === crumbs.length - 1 ? "text-foreground font-medium capitalize" : "capitalize"
            }
          >
            {LABELS[crumb] ?? crumb.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </nav>
  );
}
