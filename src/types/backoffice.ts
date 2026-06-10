export interface PaysOption {
  pays_id: string;
  nom: string;
  code_iso: string;
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
  parent_regulateur_id: string | null;
  project_type: ProjectType;
  access_level: AccessLevel;
  account_status: "ACTIF" | "INVITATION_ENVOYEE" | "EN_ATTENTE";
}

export type ScopeType = "monitrix" | "regulateur" | "societe";
export type ProjectType = "betting" | "payment" | "monitoring";
export type AccessLevel = "owner" | "admin" | "viewer";
