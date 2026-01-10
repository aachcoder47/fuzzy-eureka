import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product } from '../lib/supabase';
import { useSubscriptions } from '../hooks/useSubscriptions';
import * as Icons from 'lucide-react';
import { Check, AlertCircle, ArrowLeft, Star, Shield, ArrowRight, Play, Calendar } from 'lucide-react';
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
      await supabase.from('user_profiles').update({ phone: phoneNumber }).eq('id', user.id);

      let status = 'active';
      let trialEnd = null;

      if (product.trial_days && product.trial_days > 0) {
        status = 'trial';
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + product.trial_days);
        trialEnd = trialEndDate.toISOString();
      }

      const planId = (product.trial_days && product.trial_days > 0)
        ? 'plan_trial_2inr'
        : (billingCycle === 'monthly'
          ? import.meta.env.VITE_PAYU_PLAN_MONTHLY || 'plan_monthly'
          : import.meta.env.VITE_PAYU_PLAN_YEARLY || 'plan_yearly');

      const subscriptionData = {
        user_id: user.id,
        product_id: product.id,
        status: status,
        billing_cycle: billingCycle,
        trial_end: trialEnd,
        product_name: product.name
      };

      localStorage.setItem('pending_subscription', JSON.stringify(subscriptionData));

      const paymentResponse = await billingService.initiateSubscription({
        planId,
        productId: product.id,
        userId: user.id,
        email: user.email || '',
        phone: phoneNumber
      });

      console.log('Payment initiated:', paymentResponse);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button onClick={() => onNavigate('home')} className="text-cyan-600 hover:text-cyan-700 font-semibold">
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const Icon = (Icons as any)[product.icon] || Icons.Sparkles;
  const price = billingCycle === 'monthly' ? product.monthly_price / 100 : product.yearly_price / 100;
  const isSubscribed = hasActiveSubscription(product.id);

  // Expanded product details for enhanced user trust and information density
  const getProductDetails = () => {
    const details: Record<string, { description: string; features: string[]; warning?: string; videoId?: string; subheading: string; trustBadges?: string[] }> = {
      'social-ai': {
        subheading: 'Dominate Social Media using Autonomous AI Agents',
        description: 'Transform your social media presence with our enterprise-grade AI automation suite. Our intelligent agents create engaging multi-format content, schedule posts across all major platforms, and interact with your audience 24/7 to drive authentic growth.',
        features: [
          'Generate viral threads, posts, and captions using fine-tuned LLMs',
          'Cross-platform scheduling & auto-posting (Twitter/X, LinkedIn, Discord)',
          'Smart Engagement Bots: Auto-reply to comments & DMs with human-like nuance',
          'Trend Spotting: AI analyzes real-time data to suggest trending topics',
          'Brand Voice Training: Upload your past content to clone your unique style',
          'Deep Analytics: Sentiment analysis and growth attribution reports',
          'Multi-Tenant Workspace: Manage unlimited accounts from one dashboard',
        ],
      },
      'automate-ai': {
        subheading: 'The Ultimate No-Code Browser Automation Platform',
        description: 'Stop wasting time on manual data entry and repetitive web tasks. Automate Any Workflow on the web with our visual builder. Extract data, fill forms, and simulate complex user interactions without writing a single line of code.',
        features: [
          'Visual Workflow Builder: Drag-and-drop interface for complex logic',
          'Resilient Scraping: By-pass anti-bot measures with rotating residential proxies',
          'Lead Generation: Automatically find and verify emails from LinkedIn & directories',
          'Cloud Execution: Run thousands of concurrent tasks on our serverless infrastructure',
          'API Connector: Webhooks and native integrations with Zapier, Slack, sheets',
          'Intelligent Parsers: Structure unstructured HTML data into clean JSON/CSV',
          'Captcha Solving: Integrated solver service included in all plans',
        ],
      },
      'hire-ai': {
        subheading: 'End-to-End Recruitment Automation System',
        description: 'Revolutionize your hiring pipeline. From sourcing to signing, our AI handles the heavy lifting. Screen thousands of resumes instantly, conduct autonomous first-round interviews, and identify top talent with 99% accuracy.',
        features: [
          'Resume Parser: Semantically match candidates to job descriptions instantly',
          'AI Interviewer: Autonomous voice/video interviews with real-time evaluation',
          'Skill Assessment: Auto-generated technical tests and coding challenges',
          'Candidate Outreach: Automated personalized email sequences to passive talent',
          'Bias Elimination: Anonymized screening to ensure fair hiring practices',
          'ATS Integration: Seamless sync with Greenhouse, Lever, and others',
          'Pipeline Analytics: Track time-to-hire and source quality metrics',
        ],
        videoId: 'tij7emQfJM0',
      },
      'tradelab': {
        subheading: 'Institutional-Grade Market Analysis & Simulation',
        description: 'Practice and refine your trading strategies with professional-grade tools. Access real-time market data, advanced charting, and AI-driven pattern recognition to test your hypotheses before risking capital.',
        features: [
          'Strategy Backtester: Test algorithms against 10 years of historical data',
          'Real-Time Paper Trading: Simulate execution with live market conditions',
          'AI Signal Generation: ML models detect chart patterns and anomalies',
          'Risk Management Lab: Monte Carlo simulations for portfolio stress testing',
          'Multi-Asset Support: Crypto, Forex, Stocks, and Commodities data',
          'Social Sentiment Analysis: Gauge market mood from news and social feeds',
          'Custom Scripting: Write indicators in Python or Pine Script',
          'Performance Attribution: Detailed breakdown of winning/losing factors',
        ],
        // Disclaimer removed as requested by user
      },
      'engage-ai': {
        subheading: 'Next-Gen Conversational AI for Sales & Support',
        description: 'Scale your customer engagement with hyper-realistic AI voice agents and smart chatbots. Handle thousands of simultaneous calls and messages while maintaining a personal touch that converts leads into customers.',
        features: [
          'Hyper-Real Voice Agents: <500ms latency voice AI for inbound/outbound calls',
          'WhatsApp Business Automation: broadcast campaigns and 2-way chat bots',
          'Smart Scheduling: Agents can book meetings directly into your calendar',
          'Lead Qualification: Dynamic scripts to score and filter prospects',
          'CRM Sync: Real-time logging of calls and transcripts to Salesforce/HubSpot',
          'Omnichannel Inbox: Unified view for Voice, SMS, WhatsApp, and Email',
          'Sentiment Overrides: Route angry customers to human supervisors instantly',
          'Multi-Lingual Support: Native-level fluency in 30+ languages',
        ],
      },
    };

    return details[productSlug] || { subheading: 'Enterprise AI Solution', description: product.description, features: product.features };
  };

  const details = getProductDetails();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-slate-900 pb-20 pt-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-cyan-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-4 py-1.5 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-slate-300">Trusted by 10,000+ businesses</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                {product.name}
              </h1>
              <p className="text-xl text-cyan-200 font-medium mb-4">{details.subheading}</p>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                {details.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Calendar size={20} />
                  <span>Book a Demo</span>
                </button>
              </div>

              <div className="mt-8 flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  14-day free trial
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Product Decoration / Preview */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Icon size={32} className="text-white" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                  <div className="h-32 bg-slate-700/50 rounded-xl mt-6 border border-slate-600/50"></div>
                </div>

                {details.videoId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl group cursor-pointer hover:bg-black/30 transition-all">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Play size={32} className="text-white fill-current ml-1" />
                    </div>
                  </div>
                )}
              </div>
              {/* Abstract shapes */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trusted by industry leaders</p>
          <div className="flex justify-center gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold font-serif text-slate-800">Horizon</span>
            <span className="text-xl font-bold font-mono text-slate-800">NEXUS</span>
            <span className="text-xl font-bold font-sans text-slate-800">Starlight</span>
            <span className="text-xl font-bold text-slate-800">Oribt.ai</span>
            <span className="text-xl font-bold font-mono text-slate-800">Flux</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {details.warning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-16 rounded-r-lg max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
              <p className="text-yellow-800 font-medium">{details.warning}</p>
            </div>
          </div>
        )}

        {/* Features + Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-16">

          {/* Left Column: Features */}
          <div className="lg:col-span-2">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose {product.name}?</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Unlock the full potential of your business with our enterprise-grade solution.
                Designed for scalability, security, and ease of use.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {details.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="mt-1 bg-cyan-50 p-2 rounded-lg">
                      <Check size={20} className="text-cyan-600" />
                    </div>
                    <span className="text-slate-700 font-medium leading-normal">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Placeholder if ID exists (Detailed View) */}
            {details.videoId && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">See it in Action</h3>
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black relative">
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
              </div>
            )}

            {/* Testimonial (Mock) */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Icons.Quote size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex space-x-1 mb-6 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-xl font-medium leading-relaxed mb-6">
                  "Use this product to completely automate your workflow. It has saved us hundreds of hours and significantly improved our ROI. Highly recommended!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">JD</div>
                  <div>
                    <div className="font-bold">John Doe</div>
                    <div className="text-slate-400 text-sm">CTO at TechCorp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing */}
          <div className="lg:col-span-1 relative">
            <div id="pricing" className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 pb-4">
                  <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">Pricing</h3>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>

                  <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-xl">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${billingCycle === 'monthly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${billingCycle === 'yearly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Yearly (-17%)
                    </button>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-extrabold text-gray-900">₹{price}</span>
                      <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        You save ₹{((product.monthly_price * 12 - product.yearly_price) / 100).toFixed(0)} per year
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <Check size={18} className="text-cyan-500 mr-3 flex-shrink-0" />
                      <span>All features included</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check size={18} className="text-cyan-500 mr-3 flex-shrink-0" />
                      <span>{billingCycle === 'yearly' ? 'Priority 24/7 Support' : 'Standard Support'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check size={18} className="text-cyan-500 mr-3 flex-shrink-0" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 ml-1">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <input
                      type="email"
                      value={user?.email || 'Please login to continue'}
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-gray-400 text-sm cursor-not-allowed hidden"
                    />
                  </div>
                </div>

                <div className="p-8 pt-0 bg-slate-50/50">
                  {isSubscribed ? (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center font-bold">
                      Currently Active
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={handleSubscribe}
                        disabled={subscribing}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {subscribing
                          ? 'Processing...'
                          : (product.trial_days && product.trial_days > 0)
                            ? `Start ${product.trial_days}-Day Free Trial • Pay ₹2`
                            : 'Get Started Now'
                        }
                      </button>
                      {(product.trial_days && product.trial_days > 0) && (
                        <p className="text-xs text-gray-500 text-center mt-3">
                          Pay <strong>₹2 refundable fee</strong> now to verify card. Recurring billing starts after {product.trial_days} days.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Secure payment via PayU</p>
                    <div className="flex justify-center mt-2 space-x-2 opacity-50">
                      <Shield size={14} />
                      <span className="text-xs">256-bit SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <h4 className="font-bold text-blue-900 mb-2">Need a custom plan?</h4>
                <p className="text-sm text-blue-800 mb-4">Contact our sales team for enterprise pricing.</p>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Talk to Sales &rarr;
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
