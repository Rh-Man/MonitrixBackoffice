export interface PaysOption {
  pays_id: string;
  nom: string;
  code_iso: string;
}

export interface GeneratedIds {
  pays_id?: string;
  permission_id?: string;
  role_id?: string;
  regulateur_id?: string;
  admin_id?: string;
}
