type Props = {
  income: number;
  expense: number;
  balance: number;
  loading: boolean;
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n) + " ₺";
}

export default function SummarySection({ income, expense, balance, loading }: Props) {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h2 className="h2" style={{ marginBottom: 0 }}>Özet</h2>
        <span className="pill">Bu sayfa: anlık</span>
      </div>

      {loading ? (
        <p className="muted" style={{ marginTop: 12 }}>Yükleniyor...</p>
      ) : (
        <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
          {/* Bakiye büyük KPI */}
          <div className="kpi">
            <div className="muted">Bakiye</div>
            <div className="kpi-value">{formatMoney(balance)}</div>

            <div className="kpi-row">
              <span className="pill">Gelir: {formatMoney(income)}</span>
              <span className="pill">Gider: {formatMoney(expense)}</span>
            </div>
          </div>

          {/* Gelir / Gider mini kutucuklar */}
          <div className="kpi-grid">
            <div className="kpi-box">
              <div className="label">Toplam Gelir</div>
              <div className="value" style={{ color: "var(--income)" }}>{formatMoney(income)}</div>
            </div>

            <div className="kpi-box">
              <div className="label">Toplam Gider</div>
              <div className="value" style={{ color: "var(--expense)" }}>{formatMoney(expense)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
