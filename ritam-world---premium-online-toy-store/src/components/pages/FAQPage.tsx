import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'অর্ডার করতে কি অ্যাকাউন্ট খোলা বাধ্যতামূলক?',
    a: 'না, রিতম ওয়ার্ল্ডে অর্ডার করতে কোনো ইউজার রেজিস্ট্রেশন বা লগইন প্রয়োজন হয় না। সরাসরি নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে সহজ ফর্মে অর্ডার করা যায়।',
  },
  {
    q: 'ডেলিভারি চার্জ কত এবং কিভাবে ফ্রি পাওয়া যায়?',
    a: 'ক্যাশ অন ডেলিভারিতে ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৳৬০ টাকা এবং ঢাকার বাইরে ৳১২০ টাকা। তবে বিকাশ (bKash) বা নগদ (Nagad) অনলাইন পেমেন্ট করলে সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
  },
  {
    q: 'পণ্য পছন্দ না হলে বা কোনো ত্রুটি থাকলে কি পরিবর্তন (Replacement) সম্ভব?',
    a: 'জি, ডেলিভারির পর পণ্যে কোনো প্রকার ম্যানুফ্যাকচারিং ত্রুটি বা সমস্যা থাকলে ৭ দিনের মধ্যে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করে ফ্রিতে রিপ্লেসমেন্ট সুবিধা পাবেন।',
  },
  {
    q: 'ঢাকা ও ঢাকার বাইরে ডেলিভারি পেতে কত সময় লাগে?',
    a: 'ঢাকা সিটির ভেতরে আমরা সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি নিশ্চিত করি। ঢাকার বাইরের জেলা ও থানা পর্যায়ে ২ থেকে ৩ দিন সময় লাগে।',
  },
  {
    q: 'বিকাশ বা নগদ দিয়ে পেমেন্ট করার নিয়ম কি?',
    a: 'চেকআউট পেজে bKash অথবা Nagad সিলেক্ট করলে আমাদের নির্ধারিত নম্বর ও পেমেন্ট ইন্সট্রাকশন দেখা যাবে। টাকা সেন্ড মানি করে প্রাপ্ত TrxID ও আপনার মোবাইল নম্বরটি ফর্মে বসিয়ে দিন।',
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Ritam World Help
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">
            সাধারণ প্রশ্নাবলী (FAQ)
          </h1>
          <p className="text-xs font-medium text-gray-500">
            কেনাকাটা ও ডেলিভারি সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তরসমূহ।
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs md:text-sm text-gray-900 bg-gray-50/60 hover:bg-gray-100 flex justify-between items-center gap-3 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
