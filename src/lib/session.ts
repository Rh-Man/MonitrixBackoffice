import type {
  AuthSession,
  LoginResponse,
  NewPasswordChallenge,
} from "@/types/auth";

const SESSION_KEY = "monitrix_backoffice_session";
const PENDING_SESSION_KEY = "monitrix_backoffice_pending_session";
const PASSWORD_CHALLENGE_KEY = "monitrix_backoffice_password_challenge";

function canUseStorage() {
  return typeof window !== "undefined";
}

function read<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  const value = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function toAuthSession(response: LoginResponse): AuthSession {
  return {
    idCognito: response.data.idCognito || response.data.id,
    token: response.data.token,
    email: response.data.email,
    nom: response.data.nom || "Super Admin",
    prenom: response.data.prenom,
    roleCode: response.data.roleCode,
    role: response.data.role,
  };
}

export function getSession() {
  return read<AuthSession>(SESSION_KEY);
}

export function saveSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.sessionStorage.removeItem(PENDING_SESSION_KEY);
  window.dispatchEvent(new Event("monitrix-session-change"));
}

export function getPendingSession() {
  return read<AuthSession>(PENDING_SESSION_KEY);
}

export function savePendingSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(PENDING_SESSION_KEY, JSON.stringify(session));
}

export function getPasswordChallenge() {
  return read<NewPasswordChallenge>(PASSWORD_CHALLENGE_KEY);
}

export function savePasswordChallenge(challenge: NewPasswordChallenge) {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(PASSWORD_CHALLENGE_KEY, JSON.stringify(challenge));
}

export function clearPasswordChallenge() {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(PASSWORD_CHALLENGE_KEY);
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(PENDING_SESSION_KEY);
  window.sessionStorage.removeItem(PASSWORD_CHALLENGE_KEY);
  window.dispatchEvent(new Event("monitrix-session-change"));
}
