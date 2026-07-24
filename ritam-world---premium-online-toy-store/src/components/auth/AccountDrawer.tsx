import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  KeyRound,
  ShoppingBag,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AccountDrawer: React.FC = () => {
  const {
    isAccountDrawerOpen,
    setIsAccountDrawerOpen,
    customerUser,
    loginCustomer,
    registerCustomer,
    resetCustomerPassword,
    logoutCustomer,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    navigateTo,
    wishlist,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'admin'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isOtpMode, setIsOtpMode] = useState(false);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Login Form
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Form
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || (!isOtpMode && !loginPassword.trim())) {
      showNotification('মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড প্রদান করুন', 'error');
      return;
    }
    setLoading(true);
    if (isOtpMode) {
      setTimeout(() => {
        setLoading(false);
        showNotification('আপনার মোবাইলে ৪ ডিজিটের OTP পাঠানো হয়েছে (টেস্ট কোড: 1234)');
        setActiveTab('forgot');
        setForgotPhone(loginIdentifier);
        setOtpSent(true);
      }, 500);
      return;
    }
    const res = await loginCustomer(loginIdentifier, loginPassword);
    setLoading(false);
    if (res.success) {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPasswordInput.trim()) {
      showNotification('এডমিন ইউজারনেম ও পাসওয়ার্ড দিন', 'error');
      return;
    }
    setLoading(true);
    const success = await adminLogin(adminUsername, adminPasswordInput);
    setLoading(false);
    if (success) {
      setIsAccountDrawerOpen(false);
      navigateTo('admin-dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      showNotification('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং পাসওয়ার্ড পূরণ করুন', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showNotification('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না', 'error');
      return;
    }
    setLoading(true);
    const res = await registerCustomer({
      name: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
    });
    setLoading(false);
    if (res.success) {
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (!forgotPhone.trim()) {
        showNotification('মোবাইল নম্বর লিখুন', 'error');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
        showNotification('আপনার মোবাইলে ৪ ডিজিটের OTP পাঠানো হয়েছে (টেস্ট কোড: 1234)');
      }, 600);
      return;
    }

    if (!newPassword.trim()) {
      showNotification('নতুন পাসওয়ার্ড লিখুন', 'error');
      return;
    }

    setLoading(true);
    const res = await resetCustomerPassword({
      phone: forgotPhone,
      newPassword: newPassword,
    });
    setLoading(false);
    if (res.success) {
      setActiveTab('login');
      setForgotPhone('');
      setForgotOtp('');
      setOtpSent(false);
      setNewPassword('');
    }
  };

  if (!isAccountDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAccountDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                  <User className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">
                    {customerUser ? customerUser.name : isAdminLoggedIn ? 'এডমিন অ্যাকাউন্ট' : 'গ্রাহক অ্যাকাউন্ট'}
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {customerUser ? customerUser.phone : isAdminLoggedIn ? 'সিস্টেম অ্যাডমিনিস্ট্রেটর' : 'Ritam World ই-কমার্স'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAccountDrawerOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* IF LOGGED IN AS CUSTOMER */}
              {customerUser ? (
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/60 flex items-center gap-4 shadow-sm">
                    <img
                      src={
                        customerUser.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerUser.name)}`
                      }
                      alt={customerUser.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-gray-900 truncate text-base">{customerUser.name}</h4>
                      <p className="text-xs text-gray-600 font-medium truncate">{customerUser.phone}</p>
                      {customerUser.email && (
                        <p className="text-[11px] text-gray-500 truncate">{customerUser.email}</p>
                      )}
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>ভেরিফাইড কাস্টমার</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Quick Navigation Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                      আমার প্যানেল
                    </p>

                    <button
                      onClick={() => {
                        setIsAccountDrawerOpen(false);
                        navigateTo('customer-dashboard');
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-100 transition-colors font-bold text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-700" />
                        <span>কাস্টমার ড্যাশবোর্ড</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDrawerOpen(false);
                        navigateTo('customer-dashboard');
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                        <span>আমার অর্ডারসমূহ & ট্র্যাকিং</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDrawerOpen(false);
                        navigateTo('customer-dashboard');
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-rose-500" />
                        <span>সংরক্ষিত ডেলিভারি ঠিকানা ({customerUser.addresses.length})</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDrawerOpen(false);
                        navigateTo('customer-dashboard');
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span>পছন্দের তালিকা / Wishlist ({wishlist.length})</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setIsAccountDrawerOpen(false);
                      }}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                </div>
              ) : isAdminLoggedIn ? (
                /* IF LOGGED IN AS ADMIN */
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-amber-400" />
                      <div>
                        <h4 className="font-extrabold text-base">এডমিন কন্ট্রোল প্যানেল</h4>
                        <p className="text-xs text-blue-200">আপনি সিস্টেম অ্যাডমিন হিসেবে লগইন আছেন</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsAccountDrawerOpen(false);
                      navigateTo('admin-dashboard');
                    }}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <span>এডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      adminLogout();
                      setIsAccountDrawerOpen(false);
                    }}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>এডমিন লগআউট</span>
                  </button>
                </div>
              ) : (
                /* GUEST / NOT LOGGED IN FLOW */
                <div>
                  {/* Tabs Selector */}
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-6 gap-1">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'login'
                          ? 'bg-white text-blue-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      কাস্টমার লগইন
                    </button>
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'register'
                          ? 'bg-white text-blue-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      সাইন আপ
                    </button>
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'admin'
                          ? 'bg-blue-950 text-amber-300 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      এডমিন লগইন
                    </button>
                  </div>

                  {/* CUSTOMER LOGIN FORM */}
                  {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          মোবাইল নম্বর / ইমেইল এড্রেস
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="যেমন: 01711223344 বা email@example.com"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      {!isOtpMode && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700">পাসওয়ার্ড</label>
                            <button
                              type="button"
                              onClick={() => setActiveTab('forgot')}
                              className="text-xs text-blue-700 font-semibold hover:underline"
                            >
                              পাসওয়ার্ড ভুলে গেছেন?
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required={!isOtpMode}
                              placeholder="আপনার পাসওয়ার্ড দিন"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Remember Me & OTP Toggle */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded text-blue-900 focus:ring-blue-800 accent-blue-900"
                          />
                          <span>মনে রাখুন (Remember Me)</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsOtpMode(!isOtpMode)}
                          className="text-amber-700 font-bold hover:underline"
                        >
                          {isOtpMode ? 'পাসওয়ার্ড দিয়ে লগইন করুন' : 'OTP দিয়ে লগইন (Optional)'}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold rounded-xl hover:from-blue-800 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>{isOtpMode ? 'OTP কোড পাঠান' : 'লগইন করুন'}</span>
                          </>
                        )}
                      </button>

                      {/* Guest Checkout Option */}
                      <div className="pt-3 border-t border-gray-100 text-center space-y-2">
                        <p className="text-xs text-gray-500">একাউন্ট ছাড়াই দ্রুত অর্ডার করতে চান?</p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountDrawerOpen(false);
                            navigateTo('checkout');
                          }}
                          className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl text-xs transition-colors"
                        >
                          গেস্ট হিসেবে অর্ডার অব্যাহত রাখুন (Continue as Guest)
                        </button>
                      </div>

                      {/* Prominent Separate Admin Login Section Card */}
                      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200">
                        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-amber-400" />
                            <div>
                              <p className="text-xs font-black tracking-wide text-amber-300">
                                Administrator Login
                              </p>
                              <p className="text-[10px] text-gray-300">
                                অ্যাডমিন প্যানেল এক্সেসের জন্য
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab('admin')}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-blue-950 font-black text-xs rounded-xl transition-all shadow-sm"
                          >
                            এডমিন প্যানেল
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* ADMIN LOGIN FORM */}
                  {activeTab === 'admin' && (
                    <form onSubmit={handleAdminLoginSubmit} className="space-y-4 animate-fadeIn">
                      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-3.5 rounded-2xl border border-blue-800/50 mb-2">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-5 h-5 text-amber-400" />
                          <div>
                            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                              Administrator Login
                            </h4>
                            <p className="text-[11px] text-blue-200">
                              শুধুমাত্র ওয়েবসাইট অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          ইউজারনেম (Username)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="আপনার ইউজারনেম দিন"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-900 focus:outline-none"
                          />
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          পাসওয়ার্ড (Password)
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="আপনার পাসওয়ার্ড দিন"
                            value={adminPasswordInput}
                            onChange={(e) => setAdminPasswordInput(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-900 focus:outline-none"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-blue-950/30 border-t-blue-950 rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>এডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="w-full text-center text-xs text-gray-500 font-bold hover:underline pt-1"
                      >
                        কাস্টমার লগইনে ফিরে যান
                      </button>
                    </form>
                  )}

                  {/* REGISTER FORM */}
                  {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          আপনার নাম <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="আপনার পুরো নাম লিখুন"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          মোবাইল নম্বর <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="যেমন: 01711223344"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          ইমেইল এড্রেস (ঐচ্ছিক)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          পাসওয়ার্ড <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-blue-950/30 border-t-blue-950 rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>সাইন আপ করুন</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* FORGOT PASSWORD FORM */}
                  {activeTab === 'forgot' && (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <p className="text-xs text-gray-600">
                        আপনার নিবন্ধিত মোবাইল নম্বর দিন। আমরা আপনার পাসওয়ার্ড পুনঃনির্ধারণে সহায়তা করব।
                      </p>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          মোবাইল নম্বর
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            disabled={otpSent}
                            placeholder="যেমন: 01711223344"
                            value={forgotPhone}
                            onChange={(e) => setForgotPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none transition-colors"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      {otpSent && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              OTP ভেরিফিকেশন কোড (টেস্ট কোড: 1234)
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              placeholder="1234"
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value)}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono tracking-widest text-center focus:bg-white focus:border-blue-800 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              নতুন পাসওয়ার্ড
                            </label>
                            <input
                              type="password"
                              required
                              placeholder="নতুন পাসওয়ার্ড লিখুন"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-800 focus:outline-none"
                            />
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            <span>{otpSent ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'OTP প্রেরণ করুন'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setOtpSent(false);
                        }}
                        className="w-full text-center text-xs text-gray-500 font-medium hover:underline pt-2"
                      >
                        লগইন পেজে ফিরে যান
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <span>নিরাপদ ১২৮-বিট এনক্রিপশন</span>
              </div>
              <span className="font-bold text-blue-950">Ritam World</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
