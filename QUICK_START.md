# Futuristic AI Solutions - Quick Start Guide

## ✅ What's Working Now

### 1. **Secure PayU Payment Integration**
- ✅ Backend API running on `http://localhost:3100`
- ✅ Hash generation happens securely on the server
- ✅ Merchant Key and Salt are NOT exposed to frontend
- ✅ Phone number collection before payment

### 2. **Features**
- ✅ 7-Day Free Trial for ₹2 (Social AI)
- ✅ Monthly/Yearly subscription options
- ✅ Cancel subscription with confirmation modal
- ✅ YouTube video embed for HR software (Hire AI)
- ✅ Contact Support & WhatsApp buttons
- ✅ Dashboard with active subscriptions

## 🚀 How to Run

### Terminal 1: Frontend
```bash
npm run dev
```
Runs on: `http://localhost:5174`

### Terminal 2: Backend (PayU API)
```bash
cd backend
npm start
```
Runs on: `http://localhost:3100`

## 💳 Payment Flow

1. User clicks "Start 7-Day Trial for ₹2"
2. Frontend calls: `POST http://localhost:3100/api/payu/initiate`
3. Backend generates secure hash with your credentials
4. Frontend receives payment form data
5. Auto-submits form to PayU payment gateway
6. User completes payment on PayU's secure page
7. Redirects back to your site

## 🔐 Security

✅ **Merchant Key & Salt** - Only on backend (never exposed)
✅ **SHA-512 Hash** - Generated server-side using Node.js crypto
✅ **No client-side secrets** - Frontend only receives final form data

## 📹 HR Software Video

The YouTube video for "Futuristic Hire AI" is embedded with ID: `tij7emQfJM0`
- Navigate to the Hire AI product page
- Video should appear above the "Key Features" section

## 🐛 Troubleshooting

### Payment not initiating?
1. Check backend is running: `http://localhost:3100/health`
2. Check browser console for errors
3. Verify `.env` has all PayU credentials

### Video not showing?
1. Check internet connection (YouTube embed requires internet)
2. Navigate to: http://localhost:5174/product/hire-ai
3. Scroll down to see video above features

### Cancel button not working?
1. Make sure you've run the updated `SUPABASE_SETUP.sql`
2. Check that DELETE policy exists for subscriptions table

## 📝 Environment Variables Required

```env
# Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# PayU (Backend reads these from parent .env)
VITE_PAYU_MERCHANT_KEY=M5DU7Y
VITE_PAYU_SALT=LrXuo7cBIiXad4zx5wIOubxCpx4tRGIj
```

## 🎯 Next Steps

1. **Test Payment Flow**
   - Try subscribing to Social AI
   - Complete payment on PayU test gateway
   - Verify subscription appears in Dashboard

2. **Production Deployment**
   - Deploy backend to a server (Heroku, Railway, etc.)
   - Update frontend API URL to production backend
   - Use PayU production URL: `https://secure.payu.in/_payment`

3. **Add Subscriptions (Auto-Debit)**
   - Implement SI (Standing Instruction) in backend
   - Add recurring payment logic
   - Handle payment webhooks from PayU
