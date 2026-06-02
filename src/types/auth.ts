export type AuthRole = "Admin" | "Gestionnaire" | "Analyste" | "Support";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  status: "Actif" | "Inactif";
}
