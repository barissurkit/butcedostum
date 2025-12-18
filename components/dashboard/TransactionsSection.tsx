"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "@/types/transaction";
import { getCategoriesByType, type Category } from "@/lib/categories";

type Props = {
  transactions: Transaction[];
  loading: boolean;

  onUpdate: (
    id: string,
    patch: Partial<Pick<Transaction, "title" | "amount" | "type" | "date" | "category">>
  ) => Promise<void>;

  onDelete: (id: string) => Promise<void>;
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n) + " ₺";
}

export default function TransactionsSection({ transactions, loading, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editDate, setEditDate] = useState<string>("");

  const [editCategory, setEditCategory] = useState<Category | "">("");

  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

  const editCategoryOptions = getCategoriesByType(editType);

  useEffect(() => {
    if (!editingId) return;
    setEditCategory("");
  }, [editType, editingId]);

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditAmount(t.amount);
    setEditType(t.type);
    setEditDate(t.date);
    setEditCategory((t.category ?? "") as Category | "");
    setConfirmDeleteId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditAmount(0);
    setEditType("expense");
    setEditDate("");
    setEditCategory("");
  }

  async function saveEdit(id: string) {
    const title = editTitle.trim();
    if (!title) return alert("Başlık boş olamaz");
    if (!Number.isFinite(editAmount) || editAmount === 0) return alert("Tutar geçerli olmalı");
    if (!editDate) return alert("Tarih zorunlu");
    if (!editCategory) return alert("Kategori seçmelisin");

    setSavingId(id);
    try {
      await onUpdate(id, {
        title,
        amount: editAmount,
        type: editType,
        date: editDate,
        category: editCategory ? editCategory : null,
      });
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
      if (editingId === id) cancelEdit();
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return transactions.filter(t => {
      if (filterType !== "all" && t.type !== filterType) return false;

      if (q) {
        const inTitle = t.title.toLowerCase().includes(q);
        const inCategory = (t.category ?? "").toLowerCase().includes(q);
        if (!inTitle && !inCategory) return false;
      }

      return true;
    });
  }, [transactions, filterType, search]);

  return (
    <div className="card">
      <h2 className="h2">Son işlemler</h2>

      {!loading && transactions.length > 0 && (
        <div className="filters-row" style={{ marginBottom: 12 }}>
          <div>
            <label className="muted">Tür</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as any)}>
              <option value="all">Hepsi</option>
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>

          <div>
            <label className="muted">Ara</label>
            <input
              className="search-input"
              placeholder="Başlık veya kategoride ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="muted">Yükleniyor...</p>
      ) : transactions.length === 0 ? (
        <p className="muted">Henüz işlem yok. İlk işlemini ekle.</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="muted">Filtreye uygun işlem bulunamadı.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Tür</th>
              <th>Tutar</th>
              <th>Tarih</th>
              <th>Kategori</th>
              <th style={{ width: 240 }}>İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map(t => {
              const isEditing = editingId === t.id;
              const isSaving = savingId === t.id;
              const isDeleting = deletingId === t.id;

              return (
                <tr key={t.id}>
                  <td>
                    {isEditing ? (
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    ) : (
                      t.title
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <select value={editType} onChange={e => setEditType(e.target.value as any)}>
                        <option value="income">Gelir</option>
                        <option value="expense">Gider</option>
                      </select>
                    ) : (
                      <span className={`badge ${t.type}`}>{t.type === "income" ? "Gelir" : "Gider"}</span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(Number(e.target.value))}
                      />
                    ) : (
                      formatMoney(t.amount)
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                    ) : (
                      t.date
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value as Category | "")}
                      >
                        <option value="">Kategori seç</option>
                        {editCategoryOptions.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      t.category ?? "-"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEdit(t.id)} disabled={isSaving}>
                          {isSaving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button onClick={cancelEdit} disabled={isSaving}>
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(t)} disabled={isDeleting || confirmDeleteId === t.id}>
                          Düzenle
                        </button>

                        {confirmDeleteId === t.id ? (
                          <>
                            <button onClick={() => handleDelete(t.id)} disabled={isDeleting}>
                              {isDeleting ? "Siliniyor..." : "Evet"}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} disabled={isDeleting}>
                              Vazgeç
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(t.id)} disabled={isDeleting}>
                            Sil
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
