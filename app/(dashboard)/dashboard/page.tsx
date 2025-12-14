"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/types/transaction";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddTransactionForm from "@/components/dashboard/AddTransactionForm";
import SummarySection from "@/components/dashboard/SummarySection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const [editingId, setEditingId] = useState<string | null>(null);

  // Sayfa açılınca backend'den işlemleri çek
  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions);
      });
  }, []);

  // Düzenlenen işlem (id üzerinden seçiyoruz)
  const editingTransaction =
    editingId === null ? null : transactions.find((t) => t.id === editingId) ?? null;

  // Filtreye göre ekranda gösterilecek liste
  const visibleTransactions =
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  // ✅ EKLEME: POST /api/transactions
  async function handleAdd(tx: Transaction) {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: tx.title,
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.error ?? "İşlem eklenemedi.");
      return;
    }

    const data = await res.json();
    const created: Transaction = data.transaction;

    setTransactions((prev) => [created, ...prev]);
  }

  // ✅ SİLME: DELETE /api/transactions?id=...
  async function handleDelete(id: string) {
    const res = await fetch(`/api/transactions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.error ?? "Silme işlemi başarısız.");
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Silinen işlem düzenleniyorsa edit modundan çık
    setEditingId((prev) => (prev === id ? null : prev));
  }

  // ✅ GÜNCELLEME: PATCH /api/transactions?id=...
  async function handleUpdate(updated: Transaction) {
    const res = await fetch(`/api/transactions?id=${encodeURIComponent(updated.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updated.title,
        type: updated.type,
        amount: updated.amount,
        date: updated.date,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.error ?? "Güncelleme başarısız.");
      return;
    }

    const data = await res.json();
    const saved: Transaction = data.transaction;

    setTransactions((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    setEditingId(null);
  }

  return (
    <main>
      <DashboardHeader />

      <section>
        <h2>Filtre</h2>

        <label>
          <span>Tür</span>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "income" | "expense")
            }
          >
            <option value="all">Hepsi</option>
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
        </label>
      </section>

      <AddTransactionForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingTransaction={editingTransaction}
        onCancelEdit={() => setEditingId(null)}
      />

      <SummarySection transactions={visibleTransactions} />

      <TransactionsSection
        transactions={visibleTransactions}
        onDelete={handleDelete}
        onEdit={(id) => setEditingId(id)}
      />
    </main>
  );
}
