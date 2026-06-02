import type { KycStatus } from "@/lib/mock-data";

export interface KycUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  status: KycStatus;
  documentType: string;
  limit: number;
  verifiedBy: string;
  date: string;
}
