# Deployment Guide - Neon + Vercel

This guide covers deploying your app to Vercel with Neon PostgreSQL database.

## Quick Start

1. Set up Neon database
2. Configure environment variables
3. Deploy to Vercel

---

## Setting up Neon PostgreSQL

### 1. Create Neon Account & Project

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up or login (GitHub OAuth recommended)
3. Click **"Create Project"**
4. Configure:
   - **Name**: butcedostum (or your preferred name)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: Use default (latest)
5. Click **"Create Project"**

### 2. Get Your Connection String

After creating the project, Neon will show your connection string:

```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Copy this - you'll need it for both local development and production.

### 3. Configure Local Environment

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="paste-a-random-secret-here"
   NODE_ENV=development
   ```

3. Generate a JWT secret:
   ```bash
   # On macOS/Linux
   openssl rand -base64 32

   # On Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

This creates your tables in the Neon database.

### 6. Start Development Server

```bash
npm run dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - Before deploying, click **"Environment Variables"**
   - Add:
     - **Key**: `DATABASE_URL`
       **Value**: Your Neon connection string
     - **Key**: `JWT_SECRET`
       **Value**: Your generated secret
   - Apply to: **Production, Preview, and Development**

4. **Deploy**:
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - Your app is live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Add environment variables** (first time only):
   ```bash
   vercel env add DATABASE_URL
   # Paste your Neon connection string

   vercel env add JWT_SECRET
   # Paste your JWT secret
   ```

---

## Database Management

### View Your Data

Use Prisma Studio:
```bash
npm run prisma:studio
```

Or use Neon's built-in SQL Editor at [console.neon.tech](https://console.neon.tech)

### Create New Migration

After changing your Prisma schema:
```bash
npm run prisma:migrate
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

---

## Neon Features & Tips

### Free Tier
- **Storage**: 512 MB
- **Compute**: Shared, auto-suspends after 5 mins of inactivity
- **Branches**: 10 (great for preview deployments)
- **Perfect for**: Side projects, MVPs, development

### Branching (Advanced)

Neon supports database branching - create a copy of your database for testing:

```bash
# Via Neon CLI
neon branches create --name preview-feature-x
```

You can connect Vercel preview deployments to separate database branches!

### Connection Pooling

Neon automatically handles connection pooling. No additional configuration needed for serverless environments like Vercel.

### Monitoring

- View query performance in Neon Console
- Check connection count
- Monitor storage usage

---

## Troubleshooting

### "Can't reach database server"

- Verify your `DATABASE_URL` includes `?sslmode=require`
- Check Neon dashboard - database might be sleeping (free tier auto-suspends)
- Ensure no typos in connection string

### "Relation does not exist"

Run migrations:
```bash
npm run prisma:migrate
```

### Build Fails on Vercel

- Ensure environment variables are set in Vercel dashboard
- Check build logs for specific errors
- Verify `postinstall` script runs `prisma generate`

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

---

## Local Development Alternatives

### Option 1: Use Neon (Recommended)
Just use your Neon connection string locally. Easy and free!

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
   - Linux: `sudo apt install postgresql`

2. **Create database**:
   ```bash
   createdb butcedostum
   ```

3. **Update .env**:
   ```env
   DATABASE_URL="postgresql://localhost:5432/butcedostum?schema=public"
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

---

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## Summary Checklist

- [ ] Create Neon project
- [ ] Copy connection string
- [ ] Create `.env` file with `DATABASE_URL` and `JWT_SECRET`
- [ ] Run `npm install`
- [ ] Run `npm run prisma:migrate`
- [ ] Test locally with `npm run dev`
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add environment variables in Vercel
- [ ] Deploy!

Happy coding!
