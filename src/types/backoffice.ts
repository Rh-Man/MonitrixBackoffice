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
}

export interface GeneratedIds {
  pays_id?: string;
  permission_id?: string;
  role_id?: string;
  regulateur_id?: string;
  admin_id?: string;
}
