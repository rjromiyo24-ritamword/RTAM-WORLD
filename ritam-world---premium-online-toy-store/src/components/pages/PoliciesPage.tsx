import React from 'react';
import { useStore } from '../../context/StoreContext';

export const PoliciesPage: React.FC = () => {
  const { policyType } = useStore();

  const getPolicyTitle = () => {
    switch (policyType) {
      case 'privacy':
        return 'গোপনীয়তা নীতি (Privacy Policy)';
      case 'terms':
        return 'শর্তাবলী (Terms & Conditions)';
      case 'refund':
        return 'রিফান্ড ও রিটার্ন নীতি (Refund Policy)';
      case 'shipping':
        return 'শিপিং ও ডেলিভারি তথ্য (Shipping Policy)';
      default:
        return 'পলিসি তথ্য';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-10 shadow-sm space-y-6 text-xs md:text-sm text-gray-700 leading-relaxed">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 border-b border-gray-200 pb-4">
            {getPolicyTitle()}
          </h1>

          {policyType === 'privacy' && (
            <div className="space-y-4">
              <p>
                Ritam World এ আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান অগ্রাধিকার। কাস্টমারদের অর্ডার প্রসেসিং, ডেলিভারি ও যোগাযোগের উদ্দেশ্যে আমরা নাম, ফোন নম্বর ও ঠিকানার মতো প্রয়োজনীয় তথ্য সংগ্রহ করি।
              </p>
              <h3 className="font-bold text-gray-900 text-sm">তথ্য ব্যবহার ও সুরক্ষা:</h3>
              <p>
                আমরা কাস্টমারের অনুমতি ব্যতিরেকে কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত ফোন নম্বর বা ঠিকানা বিক্রি বা শেয়ার করি না। সকল পেমেন্ট লেনদেন অনলাইন এনক্রিপশনের মাধ্যমে নিরাপদে সম্পন্ন হয়।
              </p>
            </div>
          )}

          {policyType === 'terms' && (
            <div className="space-y-4">
              <p>
                Ritam World ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি আমাদের সেবা গ্রহণে সম্মত হচ্ছেন। ওয়েবসাইটে প্রদর্শিত সকল প্রডাক্টের ছবি ও তথ্য আসল পণ্যের সামঞ্জস্য রেখে উপস্থাপন করা হয়েছে।
              </p>
              <h3 className="font-bold text-gray-900 text-sm">অর্ডার গ্রহণ ও বাতিলকরণ:</h3>
              <p>
                স্টক অপ্রতুলতা বা অনাকাঙ্ক্ষিত কারণে রিতম ওয়ার্ল্ড কর্তৃপক্ষ যেকোনো অর্ডার বাতিল করার পূর্ণ অধিকার সংরক্ষণ করে। সেক্ষেত্রে অগ্রিম পেমেন্ট করা থাকলে শতভাগ টাকা ফেরত প্রদান করা হবে।
              </p>
            </div>
          )}

          {policyType === 'refund' && (
            <div className="space-y-4">
              <p>
                পণ্য গ্রহণের পর যদি কোনো ধরনের শারীরিক ক্ষতি বা ত্রুটি পরিলক্ষিত হয়, তবে কাস্টমার ৭ দিনের মধ্যে তা পরিবর্তনের আবেদন করতে পারবেন।
              </p>
              <h3 className="font-bold text-gray-900 text-sm">রিফান্ড পাওয়ার শর্তাবলী:</h3>
              <p>
                ১. পণ্যটি মূল প্যাকিং এবং অব্যবহৃত অবস্থায় ফেরত দিতে হবে।<br />
                ২. ডেলিভারির সময় পার্সেল খোলার ভিডিও অথবা ডেলিভারি ম্যানের উপস্থিতিতে ছবি তুলে রাখা বাঞ্ছনীয়।<br />
                ৩. ভ্যালিড রিটার্ন নিশ্চিত হলে ৩ থেকে ৫ কার্যদিবসের মধ্যে বিকাশ বা নগদে রিফান্ড টাকা ট্রান্সফার করা হবে।
              </p>
            </div>
          )}

          {policyType === 'shipping' && (
            <div className="space-y-4">
              <p>
                আমরা সারা বাংলাদেশে বিশ্বস্ত কুরিয়ার সার্ভিসের মাধ্যমে দ্রুত ও নিরাপদ হোম ডেলিভারি প্রদান করে থাকি।
              </p>
              <h3 className="font-bold text-gray-900 text-sm">ডেলিভারি চার্জ ও সময়:</h3>
              <p>
                • <strong>ঢাকা সিটি:</strong> চার্জ ৳৬০ টাকা (২৪-৪৮ ঘণ্টা)।<br />
                • <strong>ঢাকার বাইরে:</strong> চার্জ ৳১২০ টাকা (২-৩ দিন)।<br />
                • <strong>স্পেশাল অফার:</strong> বিকাশ বা নগদে অনলাইন পেমেন্ট করলে যেকোনো অর্ডারে ডেলিভারি চার্জ ১০০% ফ্রি!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
