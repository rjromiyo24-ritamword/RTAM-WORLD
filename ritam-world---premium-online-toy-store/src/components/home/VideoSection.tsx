import React from 'react';
import { Video, Play, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const VideoSection: React.FC = () => {
  const { openProductDetails } = useStore();

  return (
    <section className="py-12 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-wider">
            Product Video Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 mb-2">
            আনবক্সিং ও আসল প্রোডাক্টের ভিডিও রিভিউ
          </h2>
          <p className="text-xs text-gray-300">
            ছবি বা বিজ্ঞাপনের নয়, আসল প্রোডাক্ট হাতে আসার পর কেমন চলে দেখে অর্ডার করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Main Embedded Demo Video */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Ritam World Toy Demo"
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* Video Highlights text & CTA */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/80 rounded-2xl border border-gray-700/60 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 text-blue-950 font-black rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 fill-blue-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">৪WD আরসি অফ-রোড ড্রাইভ একশন</h4>
                <p className="text-xs text-gray-400">উচ্চ গতি ও দুর্গম রাস্তায় স্মুথ কন্ট্রোল দেখার সুযোগ।</p>
              </div>
            </div>

            <div className="p-4 bg-gray-800/80 rounded-2xl border border-gray-700/60 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">ইন্ডাকশন সেন্সর ড্রোন ও হেলিকপ্টার</h4>
                <p className="text-xs text-gray-400">হাতের ইশারায় ব্যালেন্সড ফ্লাইটের রোমাঞ্চকর রিভিউ।</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openProductDetails('rw-p101')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-xs rounded-xl shadow-lg transition-all"
              >
                ভিডিওতে দেখা প্রোডাক্টটি সরাসরি অর্ডার করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
