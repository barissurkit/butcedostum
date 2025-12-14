import type { Transaction } from "@/types/transaction";

type Store = {
  transactions: Transaction[];
};

const initial: Transaction[] = [
  { id: "t1", title: "Maaş", type: "income", amount: 22000, date: "2025-12-10" },
  { id: "t2", title: "Market", type: "expense", amount: 420, date: "2025-12-11" },
  { id: "t3", title: "Ulaşım", type: "expense", amount: 90, date: "2025-12-11" },
  { id: "t4", title: "Freelance", type: "income", amount: 3500, date: "2025-12-12" },
];

const g = globalThis as unknown as { __txStore?: Store };

if (!g.__txStore) {
  g.__txStore = { transactions: initial };
}

export const txStore = g.__txStore;
