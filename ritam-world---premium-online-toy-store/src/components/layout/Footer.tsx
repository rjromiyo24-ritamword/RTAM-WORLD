import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, navigateTo } = useStore();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-24 md:pb-12 border-t-4 border-amber-500">
      {/* Top Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-800/80 rounded-2xl border border-gray-700/60 shadow-xl">
          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-blue-900/60 text-amber-400 rounded-xl border border-blue-700/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">১০০% অরিজিনাল প্রডাক্ট</h4>
              <p className="text-[11px] text-gray-400">গুণগত মান পরীক্ষিত খেলনা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-blue-900/60 text-amber-400 rounded-xl border border-blue-700/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">ফ্রি ও দ্রুত ডেলিভারি</h4>
              <p className="text-[11px] text-gray-400">অনলাইন পেমেন্টে সম্পূর্ণ ফ্রি</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-blue-900/60 text-amber-400 rounded-xl border border-blue-700/50">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">সহজ রিপ্লেসমেন্ট</h4>
              <p className="text-[11px] text-gray-400">৭ দিনের চেকিং গ্যারান্টি</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-blue-900/60 text-amber-400 rounded-xl border border-blue-700/50">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-[11px] text-gray-400">সরাসরি কল বা হোয়াটসঅ্যাপ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 p-0.5">
              <img
                src="/src/assets/images/ritam_world_logo_1784827688657.jpg"
                alt="Ritam World"
                className="w-full h-full object-cover rounded-[10px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-black text-white uppercase tracking-tight">
              Ritam<span className="text-amber-500 ml-1">World</span>
            </span>
          </div>

          <p className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            "{settings.storeMotto}"
          </p>

          <p className="text-xs text-gray-400 leading-relaxed">
            Ritam World হলো বাংলাদেশের একটি বিশ্বস্ত অনলাইন শপ। আমরা শিশুদের মানসিক ও শারীরিক বিকাশে সহায়তায় আধুনিক ও নিরাপদ রিমোট কন্ট্রোল গাড়ি, ড্রোন, রোবট এবং লার্নিং খেলনা নিয়ে কাজ করি।
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
            >
              f
            </a>
            <a
              href={settings.messengerLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
            >
              m
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
            >
              wa
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
            গুরুত্বপূর্ণ লিংক
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-amber-400 transition-colors">
                • হোম পেজ
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop')} className="hover:text-amber-400 transition-colors">
                • সকল খেলনা ক্যাটালগ
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('categories')} className="hover:text-amber-400 transition-colors">
                • ক্যাটাগরি তালিকা
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('offers')} className="hover:text-amber-400 transition-colors">
                • বিশেষ অফার ও ডিসকাউন্ট
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('track-order')} className="hover:text-amber-400 transition-colors">
                • লাইভ অর্ডার ট্র্যাকিং
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('faq')} className="hover:text-amber-400 transition-colors">
                • সাধারণ প্রশ্নাবলী (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('admin-dashboard')} className="hover:text-amber-400 transition-colors">
                • এডমিন প্যানেল
              </button>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
            নীতিমালা ও শর্তাবলী
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => navigateTo('policies', { policyType: 'privacy' })}
                className="hover:text-amber-400 transition-colors"
              >
                • গোপনীয়তা নীতি (Privacy Policy)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies', { policyType: 'terms' })}
                className="hover:text-amber-400 transition-colors"
              >
                • শর্তাবলী (Terms & Conditions)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies', { policyType: 'refund' })}
                className="hover:text-amber-400 transition-colors"
              >
                • রিফান্ড নীতি (Refund Policy)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies', { policyType: 'shipping' })}
                className="hover:text-amber-400 transition-colors"
              >
                • শিপিং ও ডেলিভারি তথ্য
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
            যোগাযোগ ও ঠিকানা
          </h3>
          <div className="space-y-3 text-xs">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{settings.storeAddress}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href={`tel:${settings.hotlinePhone}`} className="hover:text-amber-400">
                {settings.hotlinePhone}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{settings.storeEmail}</span>
            </p>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-gray-400 mb-2">পেমেন্ট মেথডসমূহ:</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-pink-900/60 text-pink-300 font-black text-[11px] rounded border border-pink-700/50">
                  bKash (বিকাশ)
                </span>
                <span className="px-2.5 py-1 bg-orange-900/60 text-orange-300 font-black text-[11px] rounded border border-orange-700/50">
                  Nagad (নগদ)
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 text-emerald-300 font-black text-[11px] rounded border border-emerald-700/50">
                  Cash On Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Ritam World (রিতম ওয়ার্ল্ড). সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Bangladeshi Kids
        </p>
      </div>
    </footer>
  );
};
