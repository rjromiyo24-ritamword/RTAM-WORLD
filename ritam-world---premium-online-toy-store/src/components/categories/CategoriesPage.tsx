import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, setSelectedCategory, navigateTo } = useStore();

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Ritam World Categories
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">
            খেলনার সকল ক্যাটাগরি
          </h1>
          <p className="text-xs font-medium text-gray-500">
            আপনার সন্তানের পছন্দের ক্যাটাগরি সিলেক্ট করে মনপসন্দ খেলনা নির্বাচন করুন।
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                navigateTo('shop');
              }}
              className="group bg-white rounded-3xl border border-gray-200/80 p-4 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 p-3 flex items-center justify-center">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=500&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-extrabold text-xs md:text-sm text-gray-900 group-hover:text-blue-900 transition-colors">
                    {cat.nameBn || cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-gray-400">
                    {cat.itemCount || 12}+ টি প্রোডাক্ট
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-900 group-hover:bg-amber-500 group-hover:text-blue-950 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
