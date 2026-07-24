import React from 'react';
import { Heart, ShoppingBag, Star, Zap, Eye, Scale, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, openProductDetails, navigateTo, openShareModal } = useStore();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigateTo('checkout');
  };

  return (
    <div
      onClick={() => openProductDetails(product.id)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white font-black text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-white" />
            {discountPercent}% ছাড়
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
            নতুন
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-blue-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow">
            বেস্ট সেলার
          </span>
        )}
      </div>

      {/* Top Right Action Buttons (Wishlist, Compare & Share) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openShareModal(product);
          }}
          className="p-2 rounded-full shadow-md transition-all bg-white/90 backdrop-blur-sm text-gray-600 hover:text-amber-600 hover:bg-white"
          title="প্রডাক্ট শেয়ার করুন"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          className={`p-2 rounded-full shadow-md transition-all ${
            isCompared
              ? 'bg-blue-900 text-amber-400 border border-amber-400'
              : 'bg-white/80 backdrop-blur text-gray-500 hover:text-blue-900'
          }`}
          title="তুলনা তালিকায় রাখুন"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full shadow-md transition-all ${
            isWishlisted
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-white/80 backdrop-blur text-gray-500 hover:text-red-500'
          }`}
          title="উইশলিস্টে রাখুন"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600' : ''}`} />
        </button>
      </div>

      {/* Image Gallery Thumbnail View */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0] || 'https://picsum.photos/seed/toy/400/400'}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-blue-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            বিস্তারিত দেখুন
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 md:p-4 flex flex-col flex-1">
        {/* Category & Age */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1">
          <span className="text-amber-600 font-bold uppercase tracking-wider truncate">
            {product.categoryBn || product.category}
          </span>
          <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[10px]">
            বয়স: {product.ageRecommendation}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blue-900 transition-colors mb-2 leading-snug">
          {product.titleBn || product.title}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-gray-500">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base md:text-lg font-black text-blue-900">
              ৳{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                ৳{product.price}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              কার্টে রাখুন
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              কিনুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
