import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FlashSaleSection: React.FC = () => {
  const { products, navigateTo } = useStore();

  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems = products.filter((p) => p.isFlashSale || p.discountPrice).slice(0, 4);

  if (flashItems.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 rounded-3xl p-5 md:p-6 text-white mb-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black">আজকের ফ্ল্যাশ সেল (Flash Sale)</h2>
              <p className="text-xs text-amber-100">সীমিত স্টক শেষ হওয়ার আগেই সংগ্রহ করুন সেরা ছাড়!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-4 py-2 rounded-2xl font-mono font-black text-sm text-amber-300 border border-white/20">
            <Clock className="w-4 h-4 text-white" />
            <span>{String(timeLeft.hours).padStart(2, '0')}ঘ</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}মি</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}সে</span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {flashItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('offers')}
            className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-2xl shadow transition-all inline-flex items-center gap-2"
          >
            <span>সব অফার প্রোডাক্ট দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
