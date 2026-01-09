

export const billingService = {
    async initiateSubscription(item: { planId: string; productId: string; userId: string; email: string; phone?: string }) {
        console.log("Initiating PayU Payment via API for Plan:", item.planId);

        try {
            // Use relative URL for API - works both locally and on Vercel
            const apiUrl = '/api/payu/initiate';

            // Call API to get payment form data with secure hash
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: item.planId,
                    email: item.email,
                    phone: item.phone || '9999999999',
                    productId: item.productId,
                    userId: item.userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to initiate payment');
            }

            const { action, fields } = await response.json();

            console.log('Payment form data received from backend');
            console.log('Action URL:', action);

            // Create and submit payment form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = action;

            // Add all fields to form
            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            });

            // Add form to body and submit
            document.body.appendChild(form);
            console.log('Submitting PayU payment form...');
            form.submit();

            // Return a promise that resolves after form submission
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ id: fields.txnid, status: 'initiated' });
                }, 1000);
            });

        } catch (error) {
            console.error('Error in payment initiation:', error);
            throw error;
        }
    }
};
