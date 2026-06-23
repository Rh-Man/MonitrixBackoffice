import { clearSession, getSession } from "@/lib/session";
import type {
  AccessLevel,
  AccountOption,
  DashboardStats,
  PaysOption,
  ProjectType,
  RegulateurAccessLevel,
  RegulateurOption,
  ScopeType,
} from "@/types/backoffice";

const BACKOFFICE_API_URL =
  process.env.NEXT_PUBLIC_BACKOFFICE_API_URL?.replace(/\/$/, "") ?? "";

const ENDPOINTS = {
  pays: "/monitrix/backoffice/admin/pays",
  regulateur: "/monitrix/backoffice/admin/regulateur",
  accounts: "/monitrix/backoffice/admin/accounts",
  dashboard: "/monitrix/backoffice/admin/dashboard",
};

interface ApiEnvelope<T> {
  data?: T;
  message?: string;
  error?: string;
  id?: string | number;
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function requireApiUrl() {
  if (!BACKOFFICE_API_URL) {
    throw new Error("NEXT_PUBLIC_BACKOFFICE_API_URL n'est pas configurée.");
  }
  return BACKOFFICE_API_URL;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    const first = JSON.parse(text) as unknown;
    return typeof first === "string" && first.trim().startsWith("{") ? JSON.parse(first) : first;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getSession();
  const response = await fetch(`${requireApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init.headers,
    },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    const info = payload as ApiEnvelope<unknown> | string | null;
    const message =
      typeof info === "string"
        ? info.trim().startsWith("<!DOCTYPE")
          ? `Erreur API ${response.status}`
          : info
        : info?.message || info?.error || `Erreur API ${response.status}`;

    if (response.status === 401) {
      clearSession();
      if (typeof window !== "undefined") window.location.assign("/auth/login");
    }
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapAccount(record: Record<string, unknown>): AccountOption {
  return {
    id: String(record.id ?? ""),
    idCognito: String(record.idCognito ?? record.idcognito ?? ""),
    email: String(record.email ?? record.admin_email ?? ""),
    status: String(record.compte_rds_status ?? record.status ?? ""),
    scope_type: String(record.scope_type ?? "regulateur") as ScopeType,
    project_type: record.project_type
      ? (String(record.project_type) as ProjectType)
      : null,
    access_level: String(record.access_level ?? "admin") as AccessLevel,
    regulateur_id: record.regulateur_id ? String(record.regulateur_id) : undefined,
    regulateur_nom: record.regulateur_nom ? String(record.regulateur_nom) : undefined,
    pays_id: record.pays_id ? String(record.pays_id) : undefined,
    pays_nom: record.pays_nom ? String(record.pays_nom) : undefined,
  };
}

function mapPays(record: Record<string, unknown>): PaysOption {
  return {
    pays_id: String(record.id ?? record.pays_id ?? ""),
    nom: String(record.nom ?? "Pays sans nom"),
    code_iso: String(record.code ?? record.code_iso ?? ""),
    total_regulateurs:
      record.total_regulateurs === undefined ? undefined : numberValue(record.total_regulateurs),
    total_societes:
      record.total_societes === undefined ? undefined : numberValue(record.total_societes),
  };
}

function mapRegulateur(
  record: Record<string, unknown>,
  account?: AccountOption,
): RegulateurOption {
  const rawAccounts = Array.isArray(record.accounts)
    ? record.accounts.map((item) => mapAccount(item as Record<string, unknown>))
    : account
      ? [account]
      : [];
  const primaryAccount = rawAccounts[0] ?? account;

  return {
    regulateur_id: String(record.id ?? record.regulateur_id ?? ""),
    nom: String(record.nom ?? "Régulateur sans nom"),
    telephone: String(record.telephone ?? ""),
    categorie: String(record.categorie ?? ""),
    status: String(record.status ?? ""),
    admin_email: String(record.admin_email ?? primaryAccount?.email ?? ""),
    admin_nom: String(record.admin_nom ?? ""),
    pays_id: String(record.pays_id ?? ""),
    pays_nom: record.pays_nom ? String(record.pays_nom) : account?.pays_nom,
    pays_code: record.pays_code ? String(record.pays_code) : undefined,
    is_parent: Boolean(record.isParent ?? record.isparent),
    parent_regulateur_id: record.parent_regulateur_id
      ? String(record.parent_regulateur_id)
      : null,
    project_type: (primaryAccount?.project_type ?? "betting") as ProjectType,
    access_level: (primaryAccount?.access_level ?? "admin") as RegulateurAccessLevel,
    account_status: primaryAccount?.status || "inconnu",
    accounts: rawAccounts,
  };
}

export async function listAccounts() {
  const payload = await request<ApiEnvelope<unknown[]>>(ENDPOINTS.accounts);
  return (payload.data ?? []).map((item) => mapAccount(item as Record<string, unknown>));
}

export async function listPays() {
  const payload = await request<ApiEnvelope<unknown[]>>(ENDPOINTS.pays);
  return (payload.data ?? []).map((item) => mapPays(item as Record<string, unknown>));
}

export async function getPays(paysId: string) {
  const payload = await request<ApiEnvelope<Record<string, unknown>>>(
    `${ENDPOINTS.pays}/${encodeURIComponent(paysId)}`,
  );
  return payload.data ? mapPays(payload.data) : undefined;
}

export async function createPays(body: { nom: string; code: string }) {
  const payload = await request<ApiEnvelope<Record<string, unknown>>>(ENDPOINTS.pays, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return String(payload.id ?? payload.data?.id ?? "");
}

export async function listRegulateurs() {
  const [regulateursPayload, accounts] = await Promise.all([
    request<ApiEnvelope<unknown[]>>(ENDPOINTS.regulateur),
    listAccounts(),
  ]);
  const accountsByRegulateur = new Map(
    accounts
      .filter((account) => account.regulateur_id)
      .map((account) => [account.regulateur_id as string, account]),
  );

  return (regulateursPayload.data ?? []).map((item) => {
    const record = item as Record<string, unknown>;
    const id = String(record.id ?? record.regulateur_id ?? "");
    return mapRegulateur(record, accountsByRegulateur.get(id));
  });
}

export async function getRegulateur(regulateurId: string) {
  const payload = await request<ApiEnvelope<Record<string, unknown>>>(
    `${ENDPOINTS.regulateur}/${encodeURIComponent(regulateurId)}`,
  );
  return payload.data ? mapRegulateur(payload.data) : undefined;
}

export async function createRegulateur(body: {
  nom: string;
  telephone: string;
  categorie: string;
  status: string;
  admin_email: string;
  admin_nom: string;
  isParent: boolean;
  pays_id: string;
  parent_regulateur_id: string | null;
  project_type: ProjectType;
  access_level: RegulateurAccessLevel;
}) {
  const payload = await request<
    ApiEnvelope<{ regulateur?: { id?: string | number }; account?: { idCognito?: string } }>
  >(ENDPOINTS.regulateur, { method: "POST", body: JSON.stringify(body) });

  return {
    regulateurId: String(payload.id ?? payload.data?.regulateur?.id ?? ""),
    accountId: String(payload.data?.account?.idCognito ?? ""),
  };
}

export async function getDashboardStats() {
  const payload = await request<ApiEnvelope<Record<string, unknown>>>(ENDPOINTS.dashboard);
  const data = payload.data ?? {};
  return {
    totalSocietes: numberValue(data.totalSocietes),
    totalRegulateurs: numberValue(data.totalRegulateurs),
    totalDocuments: numberValue(data.totalDocuments),
    totalPays: numberValue(data.totalPays),
    totalComptes: numberValue(data.totalComptes),
    societesByType: (data.societesByType as DashboardStats["societesByType"]) ?? [],
    regulateursByStatus:
      (data.regulateursByStatus as DashboardStats["regulateursByStatus"]) ?? [],
    regulateursByCategory:
      (data.regulateursByCategory as DashboardStats["regulateursByCategory"]) ?? [],
    regulateursByCountry:
      (data.regulateursByCountry as DashboardStats["regulateursByCountry"]) ?? [],
  } satisfies DashboardStats;
}

export function updateAccountStatus(accountId: string, status: string) {
  return request<ApiEnvelope<unknown>>(
    `${ENDPOINTS.accounts}/${encodeURIComponent(accountId)}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

export function resendAccountInvitation(accountId: string) {
  return request<ApiEnvelope<unknown>>(
    `${ENDPOINTS.accounts}/${encodeURIComponent(accountId)}/resend-invitation`,
    { method: "POST" },
  );
}
