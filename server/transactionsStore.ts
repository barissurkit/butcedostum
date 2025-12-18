import type { Transaction } from "@/types/transaction";

type Store = {
  transactions: Transaction[];
};

const initial: Transaction[] = [
  { id: "t1", title: "Maaş", type: "income", amount: 22000, date: "2025-12-10", category: "Salary", createdAt: "2025-12-10T00:00:00Z" },
  { id: "t2", title: "Market", type: "expense", amount: 420, date: "2025-12-11", category: "Groceries", createdAt: "2025-12-11T00:00:00Z" },
  { id: "t3", title: "Ulaşım", type: "expense", amount: 90, date: "2025-12-11", category: "Transportation", createdAt: "2025-12-11T00:00:00Z" },
  { id: "t4", title: "Freelance", type: "income", amount: 3500, date: "2025-12-12", category: "Freelance", createdAt: "2025-12-12T00:00:00Z" },
];

const g = globalThis as unknown as { __txStore?: Store };

if (!g.__txStore) {
  g.__txStore = { transactions: initial };
}

export const txStore = g.__txStore;
