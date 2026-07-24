import React from 'react';
import { X, ShoppingBag, Trash2, Check, AlertCircle, Scale } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductComparisonModal: React.FC = () => {
  const { compareList, isCompareOpen, setIsCompareOpen, toggleCompare, clearCompare, products, addToCart } = useStore();

  if (!isCompareOpen) return null;

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">খেলনা তুলনা করুন (Product Comparison)</h2>
              <p className="text-xs text-gray-500">পাশাপাশি একাধিক খেলনার দাম, ফিচার ও বয়স নির্ধারণ তুলনা করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                তালিকা খালি করুন
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Scale className="w-12 h-12 text-gray-300 mx-auto stroke-1" />
            <p className="text-sm font-bold text-gray-700">তুলনা তালিকায় কোনো খেলনা যুক্ত নেই</p>
            <p className="text-xs text-gray-500">
              যেকোনো খেলনার কার্ডের উপর স্কেল আইকন (<Scale className="w-3.5 h-3.5 inline text-blue-900" />) এ ক্লিক করে তুলনা তালিকায় যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-50 border-b border-gray-200 text-gray-500 font-bold w-36">ফিচার</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-3 bg-gray-50 border-b border-gray-200 min-w-[200px] text-center">
                      <div className="space-y-2">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-24 h-24 object-cover rounded-2xl mx-auto border border-gray-200 shadow-sm"
                        />
                        <p className="font-extrabold text-gray-900 line-clamp-2">{p.titleBn || p.title}</p>
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">মূল্য (Price)</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      {p.discountPrice ? (
                        <div className="space-y-0.5">
                          <span className="font-black text-sm text-blue-900">৳{p.discountPrice}</span>
                          <span className="block text-[11px] text-gray-400 line-through">৳{p.price}</span>
                        </div>
                      ) : (
                        <span className="font-black text-sm text-blue-900">৳{p.price}</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">বয়স সীমা (Age)</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-gray-800">
                      {p.ageRecommendation}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">ক্যাটাগরি</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-medium text-gray-600">
                      {p.categoryBn || p.category}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">স্টক অবস্থা</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold">
                      {p.inStock ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">স্টকে আছে ({p.stockCount} টি)</span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full">স্টক শেষ</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">ওয়ারেন্টি</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-medium text-gray-600">
                      {p.warrantyPeriod || '৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-gray-700 bg-gray-50/50">অর্ডার করুন</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <button
                        onClick={() => {
                          addToCart(p, 1);
                          setIsCompareOpen(false);
                        }}
                        className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        কার্টে রাখুন
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
