# Deployment Guide

## Setting up Turso Database

1. Install Turso CLI:
   ```bash
   # Windows (PowerShell)
   irm get.tur.so/install.ps1 | iex

   # macOS/Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Login to Turso:
   ```bash
   turso auth login
   ```

3. Create your database:
   ```bash
   turso db create butcedostum
   ```

4. Get your database URL:
   ```bash
   turso db show butcedostum --url
   ```

5. Create an auth token:
   ```bash
   turso db tokens create butcedostum
   ```

6. Update your local `.env` file:
   ```env
   DATABASE_URL="libsql://your-database.turso.io"
   TURSO_AUTH_TOKEN="your-auth-token"
   JWT_SECRET="your-generated-secret"
   ```

7. Push your schema to Turso:
   ```bash
   # For Turso, you'll need to use Prisma migrations or generate SQL
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```

## Setting up Vercel

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Push your code to GitHub

3. Go to [vercel.com](https://vercel.com) and import your repository

4. Add environment variables in Vercel:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following:
     - `DATABASE_URL` - Your Turso database URL (from step 4 above)
     - `TURSO_AUTH_TOKEN` - Your Turso auth token (from step 5 above)
     - `JWT_SECRET` - A random secret string for JWT signing

5. Deploy:
   ```bash
   # Via CLI
   vercel --prod

   # Or via GitHub push (automatic deployment)
   git push origin main
   ```

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. For local development, you can use SQLite:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-local-secret"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

## Important Notes

- The `postinstall` script automatically generates Prisma client after `npm install`
- For production (Turso), use the `libsql://` URL format
- For local development, use `file:./dev.db` format
- Never commit your `.env` file (it's already in `.gitignore`)
- The Prisma client is generated to `lib/generated/prisma/client` (also gitignored)
