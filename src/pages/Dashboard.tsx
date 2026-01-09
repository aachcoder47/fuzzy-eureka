import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { supabase, UserProfile } from '../lib/supabase';
import * as Icons from 'lucide-react';
import { Calendar, CreditCard, Package, User, AlertCircle, Check } from 'lucide-react';
import CancelConfirmModal from '../components/CancelConfirmModal';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { subscriptions, loading } = useSubscriptions();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!user) {
      onNavigate('home');
      return;
    }

    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setProfile(data);
    }

    fetchProfile();
  }, [user, onNavigate]);

  const handleCancelSubscription = async (subscriptionId: string, productName: string) => {
    setSubscriptionToCancel({ id: subscriptionId, name: productName });
    setCancelModalOpen(true);
  };

  const confirmCancelSubscription = async () => {
    if (!subscriptionToCancel) return;

    setCanceling(subscriptionToCancel.id);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('id', subscriptionToCancel.id);

      if (error) throw error;

      alert('Subscription cancelled successfully. Your access will continue until the end of the billing period.');
      setCancelModalOpen(false);
      setSubscriptionToCancel(null);
      window.location.reload();
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      alert(`Failed to cancel subscription: ${error.message || 'Unknown error'}`);
    } finally {
      setCanceling(null);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter((sub) => ['active', 'trial'].includes(sub.status));
  const totalMonthlyValue = activeSubscriptions.reduce((sum, sub) => {
    if (sub.status === 'trial') return sum;
    return sum + (sub.billing_cycle === 'monthly' ? sub.product.monthly_price : sub.product.yearly_price / 12);
  }, 0) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile?.full_name || user.email}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Package className="text-cyan-600" size={24} />
                <span className="text-gray-600 font-semibold">Active Products</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{activeSubscriptions.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard className="text-green-600" size={24} />
                <span className="text-gray-600 font-semibold">Monthly Value</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">₹{totalMonthlyValue.toFixed(0)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="text-purple-600" size={24} />
                <span className="text-gray-600 font-semibold">Member Since</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscriptions</h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscriptions</h3>
              <p className="text-gray-600 mb-6">
                Start your AI journey by subscribing to one of our powerful tools.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {subscriptions.map((subscription) => {
                const Icon = (Icons as any)[subscription.product.icon] || Icons.Sparkles;
                const price = subscription.billing_cycle === 'monthly'
                  ? subscription.product.monthly_price / 100
                  : subscription.product.yearly_price / 100;

                return (
                  <div
                    key={subscription.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                          <Icon size={32} className="text-white" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {subscription.product.name}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {subscription.product.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <CreditCard size={16} className="text-gray-400" />
                              <span className="text-gray-700">
                                ₹{price}/{subscription.billing_cycle === 'monthly' ? 'month' : 'year'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-gray-700">
                                Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {subscription.status === 'active' || subscription.status === 'trial' ? (
                                <>
                                  <Check size={16} className="text-green-600" />
                                  <span className="text-green-600 font-semibold capitalize">{subscription.status}</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={16} className="text-yellow-600" />
                                  <span className="text-yellow-600 font-semibold capitalize">{subscription.status}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {subscription.cancel_at_period_end && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                              This subscription will be cancelled on {new Date(subscription.current_period_end).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => onNavigate('support')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                        >
                          Contact Support
                        </button>

                        <a
                          href="https://wa.me/917462085177?text=Hi,%20I%20need%20help%20with%20my%20subscription."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm text-center"
                        >
                          WhatsApp Us
                        </a>
                        {!subscription.cancel_at_period_end && ['active', 'trial'].includes(subscription.status) && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id, subscription.product.name)}
                            disabled={canceling === subscription.id}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm w-full md:w-auto text-center"
                          >
                            {canceling === subscription.id ? 'Canceling...' : 'Cancel Subscription'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-cyan-600 hover:text-cyan-700 font-semibold"
          >
            Browse More Products
          </button>
        </div>
      </div>

      <CancelConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSubscriptionToCancel(null);
        }}
        onConfirm={confirmCancelSubscription}
        productName={subscriptionToCancel?.name || ''}
        isProcessing={canceling !== null}
      />
    </div>
  );
}
