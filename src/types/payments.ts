import type { PaymentStatus } from "@/lib/mock-data";

export interface PaymentTransaction {
  id: string;
  date: string;
  clientId: string;
  status: PaymentStatus;
  amount: number;
  type: "Dépôt" | "Retrait";
  method: string;
  reference: string;
}
