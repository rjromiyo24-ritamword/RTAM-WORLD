import React, { useState, useEffect } from 'react';
import { Tag, Zap, Sparkles, Copy, Check, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const OffersPage: React.FC = () => {
  const { products, showNotification } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Flash Sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

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

  const flashSaleProducts = products.filter((p) => p.isFlashSale || p.discountPrice);

  const copyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showNotification(`কুপন কোড "${code}" কপি করা হয়েছে!`);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Flash Sale Banner with Live Timer */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-amber-600 rounded-3xl p-6 md:p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur text-white text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                ফ্ল্যাশ সেল ডিসকাউন্ট অফার
              </span>
              <h1 className="text-2xl md:text-4xl font-black mb-2">
                সীমিত সময়ের জন্য বিশেষ মূল্যছাড়!
              </h1>
              <p className="text-xs md:text-sm text-red-100 max-w-lg">
                আপনার সন্তানের জন্য আজই অর্ডার করুন সেরা টেকসই রিমোট কন্ট্রোল খেলনা ও বিল্ডিং ব্লকস।
              </p>
            </div>

            {/* Live Countdown Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <p className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                অফার শেষ হতে বাকি:
              </p>
              <div className="flex items-center gap-2 font-mono font-black text-xl md:text-2xl">
                <div className="bg-black/40 px-3 py-2 rounded-xl text-amber-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-medium text-white/80">ঘণ্টা</span>
                </div>
                <span>:</span>
                <div className="bg-black/40 px-3 py-2 rounded-xl text-amber-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-medium text-white/80">মিনিট</span>
                </div>
                <span>:</span>
                <div className="bg-black/40 px-3 py-2 rounded-xl text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-medium text-white/80">সেকেন্ড</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Showcase Cards */}
        <div className="mb-12">
          <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            <span>সক্রিয় প্রমো কুপন কোডসমূহ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Coupon 1 */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-amber-400 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                  ফ্ল্যাট ৳১০০ ছাড়
                </span>
                <h3 className="font-mono text-base font-black text-blue-900 mt-1">RITAM100</h3>
                <p className="text-[11px] text-gray-500">ন্যূনতম ৳১০০০ টাকার অর্ডারে প্রযোজ্য</p>
              </div>

              <button
                onClick={() => copyCoupon('RITAM100')}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition-colors"
                title="কপি করুন"
              >
                {copiedCode === 'RITAM100' ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Coupon 2 */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-blue-400 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded uppercase">
                  ১০% অতিরিক্ত ছাড়
                </span>
                <h3 className="font-mono text-base font-black text-blue-900 mt-1">WELCOME10</h3>
                <p className="text-[11px] text-gray-500">ন্যূনতম ৳১৫০০ টাকার অর্ডারে প্রযোজ্য</p>
              </div>

              <button
                onClick={() => copyCoupon('WELCOME10')}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl transition-colors"
                title="কপি করুন"
              >
                {copiedCode === 'WELCOME10' ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Coupon 3 */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-pink-400 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black bg-pink-100 text-pink-900 px-2 py-0.5 rounded uppercase">
                  ফ্ল্যাট ৳২০০ ছাড়
                </span>
                <h3 className="font-mono text-base font-black text-pink-900 mt-1">FREEFLY</h3>
                <p className="text-[11px] text-gray-500">ন্যূনতম ৳২০০০ টাকার অর্ডারে প্রযোজ্য</p>
              </div>

              <button
                onClick={() => copyCoupon('FREEFLY')}
                className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl transition-colors"
                title="কপি করুন"
              >
                {copiedCode === 'FREEFLY' ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>বিশেষ মূল্যছাড়ের সকল খেলনা</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {flashSaleProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
