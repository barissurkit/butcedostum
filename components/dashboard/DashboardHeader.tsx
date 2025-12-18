function formatTodayTR() {
  const d = new Date();
  const day = d.getDate();
  const monthName = d.toLocaleString("tr-TR", { month: "long" }); // aralık, ocak...
  return `${day} ${monthName}`;
}

export default function DashboardHeader() {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 className="h1" style={{ marginBottom: 6 }}>Ana Sayfa</h1>
          <p className="muted" style={{ margin: 0 }}>Gelir ve giderlerini ekle, özetini anlık gör.</p>
        </div>

        <span className="pill">Bugün: {formatTodayTR()}</span>
      </div>
    </div>
  );
}
