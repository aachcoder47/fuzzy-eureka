# 🚀 Deploy to Vercel - Simple Guide

## ✅ One-Click Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

That's it! Just press Enter for all prompts.

## 🔐 Add Environment Variables on Vercel

After deployment, go to your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_PAYU_MERCHANT_KEY=M5DU7Y
VITE_PAYU_SALT=LrXuo7cBIiXad4zx5wIOubxCpx4tRGIj
```

3. Click **Save**
4. Redeploy: `vercel --prod`

## ✨ What Happens

- ✅ Frontend deployed to Vercel
- ✅ API routes deployed as serverless functions
- ✅ Payment hash generated securely on Vercel's servers
- ✅ No separate backend server needed!

## 🧪 Local Development

For local testing, you need to run the Vercel dev server:

```bash
vercel dev
```

This runs both frontend AND API routes locally on one port!

## 📝 Alternative: Manual Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables
6. Click **Deploy**

Done! Your app is live! 🎉
