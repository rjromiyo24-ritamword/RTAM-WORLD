import React from 'react';
import { MapPin, Phone, Shield, Gift, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DeliveryInfoSection: React.FC = () => {
  const { settings, navigateTo } = useStore();

  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              ফ্রি শিপিং অফার
            </span>

            <h2 className="text-2xl md:text-3xl font-black leading-snug">
              বিকাশ বা নগদ পেমেন্টে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
            </h2>

            <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-xl">
              ক্যাশ অন ডেলিভারিতে ঢাকা সিটিতে ৳৬০ টাকা এবং ঢাকার বাইরে ৳১২০ টাকা শিপিং চার্জ প্রযোজ্য। কিন্তু যেকোনো বিকাশ বা নগদ অনলাইন পেমেন্টে সারা বাংলাদেশে ফ্রী শিপিং!
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-amber-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                ঢাকার বাইরে ২-৩ দিন
              </span>
            </div>
          </div>

          <div className="md:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-4">
            <h3 className="text-base font-black text-amber-300">এখনই সরাসরি অর্ডার করুন</h3>
            <p className="text-xs text-blue-100">
              হটলাইনে কল দিয়ে বা সরাসরি ওয়েবসাইটে পছন্দের খেলনা অর্ডার করুন।
            </p>

            <a
              href={`tel:${settings.hotlinePhone}`}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>কল করুন: {settings.hotlinePhone}</span>
            </a>

            <button
              onClick={() => navigateTo('shop')}
              className="w-full py-3 bg-white hover:bg-gray-100 text-blue-950 font-bold text-xs rounded-2xl shadow transition-all"
            >
              খেলনা শপ পেজে যান
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
