"use client";

import { useEffect, useState } from "react";
import type { Transaction, TransactionType } from "@/types/transaction";

type Props = {
  onAdd: (tx: Transaction) => void;
  onUpdate: (tx: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
};

function todayISO() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddTransactionForm({
  onAdd,
  onUpdate,
  editingTransaction,
  onCancelEdit,
}: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [amountText, setAmountText] = useState("");
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    if (!editingTransaction) {
      setTitle("");
      setType("expense");
      setAmountText("");
      setDate(todayISO());
      return;
    }

    setTitle(editingTransaction.title);
    setType(editingTransaction.type);
    setAmountText(String(editingTransaction.amount));
    setDate(editingTransaction.date);
  }, [editingTransaction]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("Başlık boş olamaz.");
      return;
    }

    const amount = Number(amountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Tutar 0'dan büyük bir sayı olmalı.");
      return;
    }

    if (editingTransaction) {
      const updated: Transaction = {
        ...editingTransaction,
        title: trimmedTitle,
        type,
        amount,
        date,
      };

      onUpdate(updated);
      return;
    }

    const created: Transaction = {
      id: `t_${Date.now()}`,
      title: trimmedTitle,
      type,
      amount,
      date,
    };

    onAdd(created);
  }

  const isEditing = editingTransaction !== null;

  return (
    <section>
      <h2>{isEditing ? "İşlemi Düzenle" : "İşlem Ekle"}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Başlık</span>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Market"
            required
          />
        </label>

        <label>
          <span>Tür</span>
          <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </label>

        <label>
          <span>Tutar (₺)</span>
          <input
            name="amount"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            placeholder="Örn: 250"
            inputMode="numeric"
            required
          />
        </label>

        <label>
          <span>Tarih</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <button type="submit">{isEditing ? "Kaydet" : "Ekle"}</button>

        {isEditing ? (
          <button type="button" onClick={onCancelEdit}>
            İptal
          </button>
        ) : null}
      </form>
    </section>
  );
}
