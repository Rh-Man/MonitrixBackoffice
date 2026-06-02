import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Monitrix BackOffice — Super Admin",
  description: "Interface d'administration interne pour la gestion des déploiements pays.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
