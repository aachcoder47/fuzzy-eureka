import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = 3100;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Generate PayU hash securely on backend
function generatePayuHash(data, salt) {
    // PayU hash formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    // Formatted amount to 2 decimal places as common in many payment gateways
    const amount = parseFloat(data.amount).toFixed(2);

    // CRITICAL: Must have exactly 16 pipes total (10 pipes after udf1)
    const hashString =
        `${data.key}|${data.txnid}|${amount}|${data.productinfo}|` +
        `${data.firstname}|${data.email}|${data.udf1 || ''}||||||||||${salt}`;

    const pipeCount = (hashString.match(/\|/g) || []).length;

    console.log('--- Debugging Hash Generation ---');
    console.log('Merchant Key:', data.key);
    console.log('Transaction ID:', data.txnid);
    console.log('Amount (Formatted):', amount);
    console.log('Product Info:', data.productinfo);
    console.log('First Name:', data.firstname);
    console.log('Email:', data.email);
    console.log('UDF1 (Plan ID):', data.udf1);
    console.log('Pipe Count:', pipeCount);
    console.log('Hash String:', hashString);
    console.log('---------------------------------');

    if (pipeCount !== 16) {
        console.error('ERROR: Hash string has incorrect number of pipes!');
    }

    const hash = crypto
        .createHash('sha512')
        .update(hashString)
        .digest('hex');

    console.log('Generated Hash:', hash);

    return hash;
}

// API endpoint to initiate payment
app.post('/api/payu/initiate', (req, res) => {
    try {
        const { planId, email, phone, productId, userId } = req.body;

        const merchantKey = process.env.VITE_PAYU_MERCHANT_KEY;
        const salt = process.env.VITE_PAYU_SALT;

        if (!merchantKey || !salt) {
            return res.status(500).json({
                error: 'PayU credentials not configured on server'
            });
        }

        // Determine amount based on plan
        let amount = 2;
        let productInfo = "7-Day Trial Setup Fee";

        if (planId === 'plan_trial_2inr') {
            amount = 2;
            productInfo = "7-Day Trial Setup Fee";
        } else if (planId.includes('monthly')) {
            amount = 2999;
            productInfo = "Monthly Subscription";
        } else if (planId.includes('yearly')) {
            amount = 29990;
            productInfo = "Yearly Subscription";
        }

        // Generate unique transaction ID
        const txnid = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
        const firstname = email.split('@')[0];

        // Prepare payment data
        const paymentData = {
            key: merchantKey,
            txnid,
            amount: parseFloat(amount).toFixed(2), // Consistently use 2 decimal places
            productinfo: productInfo,
            firstname,
            email,
            phone: phone || '9999999999',
            surl: process.env.VITE_APP_URL || 'http://localhost:5173' + '/payment-success',
            furl: process.env.VITE_APP_URL || 'http://localhost:5173' + '/payment-failure',
            service_provider: 'payu_paisa',
            si: '1',  // Enable Standing Instructions for recurring payments
            udf1: planId || '' // Store plan ID for reference
        };

        // Validate required fields
        const requiredFields = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email'];
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                console.error(`Missing required field: ${field}`);
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Generate secure hash on backend
        const hash = generatePayuHash(paymentData, salt);

        console.log('✅ Payment initiation successful');
        console.log('Plan ID:', planId);
        console.log('Amount:', amount);

        // Return payment form data to frontend
        res.json({
            action: 'https://secure.payu.in/_payment', // Use https://test.payu.in/_payment for testing
            fields: {
                ...paymentData,
                hash
            }
        });

    } catch (error) {
        console.error('❌ Error initiating payment:', error);
        res.status(500).json({
            error: 'Failed to initiate payment',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'PayU Backend API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 PayU Backend API running on http://localhost:${PORT}`);
    console.log(`✅ Merchant Key: ${process.env.VITE_PAYU_MERCHANT_KEY ? 'Configured' : 'Missing'}`);
    console.log(`✅ Salt: ${process.env.VITE_PAYU_SALT ? 'Configured' : 'Missing'}`);
});
