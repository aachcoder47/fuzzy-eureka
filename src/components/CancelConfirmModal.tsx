import { X } from 'lucide-react';

interface CancelConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    isProcessing: boolean;
}

export default function CancelConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    productName,
    isProcessing
}: CancelConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={isProcessing}
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Cancel Subscription?
                    </h2>
                    <p className="text-gray-600">
                        Are you sure you want to cancel your subscription to <span className="font-semibold text-gray-900">{productName}</span>?
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Your subscription will remain active until the end of the current billing period.
                        You'll continue to have access until then.
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Keep Subscription
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Canceling...' : 'Yes, Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
}
