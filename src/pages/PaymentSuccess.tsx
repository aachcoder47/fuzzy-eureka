import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Check, X } from 'lucide-react';

interface PaymentSuccessProps {
    onNavigate: (page: string) => void;
}

export default function PaymentSuccess({ onNavigate }: PaymentSuccessProps) {
    const { user } = useAuth();
    const [processing, setProcessing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function createSubscription() {
            if (!user) {
                setError('User not logged in');
                setProcessing(false);
                return;
            }

            try {
                // Get pending subscription data from localStorage
                const pendingData = localStorage.getItem('pending_subscription');

                if (!pendingData) {
                    setError('No pending subscription found');
                    setProcessing(false);
                    return;
                }

                const subscriptionData = JSON.parse(pendingData);

                // Calculate period end
                const periodEnd = new Date();
                if (subscriptionData.billing_cycle === 'monthly') {
                    periodEnd.setMonth(periodEnd.getMonth() + 1);
                } else {
                    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                }

                // Create subscription in database
                const { error: dbError } = await supabase.from('subscriptions').insert([
                    {
                        user_id: subscriptionData.user_id,
                        product_id: subscriptionData.product_id,
                        status: subscriptionData.status,
                        billing_cycle: subscriptionData.billing_cycle,
                        current_period_end: periodEnd.toISOString(),
                        trial_end: subscriptionData.trial_end
                    },
                ]);

                if (dbError) throw dbError;

                // Clear pending subscription
                localStorage.removeItem('pending_subscription');

                setSuccess(true);
                setProcessing(false);

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    onNavigate('dashboard');
                }, 3000);

            } catch (err: any) {
                console.error('Error creating subscription:', err);
                setError(err.message || 'Failed to create subscription');
                setProcessing(false);
            }
        }

        createSubscription();
    }, [user, onNavigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {processing && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                        <p className="text-gray-600">Please wait while we confirm your subscription.</p>
                    </>
                )}

                {success && (
                    <>
                        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">Your subscription has been activated.</p>
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                    </>
                )}

                {error && (
                    <>
                        <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <X size={32} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
