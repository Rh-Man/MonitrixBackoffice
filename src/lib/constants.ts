export const APP_NAME = "Monitrix";
export const APP_VERSION = "1.0";

export const DASHBOARD_ROUTES = {
  home: "/dashboard",
  betting: "/dashboard/betting/dashboard",
  payments: "/dashboard/payments/dashboard",
  kyc: "/dashboard/kyc/all",
  taxes: "/dashboard/taxes",
  audit: "/dashboard/audit/logs",
  alerts: "/dashboard/alerts",
  reports: "/dashboard/reports",
  documents: "/dashboard/documents",
  settings: "/dashboard/settings",
  profile: "/dashboard/profil",
} as const;

export const AUTH_ROUTES = {
  login: "/auth/login",
  mfa: "/auth/mfa",
  reset: "/auth/reset",
  onboarding: "/auth/onboarding",
  user: "/auth/user",
} as const;
