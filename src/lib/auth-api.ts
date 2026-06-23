import type { LoginResponse, NewPasswordChallengeResponse } from "@/types/auth";

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL?.replace(/\/$/, "") ?? "";

function requireAuthApiUrl() {
  if (!AUTH_API_URL) {
    throw new Error("NEXT_PUBLIC_AUTH_API_URL n'est pas configurée.");
  }
  return AUTH_API_URL;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function authRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${requireAuthApiUrl()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const payload = await parseResponse(response);
  if (!response.ok) {
    const body = payload as { message?: string } | null;
    throw new Error(body?.message || "Échec de l'authentification.");
  }
  return payload as T;
}

export function login(email: string, password: string) {
  return authRequest<LoginResponse | NewPasswordChallengeResponse>("/monitrix/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password, type_projet: "Betting_regulateur" }),
  });
}

export function completeNewPassword(
  email: string,
  newPassword: string,
  session: string,
) {
  return authRequest<{ message: string; data: { passwordChanged: boolean } }>(
    "/monitrix/auth/admin/change-password",
    {
      method: "POST",
      body: JSON.stringify({ email, newPassword, session }),
    },
  );
}

export function validateMfa(idCognito: string, code: string) {
  return authRequest<{ message: string; data: { validated: boolean } }>(
    `/monitrix/auth/login-mfa/${encodeURIComponent(idCognito)}`,
    { method: "POST", body: JSON.stringify({ code }) },
  );
}

export function updatePassword(token: string, newPassword: string) {
  return authRequest<{ message: string }>("/monitrix/auth/admin/update-password", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ newPassword }),
  });
}
