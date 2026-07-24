import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle,
  Share2,
  Video,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Send,
  Tag,
  QrCode,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    navigateTo,
    showNotification,
    openShareModal,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'features' | 'delivery' | 'reviews' | 'video'>('desc');

  // Review Form state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-gray-600">প্রডাক্টটি পাওয়া যায়নি</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2 bg-blue-900 text-white font-bold rounded-xl"
        >
          শপ পেজে যান
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      showNotification('অনুগ্রহ করে আপনার নাম ও মন্তব্য প্রদান করুন', 'error');
      return;
    }
    const newRev = {
      id: `r-${Date.now()}`,
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
    };
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(newRev);
    product.reviewCount = (product.reviewCount || 0) + 1;

    setNewReviewName('');
    setNewReviewComment('');
    showNotification('আপনার মূল্যবান রিভিউটির জন্য ধন্যবাদ!');
  };

  const shareProduct = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification('প্রডাক্ট লিংক কপি করা হয়েছে!');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-blue-900">
            হোম
          </button>
          <span>/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-blue-900">
            শপ
          </button>
          <span>/</span>
          <span className="text-amber-600 font-bold">{product.categoryBn || product.category}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.titleBn || product.title}</span>
        </div>

        {/* Product Top Grid: Gallery & Info */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-5 md:p-8 shadow-sm mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Featured Image Display */}
            <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-4 flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  {discountPercent}% ছাড়
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-gray-50 p-1 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Tab quick preview button */}
            {product.videoUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className="w-full py-2.5 bg-blue-50 text-blue-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
              >
                <Video className="w-4 h-4 text-blue-800" />
                <span>প্রডাক্ট ভিডিও রিভিউ দেখুন</span>
              </button>
            )}
          </div>

          {/* Product Info Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Stock */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {product.categoryBn || product.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {product.inStock ? 'স্টক আছে (ইন স্টক)' : 'স্টক শেষ'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-2 leading-snug">
                {product.titleBn || product.title}
              </h1>

              {/* Rating & SKU */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewCount} রিভিউ)</span>
                </div>
                <span>|</span>
                <span>কোড/SKU: <strong className="text-gray-700">{product.sku}</strong></span>
                <span>|</span>
                <span>ব্র্যান্ড: <strong className="text-gray-700">{product.brand}</strong></span>
                <span>|</span>
                <span>বয়স: <strong className="text-amber-600">{product.ageRecommendation}</strong></span>
              </div>

              {/* Price Box */}
              <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-4 rounded-2xl border border-blue-100 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-blue-950">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-base text-gray-400 line-through font-semibold">
                      ৳{product.price}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                      আপনার সঞ্চয়: ৳{product.price - product.discountPrice}
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  🎉 অনলাইন পেমেন্টে (bKash/Nagad) শিপিং ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-gray-700">পরিমাণ:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-200 text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-black text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-200 text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="py-3.5 px-6 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>অর্ডার করুন (Buy Now)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Secondary Actions: Wishlist & Share */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isWishlisted 
                      ? 'bg-red-50 text-red-600 border-red-200' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  <span>{isWishlisted ? 'উইশলিস্টে আছে' : 'উইশলিস্টে রাখুন'}</span>
                </button>

                <button
                  onClick={() => openShareModal(product)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-900 to-blue-950 text-amber-300 hover:from-blue-800 hover:to-blue-900 font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>শেয়ার করুন (Share Product)</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-[11px] text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-900" />
                <span>ঢাকা ১-২ দিন, বাইরে ২-৩ দিন</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>৭ দিনের ওয়ারেন্টি ও গ্যারান্টি</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm mb-12">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'desc'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              বিবরণ (Description)
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              স্পেসিফিকেশন
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'features'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              বৈশিষ্ট্যসমূহ
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'delivery'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ডেলিভারি ও ওয়ারেন্টি
            </button>

            {product.videoUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Video className="w-4 h-4 text-amber-400" />
                ভিডিও রিভিউ
              </button>
            )}

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              রিভিউ ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'desc' && (
            <div className="text-gray-700 text-sm leading-relaxed space-y-4">
              <p>{product.description}</p>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">💡 কেন রিতম ওয়ার্ল্ডের খেলনা সেরা?</h4>
                <p className="text-xs text-amber-800">
                  আমাদের প্রত্যেকটি খেলনা সরাসরি ফ্যাক্টরি টেস্টের পর কাস্টমারের নিকট পাঠানো হয়। কোনো প্রকার ত্রুটিযুক্ত পণ্য আমরা প্রদান করি না।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3 font-bold text-gray-800 border border-gray-100 w-1/3">{key}</td>
                      <td className="p-3 text-gray-600 border border-gray-100">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'features' && (
            <ul className="space-y-2 text-xs md:text-sm text-gray-700">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 text-xs md:text-sm text-gray-700">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">🚚 ডেলিভারি সময়সীমা:</h4>
                <p>{product.deliveryTimeDays || 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিন।'}</p>
                <p className="mt-2 text-amber-700 font-bold">
                  🎉 অনলাইন পেমেন্ট (bKash / Nagad) করলে আপনার ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-1">🛡️ ওয়ারেন্টি ও রিটার্ন পলিসি:</h4>
                <p>{product.warrantyPeriod || '৭ দিনের ফিজিক্যাল ড্যামেজ ও রিপ্লেসমেন্ট সুবিধা।'}</p>
              </div>
            </div>
          )}

          {activeTab === 'video' && product.videoUrl && (
            <div className="aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src={product.videoUrl}
                title="Product Demo Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-gray-800">{rev.userName}</span>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">এখনো কোনো কাস্টমার রিভিউ পাওয়া যায়নি। প্রথম রিভিউ দিন!</p>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="pt-6 border-t border-gray-200 space-y-4">
                <h4 className="font-bold text-sm text-gray-900">আপনার মতামত বা রিভিউ দিন:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="আপনার নাম (যেমন: তানভীর হোসাইন)"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-blue-900"
                    required
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">রেটিং:</span>
                    <div className="flex gap-1 text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  placeholder="খেলনাটি আপনার সন্তানের কেমন লেগেছে এবং ডেলিভারি কেমন ছিল লিখুন..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-blue-900"
                  required
                />

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রিভিউ পোস্ট করুন</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              <span>একই ক্যাটাগরির অন্যান্য খেলনা</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
