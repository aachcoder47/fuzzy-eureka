import { Product } from '../lib/supabase';
import * as Icons from 'lucide-react';
import { Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onLearnMore: (slug: string) => void;
}

export default function ProductCard({ product, onLearnMore }: ProductCardProps) {
  const Icon = (Icons as any)[product.icon] || Icons.Sparkles;
  const monthlyPrice = product.monthly_price / 100;
  const yearlyPrice = product.yearly_price / 100;
  const monthlySavings = ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100).toFixed(0);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-cyan-500 p-3 rounded-xl">
            <Icon size={32} />
          </div>
          <h3 className="text-2xl font-bold">{product.name}</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{product.description}</p>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <div className="mb-6">
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">₹{monthlyPrice}</span>
            <span className="text-gray-500">/month</span>
          </div>
          <div className="text-sm text-gray-600">
            or ₹{yearlyPrice}/year <span className="text-green-600 font-semibold">(Save {monthlySavings}%)</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-grow">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <Check size={20} className="text-cyan-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onLearnMore(product.slug)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Learn More & Subscribe
        </button>
      </div>
    </div>
  );
}
