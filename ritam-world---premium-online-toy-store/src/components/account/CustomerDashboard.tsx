import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Camera,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerAddress, Order, Product } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const {
    customerUser,
    logoutCustomer,
    updateCustomerProfile,
    updateCustomerAddresses,
    products,
    addToCart,
    toggleWishlist,
    wishlist,
    navigateTo,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'security'>('profile');

  // Customer Orders State
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(customerUser?.avatarUrl || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('বাসা');
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDetail, setAddrDetail] = useState('');
  const [addrDivision, setAddrDivision] = useState('Dhaka');
  const [addrDistrict, setAddrDistrict] = useState('Dhaka');
  const [addrThana, setAddrThana] = useState('Dhanmondi');
  const [addrPostal, setAddrPostal] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (customerUser) {
      setName(customerUser.name);
      setPhone(customerUser.phone);
      setEmail(customerUser.email || '');
      setAvatarUrl(customerUser.avatarUrl || '');

      // Fetch customer orders from server
      setLoadingOrders(true);
      fetch(`/api/customer/orders/${encodeURIComponent(customerUser.phone)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCustomerOrders(data);
          }
        })
        .catch((err) => console.error('Error loading customer orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [customerUser]);

  if (!customerUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">কাস্টমার অ্যাকাউন্ট প্যানেল</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          ড্যাশবোর্ড দেখতে এবং আপনার অর্ডার ট্র্যাকিং করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const success = await updateCustomerProfile({ name, phone, email, avatarUrl });
    setIsUpdatingProfile(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch(`/api/customer/password/${customerUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      showNotification(data.message, data.success ? 'success' : 'error');
      if (data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      showNotification('পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openAddressModalForAdd = () => {
    setEditingAddressId(null);
    setAddrLabel('বাসা');
    setAddrName(customerUser.name);
    setAddrPhone(customerUser.phone);
    setAddrDetail('');
    setAddrDivision('Dhaka');
    setAddrDistrict('Dhaka');
    setAddrThana('Dhanmondi');
    setAddrPostal('');
    setAddrIsDefault(customerUser.addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const openAddressModalForEdit = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrDetail(addr.address);
    setAddrDivision(addr.division);
    setAddrDistrict(addr.district);
    setAddrThana(addr.thana);
    setAddrPostal(addr.postalCode || '');
    setAddrIsDefault(Boolean(addr.isDefault));
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...customerUser.addresses];

    const newAddr: CustomerAddress = {
      id: editingAddressId || `addr-${Date.now()}`,
      label: addrLabel,
      fullName: addrName,
      phone: addrPhone,
      address: addrDetail,
      division: addrDivision,
      district: addrDistrict,
      thana: addrThana,
      postalCode: addrPostal,
      isDefault: addrIsDefault,
    };

    if (addrIsDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }

    if (editingAddressId) {
      updatedList = updatedList.map((a) => (a.id === editingAddressId ? newAddr : a));
    } else {
      updatedList.push(newAddr);
    }

    await updateCustomerAddresses(updatedList);
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('আপনি কি এই ঠিকানাটি মুছে ফেলতে চান?')) {
      const updatedList = customerUser.addresses.filter((a) => a.id !== id);
      await updateCustomerAddresses(updatedList);
    }
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">অপেক্ষমান (Pending)</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">কনফার্মড</span>;
      case 'Packaging':
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">প্যাকেজিং হচ্ছে</span>;
      case 'Shipping':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">শিপিং হচ্ছে</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">ডেলিভারড</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">বাতিলকৃত</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <img
                src={
                  customerUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerUser.name)}`
                }
                alt={customerUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-amber-400 shadow-lg bg-white"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">{customerUser.name}</h1>
                <p className="text-blue-200 text-sm mt-1 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{customerUser.phone}</span>
                </p>
              </div>
            </div>

            <button
              onClick={logoutCustomer}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-colors"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>আমার প্রোফাইল</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>আমার অর্ডারসমূহ</span>
              </div>
              {customerOrders.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-400 text-blue-950 rounded-full text-xs font-black">
                  {customerOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'addresses'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>সংরক্ষিত ঠিকানা</span>
              </div>
              <span className="text-xs opacity-75">{customerUser.addresses.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>উইশলিস্ট</span>
              </div>
              <span className="text-xs opacity-75">{wishlist.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'security'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>পাসওয়ার্ড সিকিউরিটি</span>
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-3">
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">
                  ব্যক্তিগত তথ্য আপডেট করুন
                </h3>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল এড্রেস</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">প্রোফাইল ছবি URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-md"
                  >
                    {isUpdatingProfile ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-black text-gray-900">আমার অর্ডার ইতিহাস</h3>
                  <span className="text-xs font-bold text-gray-500">
                    মোট {customerOrders.length} টি অর্ডার
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-gray-500">অর্ডারসমূহ লোড করা হচ্ছে...</div>
                ) : customerOrders.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 space-y-4">
                    <Package className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="font-bold">আপনি এখনও কোনো অর্ডার করেননি।</p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-5 py-2.5 bg-amber-500 text-blue-950 font-black rounded-xl hover:bg-amber-600 transition-colors text-xs"
                    >
                      শপিং শুরু করুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-2xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-blue-900 text-base">#{order.id}</span>
                                {getOrderStatusBadge(order.status)}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')} | ঠিকানা:{' '}
                                {order.address}, {order.thana}, {order.district}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="text-right">
                                <span className="text-xs text-gray-400 block">সর্বমোট মূল্য</span>
                                <span className="font-black text-gray-900 text-lg">৳{order.totalAmount}</span>
                              </div>

                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 rounded-full"
                              >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Order Items */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase">অর্ডারের আইটেমসমূহ:</h4>
                              <div className="divide-y divide-gray-100">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={item.productImage}
                                        alt={item.productTitle}
                                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                                      />
                                      <div>
                                        <p className="font-bold text-xs text-gray-800">{item.productTitle}</p>
                                        <p className="text-[11px] text-gray-500">
                                          ৳{item.price} × {item.quantity}টি
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-bold text-sm text-gray-900">
                                      ৳{item.price * item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1 text-gray-600">
                                <div className="flex justify-between">
                                  <span>পেমেন্ট মেথড:</span>
                                  <span className="font-bold uppercase text-gray-800">{order.paymentMethod}</span>
                                </div>
                                {order.transactionId && (
                                  <div className="flex justify-between">
                                    <span>ট্রানজেকশন ID:</span>
                                    <span className="font-mono font-bold text-blue-900">{order.transactionId}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>ডেলিভারি চার্জ:</span>
                                  <span>৳{order.deliveryCharge}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">সংরক্ষিত ডেলিভারি ঠিকানা</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      চেকআউটের সময় দ্রুত ব্যবহারের জন্য একাধিক ঠিকানা সংরক্ষণ করে রাখুন।
                    </p>
                  </div>
                  <button
                    onClick={openAddressModalForAdd}
                    className="px-4 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-blue-800 transition-colors shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ঠিকানা যোগ করুন</span>
                  </button>
                </div>

                {customerUser.addresses.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 space-y-3">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="font-bold text-sm">আপনার কোনো সংরক্ষিত ঠিকানা নেই।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerUser.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border ${
                          addr.isDefault ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200 bg-white'
                        } relative flex flex-col justify-between space-y-3 shadow-sm`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-black">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 bg-amber-400 text-blue-950 rounded-full text-[10px] font-extrabold">
                                ডিফল্ট ঠিকানা
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">{addr.fullName}</h4>
                          <p className="text-xs text-gray-600 font-medium mt-1">{addr.phone}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {addr.address}, {addr.thana}, {addr.district}, {addr.division}
                            {addr.postalCode && ` - ${addr.postalCode}`}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => openAddressModalForEdit(addr)}
                            className="p-2 text-gray-600 hover:text-blue-900 hover:bg-gray-100 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>সম্পাদনা</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-black text-gray-900">আমার পছন্দের তালিকা (Wishlist)</h3>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 space-y-3">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="font-bold text-sm">আপনার উইশলিস্টে কোনো পণ্য নেই।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 border border-gray-200 rounded-2xl flex items-center gap-4 bg-white shadow-sm"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-800 truncate">
                            {prod.titleBn || prod.title}
                          </h4>
                          <span className="font-black text-blue-900 text-sm block mt-1">
                            ৳{prod.discountPrice || prod.price}
                          </span>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => addToCart(prod)}
                              className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors"
                            >
                              কার্টে যোগ করুন
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">
                  পাসওয়ার্ড পরিবর্তন করুন
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">বর্তমান পাসওয়ার্ড</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">নতুন পাসওয়ার্ড</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      নতুন পাসওয়ার্ড পুনরায় লিখুন
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-md"
                  >
                    {isChangingPassword ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD/EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-gray-900">
              {editingAddressId ? 'ঠিকানা সম্পাদনা করুন' : 'নতুন ডেলিভারি ঠিকানা যোগ করুন'}
            </h3>

            <form onSubmit={handleAddressSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">ঠিকানার নাম/লেবেল (যেমন: বাসা, অফিস)</label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">প্রাপকের নাম</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">বিস্তারিত ঠিকানা (বাসা নং, রোড নং)</label>
                <textarea
                  required
                  rows={2}
                  value={addrDetail}
                  onChange={(e) => setAddrDetail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">জেলা (District)</label>
                  <input
                    type="text"
                    required
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">থানা/উপজিলা</label>
                  <input
                    type="text"
                    required
                    value={addrThana}
                    onChange={(e) => setAddrThana(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:border-blue-800 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-blue-900 focus:ring-blue-900"
                />
                <span>এটিকে ডিফল্ট ঠিকানা হিসেবে ব্যবহার করুন</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
