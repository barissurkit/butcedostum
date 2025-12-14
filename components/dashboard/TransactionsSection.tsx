import type { Transaction, TransactionType } from "@/types/transaction";

function formatMoney(amount: number) {
  return `${amount.toLocaleString("tr-TR")} ₺`;
}

function formatTypeLabel(type: TransactionType) {
  if (type === "income") return "gelir";
  return "gider";
}

type Props = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function TransactionsSection({ transactions, onDelete, onEdit }: Props) {
  return (
    <section>
      <h2>Son İşlemler</h2>

      {transactions.length === 0 ? (
        <p>Henüz işlem yok.</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              <strong>{t.title}</strong> — {formatTypeLabel(t.type)} —{" "}
              {formatMoney(t.amount)} — {t.date}{" "}
              <button type="button" onClick={() => onEdit(t.id)}>
                Düzenle
              </button>
              <button type="button" onClick={() => onDelete(t.id)}>
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
