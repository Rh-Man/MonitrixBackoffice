import type { BetStatus } from "@/lib/mock-data";

export interface BetSelection {
  event: string;
  market: string;
  pick: string;
  odds: number;
}

export interface Bet {
  id: string;
  ref: string;
  date: string;
  clientId: string;
  clientName: string;
  gameType: string;
  status: BetStatus;
  stake: number;
  payout: number;
  cashout: boolean;
  odds: number;
  selections: BetSelection[];
}
