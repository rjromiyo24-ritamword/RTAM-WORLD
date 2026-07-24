import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhyChooseUs: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Ritam World Guarantee
          </span>
          <h2 className="text-xl md:text-3xl font-black text-gray-900 mt-2 mb-1">
            কেন রিতম ওয়ার্ল্ড থেকে খেলনা কিনবেন?
          </h2>
          <p className="text-xs font-semibold text-amber-600">"{settings.storeMotto}"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">১০০% টেস্টেড প্রডাক্ট</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              ডেলিভারির আগে প্রতি খেলনার কার্যক্ষমতা টেস্ট করা হয়।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">ফ্রি অনলাইন শিপিং</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              বিকাশ বা নগদে অগ্রিম পেমেন্টে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <RotateCcw className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">৭ দিনের ইজি রিটার্ন</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              যেকোনো ত্রুটিতে দ্রুত চেকিং ও রিপ্লেসমেন্ট সুবিধা।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto">
              <Headphones className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">২৪/৭ কাস্টমার সাপোর্ট</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              ফোন, হোয়াটসঅ্যাপ ও মেসেঞ্জারে সার্বক্ষণিক সেবা।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
