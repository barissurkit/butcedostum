"use client"; // submit olayı olduğundan client component olmalı.

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){ // form gönderilince çalışır.
        e.preventDefault(); // sayfa yenilenmesini engeller.

        const form = e.currentTarget; // submit olayını tetikleyen form elemanını alırız.

        const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement | null;
        const password2Input = form.elements.namedItem("password2") as HTMLInputElement | null;

        const email = emailInput?.value.trim() ?? "";
        const password = passwordInput?.value ?? "";
        const password2 = password2Input?.value ?? "";

        if (!email) {
            alert("E-posta boş olamaz!");
            return;
        }

        if(password.length < 6) {
            alert("Şifre 6 karakterden az olamaz!");
            return;
        }

        if(password !== password2) {
            alert("Şifreler eşleşmiyor.");
            return;
        }

        router.push("/dashboard");
    }

    return (
    <main>
      <h1>Kayıt Ol</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <span>E-posta</span>
          <input
            type="email"
            name="email"
            placeholder="ornek@mail.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          <span>Şifre</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          <span>Şifre (Tekrar)</span>
          <input
            type="password"
            name="password2"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </label>

        <button type="submit">Kayıt Ol</button>
      </form>

      <p>
        Zaten hesabın var mı? <Link href="/login">Giriş Yap</Link>
      </p>
    </main>
  );
}