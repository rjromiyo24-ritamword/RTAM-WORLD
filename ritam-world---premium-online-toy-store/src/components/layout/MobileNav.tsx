import React from 'react';
import { Home, Grid, Tag, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const { activePage, navigateTo, cartTotalCount, wishlist, setIsCartOpen } = useStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-2 px-4">
      <div className="grid grid-cols-5 items-center text-center">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activePage === 'home' ? 'text-blue-900 font-extrabold' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-none">হোম</span>
        </button>

        {/* Shop/Catalog */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activePage === 'shop' ? 'text-blue-900 font-extrabold' : 'text-gray-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] leading-none">শপ</span>
        </button>

        {/* Offers */}
        <button
          onClick={() => navigateTo('offers')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activePage === 'offers' ? 'text-amber-600 font-extrabold' : 'text-gray-500'
          }`}
        >
          <Tag className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] leading-none">অফার</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigateTo('shop')}
          className="relative flex flex-col items-center gap-1 text-gray-500"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] leading-none">পছন্দ</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-blue-900 font-bold"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-blue-950 text-[9px] font-black rounded-full flex items-center justify-center">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">কার্ট</span>
        </button>
      </div>
    </div>
  );
};
