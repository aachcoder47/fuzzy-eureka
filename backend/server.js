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

// Generate PayU hash securely on backend
function generatePayuHash(data, salt) {
    const hashString =
        `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
        `${data.firstname}|${data.email}|||||||||||${salt}`;

    console.log('--- Debugging Hash Generation ---');
    console.log('Salt used:', salt);
    console.log('Hash String:', hashString);
    console.log('---------------------------------');

    return crypto
        .createHash('sha512')
        .update(hashString)
        .digest('hex');
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
            amount: amount.toString(),
            productinfo: productInfo,
            firstname,
            email,
            phone: phone || '9999999999',
            surl: process.env.VITE_APP_URL || 'http://localhost:5174' + '/payment-success',
            furl: process.env.VITE_APP_URL || 'http://localhost:5174' + '/payment-failure',
            service_provider: 'payu_paisa'
        };

        // Generate secure hash on backend
        const hash = generatePayuHash(paymentData, salt);

        // Return payment form data to frontend
        res.json({
            action: 'https://secure.payu.in/_payment', // Use https://test.payu.in/_payment for testing
            fields: {
                ...paymentData,
                hash
            }
        });

    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
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
