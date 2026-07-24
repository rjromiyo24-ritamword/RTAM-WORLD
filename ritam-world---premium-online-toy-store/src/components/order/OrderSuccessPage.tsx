import React from 'react';
import {
  CheckCircle,
  Printer,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessPage: React.FC = () => {
  const { activeOrder, navigateTo, settings } = useStore();

  if (!activeOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header Box */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 text-center shadow-sm mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            অর্ডার সফলভাবে গৃহিত হয়েছে!
          </span>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">
            ধন্যবাদ, {activeOrder.customerName}!
          </h1>

          <p className="text-xs font-medium text-gray-600 max-w-lg mx-auto mb-4">
            আপনার অর্ডারটি সফলভাবে রিসিভ করা হয়েছে। অতি শীঘ্রই আমাদের কাস্টমার প্রতিনিধি আপনাকে কল দিয়ে অর্ডারটি কনফার্ম করবে।
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-900 rounded-2xl border border-blue-100 font-extrabold text-sm mb-6">
            <span>অর্ডার আইডি:</span>
            <span className="text-amber-600 font-mono text-base">{activeOrder.id}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>ইনভয়েস প্রিন্ট করুন</span>
            </button>

            <button
              onClick={() => navigateTo('track-order')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Clock className="w-4 h-4" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm print:shadow-none print:border-none">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
            <div>
              <span className="text-2xl font-black text-blue-900 uppercase">
                Ritam<span className="text-amber-500 ml-1">World</span>
              </span>
              <p className="text-xs text-amber-600 font-bold">{settings.storeMotto}</p>
              <p className="text-[11px] text-gray-500 mt-1">{settings.storeAddress}</p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <h3 className="text-lg font-black text-gray-800">অফিশিয়াল ইনভয়েস</h3>
              <p className="text-gray-500">আইডি: <strong className="text-blue-900">{activeOrder.id}</strong></p>
              <p className="text-gray-500">তারিখ: {new Date(activeOrder.createdAt).toLocaleDateString('bn-BD')}</p>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs text-gray-700">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 text-[11px] border-b border-gray-200 pb-1">
                গ্রাহক ও শিপিং ঠিকানা:
              </h4>
              <p className="font-bold text-sm text-gray-900">{activeOrder.customerName}</p>
              <p className="flex items-center gap-1 text-gray-600 mt-1">
                <Phone className="w-3.5 h-3.5 text-blue-900" />
                <span>{activeOrder.mobileNumber}</span>
                {activeOrder.altMobileNumber && <span>, {activeOrder.altMobileNumber}</span>}
              </p>
              <p className="flex items-start gap-1 text-gray-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  {activeOrder.address}, {activeOrder.thana}, {activeOrder.district}, {activeOrder.division}
                </span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 text-[11px] border-b border-gray-200 pb-1">
                পেমেন্ট ও অর্ডার স্ট্যাটাস:
              </h4>
              <p className="font-bold text-gray-800">
                মেথড:{' '}
                <span className="text-blue-900 font-extrabold uppercase">
                  {activeOrder.paymentMethod === 'cod'
                    ? 'ক্যাশ অন ডেলিভারি (COD)'
                    : activeOrder.paymentMethod === 'bkash'
                    ? 'বিকাশ (bKash Online)'
                    : 'নগদ (Nagad Online)'}
                </span>
              </p>
              {activeOrder.transactionId && (
                <p className="mt-1">
                  TrxID: <strong className="font-mono text-pink-700">{activeOrder.transactionId}</strong>
                </p>
              )}
              {activeOrder.senderNumber && (
                <p className="mt-0.5">
                  প্রেরক নম্বর: <strong>{activeOrder.senderNumber}</strong>
                </p>
              )}
              <p className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full inline-block">
                অর্ডার স্ট্যাটাস: {activeOrder.status}
              </p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white font-bold">
                  <th className="p-3 rounded-tl-xl">পণ্যের নাম</th>
                  <th className="p-3 text-center">একক মূল্য</th>
                  <th className="p-3 text-center">পরিমাণ</th>
                  <th className="p-3 text-right rounded-tr-xl">মোট (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeOrder.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800 flex items-center gap-2">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-8 h-8 object-contain rounded bg-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <span>{item.productTitle}</span>
                    </td>
                    <td className="p-3 text-center">৳{item.price}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-black text-blue-900">৳{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown Summary */}
          <div className="w-full sm:w-72 ml-auto space-y-2 text-xs font-medium text-gray-700 p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-between">
              <span>সাবটোটাল:</span>
              <span className="font-bold">৳{activeOrder.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold text-gray-900">৳{activeOrder.deliveryCharge}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>কুপন ছাড়:</span>
                <span>-৳{activeOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-blue-900 pt-2 border-t border-gray-200">
              <span>সর্বমোট প্রদানযোগ্য:</span>
              <span className="text-base">৳{activeOrder.totalAmount}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>আপনার যেকোনো অনুসন্ধানের জন্য আমাদের হটলাইনে যোগাযোগ করুন: <strong>{settings.hotlinePhone}</strong></p>
            <p className="mt-1">গ্রাহকের বিশ্বাসই আমাদের সবচেয়ে বড় সম্পদ — Ritam World</p>
          </div>
        </div>
      </div>
    </div>
  );
};
