import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product } from '../lib/supabase';
import { useSubscriptions } from '../hooks/useSubscriptions';
import * as Icons from 'lucide-react';
import { Check, AlertCircle, ArrowLeft } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { billingService } from '../services/billing.service';

interface ProductPageProps {
  productSlug: string;
  onNavigate: (page: string) => void;
}

export default function ProductPage({ productSlug, onNavigate }: ProductPageProps) {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', productSlug)
          .maybeSingle();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  const handleSubscribe = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!product) return;

    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number (at least 10 digits) to proceed.');
      return;
    }

    setSubscribing(true);
    try {
      // 0. Save Phone Number
      await supabase.from('user_profiles').update({ phone: phoneNumber }).eq('id', user.id);

      let status = 'active';
      let trialEnd = null;

      // Check for Free Trial
      if (product.trial_days && product.trial_days > 0) {
        status = 'trial';
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + product.trial_days);
        trialEnd = trialEndDate.toISOString();
      }

      // ALWAYS Initiate Payment (Charge ₹2 for trial)
      const planId = (product.trial_days && product.trial_days > 0)
        ? 'plan_trial_2inr' // Pseudo-plan for trial
        : (billingCycle === 'monthly'
          ? import.meta.env.VITE_PAYU_PLAN_MONTHLY || 'plan_monthly'
          : import.meta.env.VITE_PAYU_PLAN_YEARLY || 'plan_yearly');

      // Store subscription data in localStorage for payment success page
      const subscriptionData = {
        user_id: user.id,
        product_id: product.id,
        status: status,
        billing_cycle: billingCycle,
        trial_end: trialEnd,
        product_name: product.name
      };

      localStorage.setItem('pending_subscription', JSON.stringify(subscriptionData));

      // Initiate payment and wait for response
      const paymentResponse = await billingService.initiateSubscription({
        planId,
        productId: product.id,
        userId: user.id,
        email: user.email || '',
        phone: phoneNumber
      });

      console.log('Payment initiated:', paymentResponse);

      // Note: Subscription will be created AFTER successful payment
      // The payment success page will handle creating the subscription and redirecting

      // We don't alert or navigate here, as the PayU form submission will redirect the page

    } catch (error: any) {
      console.error('Error initiating payment:', error);
      alert(`Failed to initiate payment: ${error.message || 'Please try again or contact support.'}`);
      localStorage.removeItem('pending_subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => onNavigate('home')}
            className="text-cyan-600 hover:text-cyan-700 font-semibold"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const Icon = (Icons as any)[product.icon] || Icons.Sparkles;
  const price = billingCycle === 'monthly' ? product.monthly_price / 100 : product.yearly_price / 100;
  const isSubscribed = hasActiveSubscription(product.id);

  const getProductDetails = () => {
    const details: Record<string, { description: string; features: string[]; warning?: string; videoId?: string }> = {
      'social-ai': {
        description: 'Transform your social media presence with AI-powered automation. Create engaging content, schedule posts across multiple platforms, and grow your audience authentically.',
        features: [
          'Generate high-quality social media content using advanced AI',
          'Schedule and automate posts across Twitter, Discord, and more',
          'Train AI on your brand voice for consistent messaging',
          'Engage with your audience automatically',
          'Comprehensive analytics and insights dashboard',
          'Multi-account management',
        ],
      },
      'automate-ai': {
        description: 'Automate repetitive browser tasks without writing code. Extract data, generate leads, and streamline workflows with intelligent automation.',
        features: [
          'Visual workflow builder - no coding required',
          'Smart web scraping and data extraction',
          'Automated lead generation and prospecting',
          'Schedule tasks to run automatically',
          'Integration with popular APIs and tools',
          'Bulk operations and batch processing',
        ],
      },
      'hire-ai': {
        description: 'Revolutionize your hiring process with AI. Screen candidates faster, schedule interviews automatically, and make better hiring decisions.',
        features: [
          'AI-powered resume screening and matching',
          'Automated interview scheduling',
          'Integrated video interview platform',
          'Customizable skill assessments',
          'Complete candidate pipeline management',
          'Work trial and assignment tracking',
        ],
        videoId: 'tij7emQfJM0',
      },
      'tradelab': {
        description: 'Research and simulate trading strategies with AI-powered analysis. Learn, backtest, and refine your approach in a risk-free environment.',
        features: [
          'Advanced strategy backtesting engine',
          'Real-time market data and analysis',
          'AI-powered signal generation',
          'Comprehensive risk modeling tools',
          'Educational dashboards and tutorials',
          'Performance tracking and analytics',
        ],
        warning: 'This is a research and simulation platform. No real trading execution. No financial advice. For educational purposes only.',
      },
      'engage-ai': {
        description: 'Scale your customer engagement with AI-powered calling and WhatsApp automation. Handle thousands of conversations simultaneously.',
        features: [
          'AI voice calling with natural conversations',
          'WhatsApp Business API integration',
          'Automated appointment booking',
          'Intelligent lead qualification',
          'Multi-language support',
          'CRM integration and sync',
        ],
      },
    };

    return details[productSlug] || { description: product.description, features: product.features };
  };

  const details = getProductDetails();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-slate-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </button>

            <div className="flex items-center space-x-6 mb-6">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <Icon size={48} />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl text-slate-300">{details.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {details.warning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
                <p className="text-yellow-800 font-medium">{details.warning}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {details.videoId && (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${details.videoId}`}
                    title="Product Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
              <ul className="space-y-4 mb-12">
                {details.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
                    <Check size={24} className="text-cyan-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h3>

                <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Yearly
                    <span className="block text-xs text-green-600">Save up to 17%</span>
                  </button>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900">₹{price}</span>
                    <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-600">
                      ₹{(price / 12).toFixed(0)} per month, billed annually
                    </p>
                  )}
                </div>

                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {isSubscribed ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center font-semibold">
                    Active Subscription
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribing
                      ? 'Processing...'
                      : (product.trial_days && product.trial_days > 0)
                        ? `Start ${product.trial_days}-Day Trial for ₹2`
                        : 'Subscribe Now'
                    }
                  </button>
                )}

                <p className="text-sm text-gray-500 text-center mt-4">
                  Cancel anytime. No long-term contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div >

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
