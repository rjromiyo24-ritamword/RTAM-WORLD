import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, showNotification } = useStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      showNotification('অনুগ্রহ করে সকল তথ্য সঠিকভাবে পূরণ করুন', 'error');
      return;
    }
    showNotification('ধন্যবাদ! আপনার বার্তাটি আমাদের কাস্টমার কেয়ারে পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।');
    setName('');
    setMobile('');
    setMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Ritam World Support
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-xs font-medium text-gray-500">
            খেলনা সম্পর্কিত যেকোনো প্রশ্ন, বাল্ক অর্ডার বা সহায়তার জন্য কল বা মেসেজ দিন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Details (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
                যোগাযোগের মাধ্যম:
              </h3>

              <div className="space-y-4 text-xs text-gray-700">
                <a
                  href={`tel:${settings.hotlinePhone}`}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950 font-bold">সরাসরি হটলাইন কল:</strong>
                    <span className="text-sm font-black text-amber-900">{settings.hotlinePhone}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">হোয়াটসঅ্যাপ চ্যাট:</strong>
                    <span className="text-emerald-900 font-bold">+{settings.whatsappNumber}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 font-bold">ইমেইল ঠিকানা:</strong>
                    <span className="text-gray-600">{settings.storeEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 font-bold">শো-রুম ও অফিস ঠিকানা:</strong>
                    <span className="text-gray-600">{settings.storeAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 font-bold">কাস্টমার কেয়ার সময়সূচি:</strong>
                    <span className="text-gray-600">প্রতিদিন সকাল ৯:০০ টা - রাত ১০:০০ টা</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form (7 Cols) */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                মেসেজ বা অভিযোগ পাঠান:
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সাকিব হাসান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    আপনার প্রশ্ন বা বার্তা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="খেলনা প্রডাক্ট বা ডেলিভারি বিষয়ে বিস্তারিত লিখুন..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>বার্তা জমা দিন</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
