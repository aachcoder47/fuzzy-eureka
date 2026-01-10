import crypto from 'crypto';

// Generate PayU hash securely
function generatePayuHash(data: any, salt: string) {
    // PayU hash formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const amount = parseFloat(data.amount).toFixed(2);

    // CRITICAL: Must have exactly 16 pipes total (10 pipes after udf1)
    const hashString =
        `${data.key}|${data.txnid}|${amount}|${data.productinfo}|` +
        `${data.firstname}|${data.email}|${data.udf1 || ''}||||||||||${salt}`;

    const pipeCount = (hashString.match(/\|/g) || []).length;
    console.log('Hash String:', hashString);
    console.log('Pipe count:', pipeCount);

    if (pipeCount !== 16) {
        console.error('ERROR: Hash string has incorrect number of pipes!');
    }

    const hash = crypto
        .createHash('sha512')
        .update(hashString)
        .digest('hex');

    return hash;
}

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { planId, email, phone, productId, userId } = req.body;

        const merchantKey = process.env.VITE_PAYU_MERCHANT_KEY;
        const salt = process.env.VITE_PAYU_SALT;

        if (!merchantKey || !salt) {
            return res.status(500).json({
                error: 'PayU credentials not configured'
            });
        }

        // Determine amount based on plan
        let amountNum = 2;
        let productInfo = "7-Day Trial Setup Fee";

        if (planId === 'plan_trial_2inr') {
            amountNum = 2;
            productInfo = "7-Day Trial Setup Fee";
        } else if (planId.includes('monthly')) {
            amountNum = 2999;
            productInfo = "Monthly Subscription";
        } else if (planId.includes('yearly')) {
            amountNum = 29990;
            productInfo = "Yearly Subscription";
        }

        // Generate unique transaction ID
        const txnid = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
        const firstname = email.split('@')[0];

        // Get the origin from the request
        const origin = req.headers.origin || req.headers.referer || 'http://localhost:5173';

        // Prepare payment data
        const paymentData = {
            key: merchantKey,
            txnid,
            amount: amountNum.toFixed(2),
            productinfo: productInfo,
            firstname,
            email,
            phone: phone || '9999999999',
            surl: origin + '/payment-success',
            furl: origin + '/payment-failure',
            service_provider: 'payu_paisa',
            si: '1',  // Enable Standing Instructions for recurring payments
            udf1: planId || '' // Store plan ID for reference
        };

        // Validate required fields
        const requiredFields = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email'];
        for (const field of requiredFields) {
            if (!paymentData[field as keyof typeof paymentData]) {
                console.error(`Missing required field: ${field}`);
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Generate secure hash
        const hash = generatePayuHash(paymentData, salt);

        // Return payment form data
        res.status(200).json({
            action: 'https://secure.payu.in/_payment',
            fields: {
                ...paymentData,
                hash
            }
        });

    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({
            error: 'Failed to initiate payment',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
