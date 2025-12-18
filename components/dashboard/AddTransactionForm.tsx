"use client";

import { useEffect, useState } from "react";
import { getCategoriesByType, type Category } from "@/lib/categories";

type Props = {
  onCreate: (payload: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
    category: Category | null;
  }) => Promise<void> | void;
};

export default function AddTransactionForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(""); // 👈 string
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<Category | "">("");

  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [saving, setSaving] = useState(false);

  const categoryOptions = getCategoriesByType(type);

  useEffect(() => {
    setCategory("");
  }, [type]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      alert("Başlık zorunlu");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount === 0) {
      alert("Tutar 0'dan büyük olmalı");
      return;
    }
    if (!date) {
      alert("Tarih zorunlu");
      return;
    }
    if (!category) {
      alert("Kategori seçmelisin");
      return;
    }

    setSaving(true);
    try {
      await onCreate({
        title: cleanTitle,
        amount: numericAmount,
        type,
        date,
        category,
      });

      // reset
      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2 className="h2">Yeni işlem ekle</h2>

      <form onSubmit={submit} className="row" style={{ alignItems: "flex-end" }}>
        <div className="col">
          <label className="muted">Başlık</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={type === "income" ? "Örn: Maaş" : "Örn: Market"}
          />
        </div>

        <div className="col">
          <label className="muted">Tutar</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="₺"
            min={0}
          />
        </div>

        <div className="col">
          <label className="muted">Tür</label>
          <select value={type} onChange={e => setType(e.target.value as any)}>
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
        </div>

        <div className="col">
          <label className="muted">Kategori</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category | "")}
          >
            <option value="">Kategori seç</option>
            {categoryOptions.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <label className="muted">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="col" style={{ minWidth: 160 }}>
          <button
            type="submit"
            disabled={saving || !title || !amount || !category}
            style={{ width: "100%" }}
          >
            {saving ? "Ekleniyor..." : "Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}
