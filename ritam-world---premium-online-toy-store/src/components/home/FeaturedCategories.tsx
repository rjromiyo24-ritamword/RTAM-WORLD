import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FeaturedCategories: React.FC = () => {
  const { categories, setSelectedCategory, navigateTo } = useStore();

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ক্যাটাগরি সমূহ
            </span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 mt-2">
              পপুলার খেলনা ক্যাটালগ
            </h2>
          </div>

          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>সব ক্যাটাগরি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                navigateTo('shop');
              }}
              className="group bg-gray-50 hover:bg-blue-50/80 rounded-2xl p-3 border border-gray-100 hover:border-amber-400 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden p-1 shadow-inner mb-2 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="text-xs font-bold text-gray-800 group-hover:text-blue-900 line-clamp-1">
                {cat.nameBn || cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
