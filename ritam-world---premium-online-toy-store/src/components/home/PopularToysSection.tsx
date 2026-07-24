import React, { useState } from 'react';
import { Sparkles, Flame, Star, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const PopularToysSection: React.FC = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'best' | 'new' | 'rc' | 'learning'>('all');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'best':
        return products.filter((p) => p.isBestSeller);
      case 'new':
        return products.filter((p) => p.isNewArrival);
      case 'rc':
        return products.filter((p) => p.category === 'rc-cars' || p.category === 'helicopters');
      case 'learning':
        return products.filter((p) => p.category === 'educational-toys' || p.category === 'learning-toys');
      default:
        return products;
    }
  };

  const displayList = getFilteredProducts().slice(0, 8);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Trending Toys
            </span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 mt-2 flex items-center gap-2">
              <span>জনপ্রিয় খেলনা কালেকশন</span>
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            </h2>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              সকল খেলনা
            </button>

            <button
              onClick={() => setActiveTab('best')}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                activeTab === 'best'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              বেস্ট সেলার
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                activeTab === 'new'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              নতুন আগমন
            </button>

            <button
              onClick={() => setActiveTab('rc')}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                activeTab === 'rc'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              আরসি ড্রেন ও কার
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                activeTab === 'learning'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              এডুকেশনাল টয়
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
