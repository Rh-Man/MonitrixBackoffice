import type { PaysOption, RegulateurOption } from "@/types/backoffice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const ENDPOINTS = {
  pays: "/monitrix/backoffice/admin/pays",
  permissions: "/monitrix/backoffice/admin/permissions",
  roles: "/monitrix/backoffice/admin/roles",
  regulateur: "/monitrix/backoffice/admin/regulateur",
  admin: "/monitrix/auth/admin",
};

interface ApiEnvelope<T> {
  data?: T;
  items?: T;
  results?: T;
  message?: string;
  error?: string;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
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
    const error = new Error(message) as Error & { status?: number; details?: unknown };
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload as T;
}

export function extractId(payload: unknown, keys: string[]) {
  const queue: unknown[] = [payload];

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object") continue;

    for (const key of keys) {
      const value = (current as Record<string, unknown>)[key];
      if (typeof value === "string" || typeof value === "number") return String(value);
    }

    for (const value of Object.values(current as Record<string, unknown>)) {
      if (value && typeof value === "object") queue.push(value);
    }
  }

  return undefined;
}

export async function listPays(): Promise<PaysOption[]> {
  const payload = await request<ApiEnvelope<unknown> | unknown[]>(ENDPOINTS.pays, {
    method: "GET",
  });
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

  return raw
    .map((item) => {
      const record = item as Record<string, unknown>;
      const id = extractId(record, ["pays_id", "id", "paysId"]);
      if (!id) return null;
      return {
        pays_id: id,
        nom: String(record.nom ?? record.name ?? "Pays sans nom"),
        code_iso: String(record.code_iso ?? record.codeISO ?? record.code ?? ""),
      };
    })
    .filter(Boolean) as PaysOption[];
}

export async function getPays(paysId: string): Promise<PaysOption | undefined> {
  const items = await listPays();
  return items.find((item) => item.pays_id === paysId);
}

export async function listRegulateurs(): Promise<RegulateurOption[]> {
  const payload = await request<ApiEnvelope<unknown> | unknown[]>(ENDPOINTS.regulateur, {
    method: "GET",
  });
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

  return raw
    .map((item) => {
      const record = item as Record<string, unknown>;
      const id = extractId(record, ["regulateur_id", "id", "regulateurId"]);
      if (!id) return null;
      return {
        regulateur_id: id,
        nom: String(record.nom ?? record.name ?? "Régulateur sans nom"),
        telephone: String(record.telephone ?? record.phone ?? ""),
        categorie: String(record.categorie ?? record.category ?? ""),
        status: String(record.status ?? record.statut ?? ""),
        admin_email: String(record.admin_email ?? record.adminEmail ?? ""),
        admin_nom: String(record.admin_nom ?? record.adminNom ?? ""),
        pays_id: String(record.pays_id ?? record.paysId ?? ""),
      };
    })
    .filter(Boolean) as RegulateurOption[];
}

export async function getRegulateur(regulateurId: string): Promise<RegulateurOption | undefined> {
  const items = await listRegulateurs();
  return items.find((item) => item.regulateur_id === regulateurId);
}

export async function createPays(body: { nom: string; code_iso: string }) {
  return request<unknown>(ENDPOINTS.pays, { method: "POST", body: JSON.stringify(body) });
}

export async function createPermission(body: {
  libelle: string;
  code: string;
  desc_permission: string;
}) {
  return request<unknown>(ENDPOINTS.permissions, { method: "POST", body: JSON.stringify(body) });
}

export async function createRole(body: { libelle: string; code: string; permission_id: string }) {
  return request<unknown>(ENDPOINTS.roles, { method: "POST", body: JSON.stringify(body) });
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
}) {
  return request<unknown>(ENDPOINTS.regulateur, { method: "POST", body: JSON.stringify(body) });
}

export async function createAdminAccount(body: {
  email: string;
  password: string;
  roleId: string;
  type_projet: string;
  regulateurId: string;
  societeId: null;
}) {
  return request<unknown>(ENDPOINTS.admin, { method: "POST", body: JSON.stringify(body) });
}
