import React from 'react';
import {
  SlidersHorizontal,
  Search,
  Grid,
  List,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

const AGE_GROUPS = ['all', '০-৩ বছর', '৩-৮ বছর', '৪-১০ বছর', '৫-১২ বছর', '৬-১৪ বছর'];

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedAge,
    setSelectedAge,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
  } = useStore();

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = React.useState(false);

  // Filter products based on state
  const filteredProducts = products.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q) || (p.titleBn && p.titleBn.includes(q));
      const matchCategory = p.category.toLowerCase().includes(q) || (p.categoryBn && p.categoryBn.includes(q));
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchSku) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // Age
    if (selectedAge !== 'all' && !p.ageRecommendation.includes(selectedAge)) {
      return false;
    }

    // Price
    const effectivePrice = p.discountPrice || p.price;
    if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.isNewArrival ? 1 : -1;
    return 0; // featured
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAge('all');
    setPriceRange([0, 10000]);
    setSortBy('featured');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-amber-600 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs font-bold text-amber-300 bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
              Ritam World Toy Collection
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">
              সকল খেলনা শপ (Shop Toys)
            </h1>
            <p className="text-xs text-blue-100 mt-1">
              উচ্চমানের আরসি কার, হেলিকপ্টার, রোবট ও লার্নিং খেলনার বিশাল সংগ্রহ।
            </p>
          </div>

          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden w-full py-2.5 bg-amber-500 text-blue-950 font-black text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>ফিল্টার অপশন ফিল্টার করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar Filter (3 Cols) */}
          <div
            className={`md:col-span-3 space-y-6 ${
              showMobileFilter ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm space-y-6 sticky top-24">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <span>ফিল্টারসমূহ</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  রিসেট
                </button>
              </div>

              {/* Live Search */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">খেলনা অনুসন্ধান:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="খেলনার নাম..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-900"
                  />
                  <Search className="w-4 h-4 absolute right-2.5 top-3 text-gray-400" />
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">ক্যাটাগরি:</label>
                <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    সকল ক্যাটাগরি ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-blue-900 text-white font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      • {cat.nameBn || cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">বয়স অনুযায়ী:</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="all">সকল বয়সের জন্য</option>
                  {AGE_GROUPS.filter((a) => a !== 'all').map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter Slider */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মূল্য সীমা (৳0 - ৳{priceRange[1]}):
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-1">
                  <span>৳৫০০</span>
                  <span>৳১০,০০০</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Grid Column (9 Cols) */}
          <div className="md:col-span-9">
            {/* Top Bar Sorting & View Toggles */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs font-bold text-gray-700">
                মোট <strong className="text-blue-900 text-sm">{sortedProducts.length}</strong> টি খেলনা পাওয়া গিয়েছে
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Sorting Select */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                >
                  <option value="featured">পছন্দসই (Featured)</option>
                  <option value="price-low">দাম: কম থেকে বেশি</option>
                  <option value="price-high">দাম: বেশি থেকে কম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                  <option value="newest">নতুন কালেকশন</option>
                </select>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products List Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  কোনো খেলনা পাওয়া যায়নি!
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  আপনার অনুসন্ধান বা ফিল্টার অপশন পরিবর্তন করে আবার চেষ্টা করুন।
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6'
                    : 'space-y-4'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
