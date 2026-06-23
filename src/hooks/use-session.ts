"use client";

import { useEffect, useState } from "react";

import { getSession } from "@/lib/session";
import type { AuthSession } from "@/types/auth";

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return session;
}
