import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'তানভীর হোসাইন (মিরপুর, ঢাকা)',
    rating: 5,
    comment: 'আমার ছেলের জন্মদিনে আরসি মনস্টার ট্রাকটি অর্ডার করেছিলাম। ১ দিনের মধ্যেই ডেলিভারি পেয়েছি। প্রোডাক্টের ফিনিশিং এবং স্পিড অসাধারণ!',
    product: '4WD High Speed Off-Road RC Monster Truck',
    date: '১২ জুন ২০২৬',
  },
  {
    name: 'আয়েশা আক্তার (জিইসি, চট্টগ্রাম)',
    rating: 5,
    comment: 'বিকাশে পেমেন্ট করায় শিপিং ফ্রি পেয়েছি। প্যাকিং অনেক ভালো ছিল। লার্নিং অডিও বইটি আমার ৪ বছরের মেয়ের খুব পছন্দ হয়েছে।',
    product: 'Smart Phonetic Audio Learning Tablet Book',
    date: '১৮ জুন ২০২৬',
  },
  {
    name: 'রাশেদুল ইসলাম (সিলেট सदर)',
    rating: 5,
    comment: 'সেন্সর হেলিকপ্টারটি সত্যিই চমৎকার কাজ করে। কোয়ালিটি খুব ভালো এবং মজবুত। ধন্যবাদ রিতম ওয়ার্ল্ডকে সুন্দর সেবার জন্য।',
    product: 'Induction Sensor Flying Helicopter',
    date: '২০ জুন ২০২৬',
  },
];

export const CustomerReviewsSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Verified Customer Reviews
          </span>
          <h2 className="text-xl md:text-3xl font-black text-gray-900 mt-2 mb-1">
            সম্মানিত গ্রাহকদের মতামত ও রিভিউ
          </h2>
          <p className="text-xs text-gray-500">
            দেশজুড়ে হাজারো সন্তুষ্ট কাস্টমারের ভালোবাসা ও বিশ্বস্ততার প্রতিফলন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-3xl border border-gray-200/80 shadow-sm relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-amber-400/30 absolute top-4 right-4" />

              <div className="space-y-3 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200 text-xs">
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <span>{rev.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                </p>
                <p className="text-[11px] text-amber-700 font-bold truncate mt-0.5">
                  আইটেম: {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
