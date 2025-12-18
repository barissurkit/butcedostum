export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">BütçeDostum</h1>
        <p className="muted">Gelir-gider takibiniz kısacası "Bütçeniz" için bir dost.</p>
        <a href="/login">Giriş Yap</a>
        <a href="/register">Kayıt Ol</a>
      </div>
    </main>
  );
}
