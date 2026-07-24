import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  PhoneCall,
  UserCheck,
  User,
  Menu,
  X,
  Truck,
  ShieldCheck,
  ChevronDown,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const {
    settings,
    cartTotalCount,
    cartSubtotal,
    wishlist,
    activePage,
    navigateTo,
    setIsCartOpen,
    setIsAccountDrawerOpen,
    customerUser,
    isAdminLoggedIn,
    categories,
    products,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    openProductDetails,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live search suggestions
  const searchSuggestions =
    searchQuery.trim().length > 0
      ? products
          .filter(
            (p) =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.titleBn && p.titleBn.includes(searchQuery)) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop', { searchQuery: searchQuery.trim() });
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-600 text-white text-xs md:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse">
              বিশেষ অফার
            </span>
            <span className="truncate">{settings.noticeBarText}</span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-amber-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              "{settings.storeMotto}"
            </span>
            <span className="text-blue-200">|</span>
            <a
              href={`tel:${settings.hotlinePhone}`}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              হটলাইন: {settings.hotlinePhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo & Brand Motto */}
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src="/src/assets/images/ritam_world_logo_1784827688657.jpg"
                  alt="Ritam World Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                  onError={(e) => {
                    // Fallback icon view
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-blue-900 uppercase">
                    Ritam<span className="text-amber-500 ml-1">World</span>
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 hidden sm:inline-block" />
                </div>
                <span className="text-[11px] md:text-xs text-amber-600 font-bold leading-tight">
                  {settings.storeMotto}
                </span>
              </div>
            </div>
          </div>

          {/* Live Search Form */}
          <div className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="পছন্দের খেলনা, আরসি কার, ড্রোন বা রোবট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border-2 border-blue-900/20 focus:border-blue-800 focus:bg-white rounded-full text-sm font-medium transition-all shadow-inner outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-full hover:from-blue-800 hover:to-blue-700 transition-all shadow"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Dropdown Modal */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden divide-y divide-gray-100">
                <div className="p-2 bg-blue-50/60 text-xs font-semibold text-blue-900 flex justify-between items-center">
                  <span>অনুসন্ধান ফলাফল ({searchSuggestions.length})</span>
                  <span className="text-gray-400">Ritam World</span>
                </div>
                {searchSuggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      openProductDetails(product.id);
                      setIsSearchFocused(false);
                    }}
                    className="p-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {product.titleBn || product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-blue-900">
                          ৳{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons: Hotline, Wishlist, Cart, Top-Right Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call hotline */}
            <a
              href={`tel:${settings.hotlinePhone}`}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors text-xs font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>কল করুন</span>
            </a>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('shop')}
              className="relative p-2 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="উইশলিস্ট"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon & Price Summary */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-full hover:from-blue-800 hover:to-blue-700 shadow-md transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-blue-950 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
                <span className="text-[10px] text-blue-200">আমার কার্ট</span>
                <span className="text-xs font-black">৳{cartSubtotal}</span>
              </div>
            </button>

            {/* Top-Right Account Button & Panel Trigger */}
            <button
              onClick={() => setIsAccountDrawerOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-amber-400 hover:bg-amber-500 text-blue-950 font-black rounded-full shadow-md transition-all group border border-amber-300"
              title="একাউন্ট প্যানেল"
            >
              <div className="relative flex items-center justify-center w-6 h-6 bg-blue-950 text-white rounded-full">
                {customerUser?.avatarUrl ? (
                  <img
                    src={customerUser.avatarUrl}
                    alt={customerUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-extrabold truncate max-w-[90px]">
                {customerUser ? customerUser.name.split(' ')[0] : isAdminLoggedIn ? 'এডমিন' : 'একাউন্ট'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="খেলনা, আরসি কার, ডোন বা রোবট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium outline-none focus:border-blue-900"
            />
            <button type="submit" className="absolute right-2 p-1.5 text-blue-900">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="bg-blue-900 text-white hidden lg:block border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Category Mega Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 bg-amber-500 text-blue-950 px-5 py-3 font-bold text-sm hover:bg-amber-400 transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span>সব ক্যাটাগরি</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Category Dropdown List */}
              {isCategoryMenuOpen && (
                <div
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white text-gray-800 shadow-2xl rounded-b-xl border border-gray-100 z-50 py-2 divide-y divide-gray-100"
                >
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        navigateTo('shop');
                        setIsCategoryMenuOpen(false);
                      }}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 hover:text-blue-900 cursor-pointer text-xs font-bold transition-colors"
                    >
                      <span>{cat.nameBn || cat.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {cat.itemCount || 10}+
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menu Links */}
            <div className="flex items-center gap-1 font-semibold text-sm pl-4">
              <button
                onClick={() => navigateTo('home')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors ${
                  activePage === 'home' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                হোম
              </button>
              <button
                onClick={() => navigateTo('shop')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors ${
                  activePage === 'shop' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                সকল খেলনা (Shop)
              </button>
              <button
                onClick={() => navigateTo('categories')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors ${
                  activePage === 'categories' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                ক্যাটাগরি
              </button>
              <button
                onClick={() => navigateTo('offers')}
                className={`px-4 py-3 flex items-center gap-1 hover:text-amber-400 transition-colors text-amber-300 font-bold ${
                  activePage === 'offers' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                অফার ও ফ্ল্যাশ সেল
              </button>
              <button
                onClick={() => navigateTo('track-order')}
                className={`px-4 py-3 flex items-center gap-1 hover:text-amber-400 transition-colors ${
                  activePage === 'track-order' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                অর্ডার ট্র্যাক
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors ${
                  activePage === 'about' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                আমাদের কথা
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors ${
                  activePage === 'contact' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : ''
                }`}
              >
                যোগাযোগ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-700">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>অনলাইন পেমেন্টে ফ্রি ডেলিভারি!</span>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="font-black text-lg text-blue-900">
                Ritam<span className="text-amber-500">World</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-2 border-b border-gray-100">
              <button
                onClick={() => {
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                হোম
              </button>
              <button
                onClick={() => {
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                সকল খেলনা (Shop)
              </button>
              <button
                onClick={() => {
                  navigateTo('categories');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                ক্যাটাগরি
              </button>
              <button
                onClick={() => {
                  navigateTo('offers');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-lg"
              >
                স্পেশাল অফার
              </button>
              <button
                onClick={() => {
                  navigateTo('track-order');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                অর্ডার ট্র্যাকিং
              </button>
              <button
                onClick={() => {
                  navigateTo('about');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                আমাদের সম্পর্কে
              </button>
              <button
                onClick={() => {
                  navigateTo('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
              >
                যোগাযোগ
              </button>
              <button
                onClick={() => {
                  navigateTo('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-blue-900 hover:bg-blue-50 rounded-lg"
              >
                এডমিন লগইন
              </button>
            </div>

            <div className="pt-4">
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase">ক্যাটাগরি</p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigateTo('shop');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-900"
                  >
                    • {cat.nameBn || cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
