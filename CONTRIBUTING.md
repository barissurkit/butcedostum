# Katkı Rehberi

Katkıda bulunmak istediğiniz için teşekkürler!

## Kurulum

1. Repository'yi fork'layıp klonlayın.
2. Node.js (20.9+; testler için 22.18+ önerilir) ve bir PostgreSQL veritabanı hazırlayın.
3. Bağımlılıkları kurun ve ortam dosyasını oluşturun:

   ```bash
   npm install
   cp .env.example .env   # DATABASE_URL ve JWT_SECRET değerlerini doldurun
   npm run prisma:migrate
   npm run dev
   ```

## Testleri çalıştırma

```bash
npm test
npx tsc --noEmit
```

Testler `tests/` dizinindedir. Yeni bir davranış eklerseniz ilgili testi de ekleyin.

## Pull request beklentileri

- `main` dalına doğrudan push yapmayın; ayrı bir dal açıp pull request gönderin.
- Pull request'i tek bir konuya odaklı tutun ve ne değiştiğini kısaca açıklayın.
- `npm test` ve `npx tsc --noEmit` yerelde geçmeli; GitHub Actions iş akışı (CI) yeşil olmalıdır.
- `.env` dosyasını veya herhangi bir gizli bilgiyi (veritabanı bağlantısı, `JWT_SECRET`) commit etmeyin.
