# Deployment Guide

## Setting up Neon Database

1. Go to [Neon Console](https://console.neon.tech) and sign up/login

2. Create a new project:
   - Click "Create Project"
   - Give it a name (e.g., "butcedostum")
   - Select your preferred region
   - PostgreSQL version (use default)

3. Copy your connection string:
   - After creating the project, you'll see a connection string
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
   - Copy this - you'll need it for both local development and Vercel

4. Update your local `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   JWT_SECRET="your-generated-secret"
   ```

5. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
   - This will create your database tables on Neon

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
     - `DATABASE_URL` - Your Neon connection string (same one from your `.env`)
     - `JWT_SECRET` - A random secret string for JWT signing (generate with: `openssl rand -base64 32`)

5. Deploy:
   ```bash
   # Via CLI
   vercel --prod

   # Or via GitHub push (automatic deployment)
   git push origin main
   ```

## Local Development

### Option 1: Use Neon for Local Development (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Use your Neon connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   JWT_SECRET="your-generated-secret"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Option 2: Use Local PostgreSQL

1. Install PostgreSQL locally

2. Create a local database:
   ```bash
   createdb butcedostum
   ```

3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://localhost:5432/butcedostum?schema=public"
   JWT_SECRET="your-local-secret"
   ```

4. Follow steps 3-5 from Option 1

## Important Notes

- The `postinstall` script automatically generates Prisma client after `npm install`
- Neon has a generous free tier perfect for development and small projects
- You can use the same Neon database for both local dev and production, or create separate databases
- Never commit your `.env` file (it's already in `.gitignore`)
- The Prisma client is generated to `lib/generated/prisma/client` (also gitignored)
- Neon automatically handles connection pooling and scaling
