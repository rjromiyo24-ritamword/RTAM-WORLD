import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

const STAGES: { key: OrderStatus; label: string; icon: any }[] = [
  { key: 'Pending', label: 'অর্ডার গৃহিত', icon: Clock },
  { key: 'Confirmed', label: 'অর্ডার নিশ্চিত', icon: CheckCircle },
  { key: 'Packaging', label: 'প্যাকিং সম্পূর্ণ', icon: PackageCheck },
  { key: 'Shipping', label: 'কুরিয়ারে অন-ওয়ে', icon: Truck },
  { key: 'Delivered', label: 'ডেলিভারি সম্পন্ন', icon: CheckCircle2 },
];

export const TrackOrderPage: React.FC = () => {
  const { trackOrderLookup, showNotification } = useStore();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      showNotification('অনুগ্রহ করে আপনার অর্ডার আইডি প্রদান করুন', 'error');
      return;
    }

    setIsLoading(true);
    const result = await trackOrderLookup(orderIdInput.trim(), phoneInput.trim());
    setIsLoading(false);
    setHasSearched(true);

    if (result) {
      setSearchedOrder(result);
    } else {
      setSearchedOrder(null);
      showNotification('প্রদত্ত তথ্য দিয়ে কোনো অর্ডার পাওয়া যায়নি', 'error');
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Packaging':
        return 2;
      case 'Shipping':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            লাইভ অর্ডার ট্র্যাকিং (Track Order)
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            আপনার ইনভয়েসের অর্ডার আইডি ও মোবাইল নম্বর দিয়ে বর্তমান ডেলিভারি স্ট্যাটাস জানুন।
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm mb-8">
          <form onSubmit={handleSearchTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                অর্ডার আইডি (Order ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: RW-10085"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-900"
                required
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মোবাইল নম্বর (ঐচ্ছিক)
              </label>
              <input
                type="tel"
                placeholder="017xxxxxxxx"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-900"
              />
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? 'খোঁজা হচ্ছে...' : 'স্ট্যাটাস দেখুন'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Result Tracking Details */}
        {hasSearched && searchedOrder && (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  অর্ডার আইডি: <span className="text-blue-900">{searchedOrder.id}</span>
                </h2>
                <p className="text-xs text-gray-500">
                  তারিখ: {new Date(searchedOrder.createdAt).toLocaleDateString('bn-BD')}
                </p>
              </div>

              <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                বর্তমান স্ট্যাটাস: {searchedOrder.status}
              </span>
            </div>

            {/* Stage Progress Bar */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                ডেলিভারি অগ্রগতি (Delivery Progress):
              </h3>

              {searchedOrder.status === 'Cancelled' ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 flex items-center gap-2 text-xs font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>এই অর্ডারটি বাতিল (Cancelled) করা হয়েছে। আরও তথ্যের জন্য কাস্টমার কেয়ারে যোগাযোগ করুন।</span>
                </div>
              ) : (
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />

                  {STAGES.map((stage, idx) => {
                    const currentIdx = getStageIndex(searchedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const IconComponent = stage.icon;

                    return (
                      <div
                        key={stage.key}
                        className="relative z-10 flex flex-row md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Items & Customer details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">গ্রাহকের নাম ও ঠিকানা:</h4>
                <p className="font-bold text-sm text-gray-800">{searchedOrder.customerName}</p>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  <span>{searchedOrder.mobileNumber}</span>
                </p>
                <p className="text-gray-600 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    {searchedOrder.address}, {searchedOrder.thana}, {searchedOrder.district}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">অর্ডার সারাংশ:</h4>
                <div className="space-y-1 mb-2">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span>• {it.productTitle} (x{it.quantity})</span>
                      <span className="font-bold">৳{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-sm text-blue-900">
                  <span>সর্বমোট মূল্য:</span>
                  <span>৳{searchedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !searchedOrder && (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-800">দুঃখিত! প্রদত্ত আইডি দিয়ে কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-xs text-gray-500 mt-1">
              সঠিক অর্ডার আইডি টাইপ করেছেন কিনা নিশ্চিত করুন (যেমন: RW-10085)। প্রয়োজনে হেল্পলাইনে কল করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
