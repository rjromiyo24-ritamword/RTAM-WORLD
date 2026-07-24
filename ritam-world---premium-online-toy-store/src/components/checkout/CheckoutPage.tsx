import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Phone,
  Gift,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';

const DIVISIONS = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chittagong)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'সিলেট (Sylhet)',
  'বরিশাল (Barisal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, settings, placeOrder, navigateTo, showNotification, customerUser } = useStore();

  const defaultAddr = customerUser?.addresses.find((a) => a.isDefault) || customerUser?.addresses[0];

  const [customerName, setCustomerName] = useState(customerUser?.name || '');
  const [mobileNumber, setMobileNumber] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [altMobileNumber, setAltMobileNumber] = useState('');
  const [address, setAddress] = useState(defaultAddr?.address || '');
  const [division, setDivision] = useState(defaultAddr?.division || DIVISIONS[0]);
  const [district, setDistrict] = useState(defaultAddr?.district || 'ঢাকা');
  const [thana, setThana] = useState(defaultAddr?.thana || '');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 stroke-1 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">আপনার কার্ট খালি</h2>
        <p className="text-xs text-gray-500 mb-6">চেকআউট করতে প্রথমে খেলনা কার্টে যোগ করুন।</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl"
        >
          খেলনা ক্যাটাগরিতে যান
        </button>
      </div>
    );
  }

  // Delivery charge calculation
  const isOnlinePayment = paymentMethod === 'bkash' || paymentMethod === 'nagad';
  const isInsideDhaka = division.includes('ঢাকা') && district.includes('ঢাকা');

  let deliveryCharge = 0;
  if (isOnlinePayment) {
    deliveryCharge = 0; // FREE for online payment!
  } else {
    deliveryCharge = isInsideDhaka ? settings.insideDhakaFee : settings.outsideDhakaFee;
  }

  const discountAmount = appliedCoupon?.discount || 0;
  const totalAmount = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, amount: cartSubtotal }),
      });

      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: data.coupon.code, discount: data.discount });
        showNotification(`🎉 কুপন কোড প্রয়োগ হয়েছে! ৳${data.discount} টাকা ছাড় পাওয়া গিয়েছে।`);
      } else {
        showNotification(data.message || 'কুপনটি সঠিক নয়', 'error');
      }
    } catch {
      showNotification('কুপন ভ্যালিডেশন ব্যর্থ', 'error');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !mobileNumber.trim() || !address.trim() || !thana.trim()) {
      showNotification('অনুগ্রহ করে নাম, মোবাইল নম্বর, সম্পূর্ণ ঠিকানা এবং থানা পূরণ করুন', 'error');
      return;
    }

    if (mobileNumber.length < 11) {
      showNotification('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন', 'error');
      return;
    }

    if (isOnlinePayment) {
      if (!senderNumber.trim() || !transactionId.trim()) {
        showNotification('অনলাইন পেমেন্টের ক্ষেত্রে বিকাশ/নগদ প্রেরক নম্বর এবং TrxID প্রদান করা আবশ্যক', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerId: customerUser?.id,
      customerName,
      mobileNumber,
      email,
      altMobileNumber,
      address,
      division,
      district,
      thana,
      postalCode,
      deliveryNotes,
      paymentMethod,
      senderNumber: isOnlinePayment ? senderNumber : undefined,
      transactionId: isOnlinePayment ? transactionId : undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.titleBn || item.product.title,
        productImage: item.product.images[0],
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      deliveryCharge,
      discount: discountAmount,
      totalAmount,
      couponCode: appliedCoupon?.code,
    };

    const newOrder = await placeOrder(orderPayload);
    setIsSubmitting(false);

    if (!newOrder) {
      showNotification('অর্ডারটি সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
            অর্ডার ফর্ম (গেস্ট চেকআউট)
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            কোনো রেজিস্ট্রেশন বা লগইন ছাড়াই দ্রুত অর্ডার সম্পন্ন করুন।
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Shipping & Payment Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Information */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-black">
                  ১
                </span>
                <span>শিপিং ও কাস্টমার ডেলিভারি তথ্য</span>
              </h2>

              <div className="space-y-4 text-xs font-medium text-gray-700">
                {/* Full Name */}
                <div>
                  <label className="block font-bold mb-1">
                    আপনার নাম (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: রাফিদ আহমেদ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white"
                    required
                  />
                </div>

                {/* Mobile Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="017xxxxxxxx"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="018xxxxxxxx"
                      value={altMobileNumber}
                      onChange={(e) => setAltMobileNumber(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block font-bold mb-1">
                    সম্পূর্ণ ঠিকানা (বাসা নম্বর, রোড, এলাকা) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: বাসা ৪২, রোড ৭, ব্লক বি, মিরপুর ১০"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white"
                    required
                  />
                </div>

                {/* Division, District, Thana */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">বিভাগ</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">জেলা <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="যেমন: ঢাকা / চট্টগ্রাম"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">থানা / উপজেলা <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="যেমন: ধানমন্ডি / মিরপুর"
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block font-bold mb-1">ডেলিভারি নোট (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখুন (যেমন: দুপুরের মধ্যে কল দিবেন)"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Choice */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-black">
                  ২
                </span>
                <span>পেমেন্ট মেথড নির্বাচন করুন</span>
              </h2>

              <div className="space-y-3 mb-6">
                {/* Cash On Delivery Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-blue-900 bg-blue-50/50 text-blue-950 font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-blue-900"
                    />
                    <div>
                      <span className="text-xs font-extrabold block">🚚 ক্যাশ অন ডেলিভারি (Cash On Delivery)</span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">
                    চার্জ: ৳{isInsideDhaka ? settings.insideDhakaFee : settings.outsideDhakaFee}
                  </span>
                </label>

                {/* bKash Payment Option */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50/60 text-pink-950 font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="w-4 h-4 text-pink-600"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-pink-700 block">📱 বিকাশ অনলাইন পেমেন্ট (bKash)</span>
                      <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5">
                        <Gift className="w-3.5 h-3.5" />
                        🎉 শিপিং ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    FREE
                  </span>
                </label>

                {/* Nagad Payment Option */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50/60 text-orange-950 font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-orange-700 block">📱 নগদ অনলাইন পেমেন্ট (Nagad)</span>
                      <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5">
                        <Gift className="w-3.5 h-3.5" />
                        🎉 শিপিং ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    FREE
                  </span>
                </label>
              </div>

              {/* bKash Payment Instructions Box */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 bg-pink-50 border border-pink-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-pink-900 border-b border-pink-200 pb-2">
                    <span>বিকাশ নম্বর: <strong className="text-base text-pink-700">{settings.bkashNumber}</strong> ({settings.bkashAccountType})</span>
                  </div>
                  <p className="text-pink-950 leading-relaxed">{settings.bkashInstructions}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-pink-950 mb-1">
                        প্রেরক বিকাশ নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="017xxxxxxxx"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full p-2.5 bg-white border border-pink-300 rounded-xl outline-none focus:border-pink-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-pink-950 mb-1">
                        Transaction ID (TrxID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: TRX9876543"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full p-2.5 bg-white border border-pink-300 rounded-xl outline-none focus:border-pink-600 font-mono uppercase"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nagad Payment Instructions Box */}
              {paymentMethod === 'nagad' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-orange-900 border-b border-orange-200 pb-2">
                    <span>নগদ নম্বর: <strong className="text-base text-orange-700">{settings.nagadNumber}</strong> ({settings.nagadAccountType})</span>
                  </div>
                  <p className="text-orange-950 leading-relaxed">{settings.nagadInstructions}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-orange-950 mb-1">
                        প্রেরক নগদ নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="018xxxxxxxx"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full p-2.5 bg-white border border-orange-300 rounded-xl outline-none focus:border-orange-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-orange-950 mb-1">
                        Transaction ID (TrxID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: NAG77665544"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full p-2.5 bg-white border border-orange-300 rounded-xl outline-none focus:border-orange-600 font-mono uppercase"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Order Summary Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>অর্ডার সামারি</span>
                <span className="text-xs bg-blue-50 text-blue-900 font-extrabold px-2.5 py-1 rounded-full">
                  {cart.length} টি পণ্য
                </span>
              </h2>

              {/* Product Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1 divide-y divide-gray-100">
                {cart.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product.id} className="pt-3 flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-200 p-1 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-gray-800 truncate">
                          {item.product.titleBn || item.product.title}
                        </p>
                        <p className="text-gray-500 text-[11px]">
                          পরিমাণ: {item.quantity} x ৳{price}
                        </p>
                      </div>
                      <span className="font-black text-xs text-blue-900">৳{price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Form */}
              <div className="p-3 bg-gray-50 rounded-2xl mb-4">
                <p className="text-[11px] font-bold text-gray-600 mb-1.5">কুপন ডিসকাউন্ট কোড:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="কোড লিখুন (যেমন: RITAM100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                  >
                    প্রয়োগ
                  </button>
                </div>
              </div>

              {/* Total Calculation breakdown */}
              <div className="space-y-2 text-xs font-medium text-gray-700 pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-gray-900">৳{cartSubtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>ডেলিভারি চার্জ:</span>
                  {isOnlinePayment ? (
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      ফ্রি (৳০)
                    </span>
                  ) : (
                    <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
                  )}
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>কুপন ছাড় ({appliedCoupon.code}):</span>
                    <span>-৳{appliedCoupon.discount}</span>
                  </div>
                )}
              </div>

              {/* Total Banner */}
              <div className="flex justify-between items-center my-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-sm font-bold text-gray-900">সর্বমোট (Total Amount):</span>
                <span className="text-2xl font-black text-blue-900">৳{totalAmount}</span>
              </div>

              {/* Free Shipping Alert Box */}
              {isOnlinePayment && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>🎉 অনলাইন পেমেন্ট (bKash/Nagad) করায় আপনার ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!</span>
                </div>
              )}

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>প্রসেস করা হচ্ছে...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                আপনার ব্যক্তিগত ও পেমেন্ট তথ্য সম্পূর্ণ সুরক্ষিত থাকবে।
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
