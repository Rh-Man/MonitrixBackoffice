export type ScopeType = "monitrix" | "regulateur" | "societe";
export type ProjectType = "betting" | "payment" | "monitoring";
export type AccessLevel = "owner" | "admin" | "viewer" | "developer";
export type RegulateurAccessLevel = Extract<AccessLevel, "admin" | "viewer">;

export interface PaysOption {
  pays_id: string;
  nom: string;
  code_iso: string;
  total_regulateurs?: number;
  total_societes?: number;
}

export interface AccountOption {
  id: string;
  idCognito: string;
  email: string;
  status: string;
  scope_type: ScopeType;
  project_type: ProjectType | null;
  access_level: AccessLevel;
  regulateur_id?: string;
  regulateur_nom?: string;
  pays_id?: string;
  pays_nom?: string;
}

export interface RegulateurOption {
  regulateur_id: string;
  nom: string;
  telephone: string;
  categorie: string;
  status: string;
  admin_email: string;
  admin_nom: string;
  pays_id: string;
  pays_nom?: string;
  pays_code?: string;
  is_parent: boolean;
  parent_regulateur_id: string | null;
  project_type: ProjectType;
  access_level: RegulateurAccessLevel;
  account_status: string;
  accounts?: AccountOption[];
}

export interface DashboardStats {
  totalSocietes: number;
  totalRegulateurs: number;
  totalDocuments: number;
  totalPays: number;
  totalComptes: number;
  societesByType: Array<{ dtype: string; count: number }>;
  regulateursByStatus: Array<{ status: string; count: number }>;
  regulateursByCategory: Array<{ categorie: string; count: number }>;
  regulateursByCountry: Array<{ pays_id: string; pays: string; code: string; count: number }>;
}
