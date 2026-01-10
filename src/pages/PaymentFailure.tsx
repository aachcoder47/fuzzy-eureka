import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

interface PaymentFailureProps {
    onNavigate: (page: string) => void;
}

export default function PaymentFailure({ onNavigate }: PaymentFailureProps) {
    // Clear any pending subscription data on failure to prevent stale states
    useEffect(() => {
        localStorage.removeItem('pending_subscription');
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle size={40} className="text-red-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                    <p className="text-slate-500 mb-8">
                        We couldn't process your payment. This might be due to a declined card or a temporary issue.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => onNavigate('home')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
                        >
                            <RefreshCw size={20} />
                            <span>Try Again</span>
                        </button>

                        <button
                            onClick={() => onNavigate('support')}
                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-4 rounded-xl transition-all flex items-center justify-center space-x-2"
                        >
                            <HelpCircle size={20} />
                            <span>Contact Support</span>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="text-sm text-slate-500 hover:text-slate-800 flex items-center justify-center mx-auto"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
