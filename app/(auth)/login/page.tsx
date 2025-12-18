"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "BütçeDostum | Giriş";
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return setError("E-posta boş olamaz.");
    if (!isValidEmail(cleanEmail)) return setError("E-posta formatı hatalı.");
    if (!password) return setError("Şifre boş olamaz.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Giriş başarısız. Bilgilerini kontrol et.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Sunucuya bağlanılamadı. İnternetini kontrol et.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <h1 className="h1">Giriş Yap</h1>
      <p className="muted">Hesabına giriş yapıp işlemlerini yönetebilirsin.</p>

      <div className="card auth-card">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            <span>E-posta</span>
            <input
              type="email"
              name="email"
              placeholder="ornek@gmail.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            <span>Şifre</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          {error && (
            <div
              className="card"
              style={{
                borderColor: "rgba(220, 38, 38, .35)",
                background: "rgba(220, 38, 38, .06)",
                boxShadow: "none",
                padding: 12,
              }}
            >
              <p style={{ margin: 0, color: "crimson", fontSize: 14 }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Hesabın yok mu? <Link href="/register">Kayıt Ol</Link>
      </p>
    </main>
  );
}
