import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Sparkles, Zap, Shield, TrendingUp, Quote } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, productSlug?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-2 mb-6">
              <Sparkles size={20} className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold">The Future of Business AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Futuristic AI Solutions
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              A modular AI software marketplace. Choose only the tools you need —
              social media automation, browser automation, AI hiring, or research tools.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield size={18} className="text-cyan-400" />
                <span>No Bundles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={18} className="text-cyan-400" />
                <span>No Lock-ins</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={18} className="text-cyan-400" />
                <span>Enterprise Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your AI Superpowers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Independent subscriptions. Cancel anytime. Built for startups and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLearnMore={(slug) => onNavigate('product', slug)}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Trusted by Tech Leaders
            </h2>
          </div>

          <div className="relative bg-slate-50 rounded-3xl p-10 md:p-14 shadow-lg border border-slate-100 max-w-3xl mx-auto">
            {/* Decorative Quote Icon */}
            <div className="absolute -top-6 -left-6 bg-cyan-500 rounded-full p-4 shadow-lg">
              <Quote size={24} className="text-white" />
            </div>

            <blockquote className="relative z-10 text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8">
              "Use this product to completely automate your workflow. It has saved us hundreds of hours and significantly improved our ROI. Highly recommended!"
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold text-xl shadow-inner border-2 border-white">
                JD
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-lg">John Doe</div>
                <div className="text-cyan-600 font-medium">CTO at TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Something Custom?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Looking for enterprise features, custom AI bots, or private deployments?
            Book a free demo to discuss your unique business needs.
          </p>
          <button
            onClick={() => onNavigate('booking')}
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Book Free Consultation
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4">© 2026 Futuristic AI Solutions. All rights reserved.</p>
            <p className="text-sm text-slate-500">
              Trading products are research and simulation platforms only. No real trading execution. No financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
