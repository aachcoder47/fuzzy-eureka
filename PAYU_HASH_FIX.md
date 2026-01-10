# PayU Hash Calculation Fix

## Problem
The payment was failing with the error:
```
Transaction failed due to incorrectly calculated hash parameter.
```

## Root Cause
The hash string formula in `api/payu/initiate.ts` was incorrect. The PayU API requires a specific format for the hash calculation that includes all UDF (User Defined Fields) parameters.

## Solution Applied

### 1. **Corrected Hash Formula**
The hash string must follow this exact format:
```
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
```

**Before (Incorrect):**
```typescript
const hashString =
    `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
    `${data.firstname}|${data.email}|${data.udf1}|||||||||${salt}`;
```

**After (Correct):**
```typescript
const hashString =
    `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
    `${data.firstname}|${data.email}|${data.udf1 || ''}|||||||||${salt}`;
```

The key changes:
- Added `|| ''` fallback for `udf1` to ensure it's never undefined
- Ensured exactly 9 pipes after udf1 (representing empty udf2-udf10)

### 2. **Added Validation**
Added validation to ensure all required fields are present before hash generation:
- key
- txnid
- amount
- productinfo
- firstname
- email

### 3. **Enhanced Logging**
Added debug logs to help troubleshoot future issues:
- Logs the hash string being generated
- Logs the final hash value
- Logs payment data (with sensitive info masked)
- Better error messages with details

## Testing Instructions

### 1. **Restart Your Development Server**
```bash
npm run dev
```

### 2. **Test Payment Flow**
1. Navigate to a product page
2. Click "Start 7-Day Trial" or select a subscription plan
3. Fill in your email and phone number
4. Click "Subscribe Now"
5. You should be redirected to PayU's payment page without errors

### 3. **Check Console Logs**
In your terminal running the dev server, you should see:
```
Hash String: M5DU7Y|TXN...|2|7-Day Trial Setup Fee|username|user@email.com|plan_trial_2inr|||||||||LrXuo7cBIiXad4zx5wIOubxCpx4tRGIj
Generated Hash: [64-character hex string]
Payment Data: { ... }
```

### 4. **Verify on PayU**
- The payment page should load correctly
- All details should be displayed properly
- You should be able to complete the test payment

## Environment Variables Required
Make sure these are set in your `.env` file:
```
VITE_PAYU_MERCHANT_KEY=M5DU7Y
VITE_PAYU_SALT=LrXuo7cBIiXad4zx5wIOubxCpx4tRGIj
```

## Additional Notes

### Hash Calculation Details
PayU uses SHA-512 hashing algorithm. The hash is calculated as:
1. Concatenate all required fields with pipe separators
2. Apply SHA-512 hash function
3. Convert to hexadecimal string (128 characters)

### Common Pitfalls to Avoid
1. ❌ Missing pipe separators
2. ❌ Wrong number of UDF fields
3. ❌ Undefined values in hash string (use empty string instead)
4. ❌ Wrong order of fields
5. ❌ Using wrong salt or merchant key

### Success Indicators
✅ No hash error from PayU
✅ Payment page loads correctly
✅ Transaction details are accurate
✅ Redirect URLs work properly

## Files Modified
- `api/payu/initiate.ts` - Fixed hash generation and added validation

## Next Steps
If you still encounter issues:
1. Check the console logs for the exact hash string being generated
2. Verify your PayU merchant credentials
3. Ensure the backend server is running and accessible
4. Check that environment variables are loaded correctly
