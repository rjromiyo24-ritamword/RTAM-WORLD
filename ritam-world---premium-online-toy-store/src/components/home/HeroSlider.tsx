import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { settings, navigateTo } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = settings.heroBanners || [];

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const slide = banners[currentSlide];

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-950 via-blue-900 to-amber-900 text-white overflow-hidden py-8 md:py-16">
      {/* Background Decorative Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur border border-amber-400/40 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>{settings.storeMotto}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-blue-100 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {slide.subtitle}
            </p>

            {/* CTAs & Value Props */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-blue-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>এখনই শপ করুন (Explore Toys)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('offers')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold text-xs rounded-2xl transition-colors"
              >
                বিশেষ অফারসমূহ
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-blue-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left text-[11px] font-bold text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>১০০% অরিজিনাল প্রডাক্ট</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>অনলাইন পেমেন্টে ফ্রি ডেলিভারি</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>৭ দিনের গ্যারান্টি</span>
              </div>
            </div>
          </div>

          {/* Banner Image Showcase (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-amber-400/30 shadow-2xl bg-blue-900">
              <img
                src={slide.imageUrl || '/src/assets/images/hero_toy_banner_1784827703332.jpg'}
                alt={slide.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
