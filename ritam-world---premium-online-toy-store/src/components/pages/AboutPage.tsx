import React from 'react';
import { ShieldCheck, Award, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useStore();

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-600 rounded-3xl p-8 text-white shadow-lg text-center mb-10">
          <span className="text-xs font-bold text-amber-300 bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
            About Ritam World
          </span>
          <h1 className="text-2xl md:text-4xl font-black mt-3 mb-2">
            আমাদের গল্প ও পথচলা
          </h1>
          <p className="text-xs md:text-sm text-blue-100 max-w-xl mx-auto">
            "{settings.storeMotto}" — এই মূলমন্ত্রকে সামনে রেখে রিতম ওয়ার্ল্ডের যাত্রা।
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-10 shadow-sm space-y-8 text-xs md:text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>রিতম ওয়ার্ল্ড (Ritam World) সম্পর্কে:</span>
            </h2>
            <p>
              Ritam World হলো বাংলাদেশের একটি অত্যন্ত জনপ্রিয় ও বিশ্বস্ত প্রিমিয়াম অনলাইন টয় শপ। আমাদের প্রধান লক্ষ্য শিশুদের মেধা, বুদ্ধিমত্তা, শারীরিক ও মানসিক বিকাশে সহায়তায় আধুনিক, নিরাপদ ও টেকসই রিমোট কন্ট্রোল খেলনা (RC Cars, Helicopters, Drones, Robots) এবং এডুকেশনাল লার্নিং ব্লকস পৌঁছে দেওয়া।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <ShieldCheck className="w-8 h-8 text-blue-900 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">১০০% গুণগত মান</h3>
              <p className="text-[11px] text-gray-600">প্রতিটি খেলনা পাঠানোর আগে কোয়ালিটি চেক করা হয়।</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">দ্রুত হোম ডেলিভারি</h3>
              <p className="text-[11px] text-gray-600">ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, সারা দেশে ২-৩ দিন।</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">নিরাপদ ও বিপিএ ফ্রি</h3>
              <p className="text-[11px] text-gray-600">শিশুদের ত্বকের জন্য সম্পূর্ণ পরিবেশবান্ধব প্লাস্টিক।</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-base font-black text-gray-900 mb-3">কেন রিতম ওয়ার্ল্ড কাস্টমারদের প্রথম পছন্দ?</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>অনলাইন পেমেন্টে (bKash/Nagad) সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে পেমেন্ট) সুবিধা।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>৭ দিনের ইজি রিপ্লেসমেন্ট এবং চেকিং গ্যারান্টি।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>২৪/৭ কল ও হোয়াটসঅ্যাপ কাস্টমার সাপোর্ট।</span>
              </li>
            </ul>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              এখনই খেলনা ক্যাটালগ দেখুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
