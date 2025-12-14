"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; //Next.js App Router’da yönlendirme için kullanılan hook.

export default function LoginPage() {

    const router = useRouter(); //Router objesini alıyoruz. // bu obje ile şu sayfaya git diyebiliyoruz.

    function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Şimdilik sadece UI var. Backend ekleyince burada giriş isteği atacağız.
        router.push("/dashboard"); //Sayfa yenilenmeden /dashboard route’una geçer. //push demek: tarayıcı geçmişine ekle
    }

    return(
        <main>
            <h1>Giriş Yap</h1>

            <form onSubmit={handleSubmit}>
                <label >
                    <span>E-posta</span>
                    <input
                        type="email" 
                        name="E-posta"
                        placeholder="ornek@gmail.com"
                        autoComplete="email"
                        required
                        />
                </label>

                <label>
                    <span>Şifre</span>
                    <input
                        type="password" 
                        name="password"
                        placeholder="*****"
                        autoComplete="current-password"
                        required
                    />
                </label>

                <button type="submit">Giriş Yap</button>
            </form>

            <p>
                Hesabın yok mu? <Link href="/register">Kayıt Ol</Link>
            </p>
        </main>
    );
}