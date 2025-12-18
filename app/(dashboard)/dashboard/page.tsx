"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "@/types/transaction";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddTransactionForm from "@/components/dashboard/AddTransactionForm";
import SummarySection from "@/components/dashboard/SummarySection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", { cache: "no-store" });
      const data = await res.json();
      setTransactions(data.transactions ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    document.title = "BütçeDostum | Dashboard";
  }, []);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  async function handleCreate(payload: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
    category?: string | null;
  }) {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data?.error ?? "Bir hata oluştu");
      return;
    }

    const created: Transaction = {
      ...data.transaction,
      createdAt: String(data.transaction.createdAt),
    };

    setTransactions(prev => [created, ...prev]);
  }

  async function handleUpdate(
    id: string,
    patch: Partial<Pick<Transaction, "title" | "amount" | "type" | "date" | "category">>
  ) {
    const res = await fetch("/api/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data?.error ?? "Güncelleme hatası");
      return;
    }

    const updated: Transaction = {
      ...data.transaction,
      createdAt: String(data.transaction.createdAt),
    };

    setTransactions(prev => prev.map(t => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: string) {
    const res = await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data?.error ?? "Silme hatası");
      return;
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <main>
      <DashboardHeader />

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <AddTransactionForm onCreate={handleCreate} />
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <SummarySection
            income={summary.income}
            expense={summary.expense}
            balance={summary.balance}
            loading={loading}
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <TransactionsSection
          transactions={transactions}
          loading={loading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
