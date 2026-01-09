# Quick Setup Guide

## Step 1: Environment Variables

Your Supabase database is already configured. You just need to add the connection details:

1. Look in your environment or Supabase dashboard for:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Verify Database

The following tables have been created automatically:
- `products` (pre-populated with 5 AI products)
- `user_profiles`
- `subscriptions`
- `payments`

All tables have Row Level Security (RLS) enabled.

## Step 4: Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see your marketplace.

## Step 5: Test the Application

1. **Browse Products**: View all 5 AI products on the homepage
2. **Sign Up**: Create a new account
3. **Subscribe**: Choose a product and subscribe
4. **Dashboard**: View your active subscriptions

## What's Included

### 5 Pre-configured Products

1. **Futuristic Social AI** (₹799/month)
   - Social media automation
   - Content generation
   - Multi-platform scheduling

2. **Futuristic Automate AI** (₹1,499/month)
   - Browser automation
   - Web scraping
   - Workflow tools

3. **Futuristic Hire AI** (₹2,999/month)
   - AI resume screening
   - Interview scheduling
   - HR CRM

4. **Futuristic TradeLab** (₹999/month)
   - Trading research (simulation only)
   - Strategy backtesting
   - Market analysis

5. **Futuristic Engage AI** (₹1,999/month)
   - AI calling
   - WhatsApp automation
   - Customer engagement

### Pages Included

- **Home Page**: Product marketplace with cards
- **Product Pages**: Individual pages for each product
- **Dashboard**: User subscription management
- **Authentication**: Sign up/sign in modals

## Next Steps

### Immediate Actions

1. **Test Authentication**
   - Create a test account
   - Sign in/out
   - Check user profile creation

2. **Test Subscriptions**
   - Subscribe to a product
   - View in dashboard
   - Test cancellation

3. **Customize Branding**
   - Update colors in Tailwind config
   - Replace placeholder icons
   - Add your logo

### Payment Integration

Current implementation creates subscriptions without payment. To add real payments:

#### Option 1: PayU (Recommended for India)

1. Sign up at https://payu.in/
2. Get API credentials
3. Create an edge function for payment processing
4. Update subscription flow in `ProductPage.tsx`

#### Option 2: Stripe (International)

1. Sign up at https://stripe.com/
2. Install Stripe SDK
3. Create checkout sessions
4. Implement webhooks

### Product Development

The marketplace is ready for you to integrate actual AI products:

1. **Social AI**: Integrate Eliza (https://github.com/elizaos/eliza)
2. **Automate AI**: Integrate Skyvern (https://github.com/Skyvern-AI/skyvern)
3. **Hire AI**: Build custom HR workflows
4. **TradeLab**: Add research dashboards
5. **Engage AI**: Integrate Twilio/WhatsApp APIs

## Architecture Overview

```
Frontend (React + TypeScript)
         ↓
   Supabase Auth
         ↓
   PostgreSQL Database
         ↓
   Row Level Security
         ↓
   User Data & Subscriptions
```

## Security Features

- Email/password authentication
- Row Level Security on all tables
- Secure API keys (never exposed to client)
- User-specific data access
- Subscription validation

## Common Issues

### Issue: "Missing Supabase environment variables"
**Solution**: Create `.env` file with your Supabase credentials

### Issue: "Failed to fetch products"
**Solution**: Check your Supabase connection and RLS policies

### Issue: "Cannot create subscription"
**Solution**: Ensure you're signed in and product exists

## Support

For questions or custom development:
https://form.typeform.com/to/DDS88AsN

## Production Deployment

When ready to deploy:

1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - Your own hosting

3. Set environment variables in hosting platform

4. Configure custom domain

5. Set up payment gateway webhooks

## Legal Requirements

Before launching:

1. Add Terms of Service
2. Add Privacy Policy
3. Add Refund Policy
4. Ensure GDPR compliance (if EU users)
5. Add billing address collection
6. Implement proper invoicing

---

You're all set! Start customizing and building your AI empire.
