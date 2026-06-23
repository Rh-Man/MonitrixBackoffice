import type { AccessLevel, ProjectType, ScopeType } from "@/types/backoffice";

export interface StructuredRole {
  scope_type: ScopeType;
  project_type: ProjectType | null;
  access_level: AccessLevel;
}

export interface AuthSession {
  idCognito: string;
  token: string;
  email: string;
  nom: string;
  prenom?: string;
  roleCode?: string;
  role: StructuredRole;
}

export interface LoginResponse {
  message: string;
  data: {
    id: string;
    idCognito: string;
    token: string;
    email: string;
    nom?: string;
    prenom?: string;
    roleCode?: string;
    role: StructuredRole;
    access: boolean;
    mfa_active: boolean;
  };
}

export interface NewPasswordChallengeResponse {
  message: string;
  challengeName: "NEW_PASSWORD_REQUIRED";
  session: string;
  email: string;
}

export interface NewPasswordChallenge {
  session: string;
  email: string;
}
