import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NewsletterSection: React.FC = () => {
  const { showNotification } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showNotification('অনুগ্রহ করে সঠিক ইমেইল প্রদান করুন', 'error');
      return;
    }
    showNotification('ধন্যবাদ! নতুন অফার ও প্রমোশনাল কুপনের তথ্য পেতে আমাদের সাবস্ক্রিপশন সফল হয়েছে।');
    setEmail('');
  };

  return (
    <section className="py-12 bg-amber-500 text-blue-950">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="inline-flex items-center gap-1 bg-blue-950 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Ritam World VIP Club
        </span>

        <h2 className="text-2xl md:text-3xl font-black">
          নতুন কালেকশন ও স্পেশাল ছাড়ের আপডেট পান সবার আগে!
        </h2>

        <p className="text-xs md:text-sm text-blue-950/80 font-medium max-w-lg mx-auto">
          আপনার ইমেইল সাবস্ক্রাইব করে রাখুন এবং প্রতি নতুন খেলনায় পাবেন এক্সক্লুসিভ ডিসকাউন্ট কুপন।
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="আপনার ইমেইল ঠিকানা টাইপ করুন..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-white rounded-2xl text-xs font-bold text-gray-800 outline-none shadow-sm"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
          >
            সাবস্ক্রাইব
          </button>
        </form>
      </div>
    </section>
  );
};
