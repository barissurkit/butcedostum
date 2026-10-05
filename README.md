# BütçeDostum 💸

Next.js + Prisma + PostgreSQL ile geliştirilmiş basit bir bütçe takip uygulaması.

## Özellikler
- Gelir / gider ekleme
- Kategori bazlı kayıt
- Günlük özet (gelir, gider, bakiye)
- Filtreleme ve arama
- Sayfalama (pagination)
- JWT tabanlı giriş / kayıt

## Teknolojiler
- Next.js (App Router)
- React
- Prisma
- PostgreSQL
- TypeScript

## Gereksinimler

- Node.js 20.9 veya üzeri (Next.js 16 gereksinimi; geliştirme ve doğrulama Node.js 24 ile yapıldı) ve npm
- Bir PostgreSQL veritabanı (`prisma/schema.prisma` içinde `provider = "postgresql"`; [Neon](https://neon.tech) önerilir, ayrıntı için [DEPLOYMENT.md](DEPLOYMENT.md))
- `.env` dosyasında `DATABASE_URL` ve `JWT_SECRET` değerleri

## Kurulum

```bash
git clone https://github.com/barissurkit/butcedostum.git
cd butcedostum
npm install
cp .env.example .env        # DATABASE_URL ve JWT_SECRET değerlerini doldurun
npm run prisma:migrate      # tabloları oluşturur
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır. `JWT_SECRET` için rastgele bir değer üretmek için: `openssl rand -base64 32`.

## Kullanım

1. `http://localhost:3000/register` adresinden e-posta ve en az 8 karakterli bir şifre ile kayıt olun.
2. `http://localhost:3000/login` ile giriş yapın; giriş sonrası `/dashboard` sayfasına yönlendirilirsiniz (oturum çerezi 7 gün geçerlidir).
3. Dashboard'da gelir/gider ekleyin, kategori seçin, kayıtları filtreleyip arayın ve günlük özeti (gelir, gider, bakiye) görün.

Kayıtlar oturumdaki kullanıcıya aittir ve `/api/transactions` uç noktasından yönetilir. Örnek (tarayıcıda giriş yapılmış oturum çerezi ile) bir gider ekleme isteği:

```json
POST /api/transactions
{ "title": "Market", "amount": 420, "type": "expense", "date": "2025-12-11", "category": "Market" }
```

Beklenen yanıt `201` ve oluşturulan kayıttır (`{ "transaction": { ... } }`); oturum yoksa `401 { "error": "Unauthorized" }` döner.

## Testler

```bash
npm test
npx tsc --noEmit   # tip kontrolü
```

Testler `tests/` dizinindedir ve Node.js'in yerleşik test çalıştırıcısı (`node --test`) ile çalışır; kategori yardımcıları ve örnek işlem deposu doğrulanır.

## Katkı

Katkı rehberi için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

## Lisans

[MIT](LICENSE)
