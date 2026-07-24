import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Printer,
  Sparkles,
  Link2,
  Smartphone,
} from 'lucide-react';
import { Product } from '../../types';
import { getProductPermalink, copyToClipboard, getSocialShareLinks } from '../../utils/shareUtils';
import { useStore } from '../../context/StoreContext';

interface ProductShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({ product, isOpen, onClose }) => {
  const { showNotification } = useStore();
  const [useShortLink, setUseShortLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qrcode'>('link');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen || !product) return null;

  const currentUrl = getProductPermalink(product.id, useShortLink);
  const shareLinks = getSocialShareLinks(product, currentUrl);

  // Generate QR Code when tab or URL changes
  useEffect(() => {
    if (product) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [product, currentUrl]);

  const handleCopy = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      showNotification('প্রডাক্ট লিংক সফলভাবে কপি করা হয়েছে!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showNotification('কপি করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.titleBn || product.title,
          text: `🔥 ${product.titleBn || product.title} - মূল্য: ৳${product.discountPrice || product.price}`,
          url: currentUrl,
        });
        showNotification('সফলভাবে শেয়ার করা হয়েছে!');
      } catch (err) {
        console.log('Share dismissed or failed', err);
      }
    }
  };

  const downloadQrCode = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `QR-${product.sku || product.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('QR কোড পিকচার ডাউনলোড হয়েছে');
  };

  const printQrCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${product.titleBn || product.title} - QR Code</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 40px; }
            .card { border: 2px solid #0f172a; padding: 24px; border-radius: 16px; max-width: 350px; margin: 0 auto; }
            img { width: 250px; height: 250px; }
            h2 { margin-top: 12px; font-size: 18px; color: #0f172a; }
            p { font-size: 14px; color: #64748b; margin: 4px 0; }
            .price { font-weight: bold; font-size: 20px; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>${product.titleBn || product.title}</h2>
            <p class="price">মূল্য: ৳${product.discountPrice || product.price}</p>
            <img src="${qrCodeDataUrl}" alt="QR Code" />
            <p>স্ক্যান করে ওয়েবসাইটে প্রডাক্টটি অর্ডায় করুন</p>
            <p><strong>Ritam World</strong></p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide">প্রডাক্ট শেয়ার করুন</h3>
              <p className="text-xs text-blue-200">কাস্টমার বা বন্ধুদের সাথে ১-ক্লিকে লিংক ও QR শেয়ার করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Compact Card Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <img
            src={product.images[0] || 'https://picsum.photos/200'}
            alt={product.title}
            className="w-16 h-16 object-contain rounded-xl bg-white border border-gray-200 p-1 flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {product.categoryBn || product.category}
            </span>
            <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
              {product.titleBn || product.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="font-black text-blue-950">৳{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-gray-400 line-through text-[11px]">৳{product.price}</span>
              )}
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                SKU: {product.sku}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Link vs QR Code) */}
        <div className="flex border-b border-gray-200 bg-gray-100/80 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2.5 text-xs font-black rounded-t-xl transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'link'
                ? 'bg-white text-blue-950 border-amber-500 shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent'
            }`}
          >
            <Link2 className="w-4 h-4 text-amber-500" />
            <span>সোশ্যাল মিডিয়া ও লিংক</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2.5 text-xs font-black rounded-t-xl transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'qrcode'
                ? 'bg-white text-blue-950 border-amber-500 shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent'
            }`}
          >
            <QrCode className="w-4 h-4 text-blue-800" />
            <span>QR কোড স্ক্যানার</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'link' ? (
            <>
              {/* Copy Link Input Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>প্রডাক্ট পার্মালিংক (URL)</span>
                  </label>

                  {/* Short Link Toggle */}
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useShortLink}
                      onChange={(e) => setUseShortLink(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-800 accent-blue-900"
                    />
                    <span>শর্ট লিংক ব্যবহার করুন</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 bg-gray-50 border border-gray-300 rounded-xl overflow-hidden focus-within:border-blue-900 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <input
                      type="text"
                      readOnly
                      value={currentUrl}
                      className="w-full px-3.5 py-2.5 text-xs font-mono text-gray-800 bg-transparent outline-none pr-10"
                    />
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-950 text-amber-300 hover:bg-blue-900'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Native Mobile Share trigger if available */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>মোবাইল নেটিভ অ্যাপে শেয়ার করুন</span>
                </button>
              )}

              {/* Direct Social Share Buttons */}
              <div>
                <p className="text-xs font-bold text-gray-700 mb-3">সোশ্যাল প্ল্যাটফর্মে শেয়ার করুন:</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Facebook</span>
                  </a>

                  {/* Messenger */}
                  <a
                    href={shareLinks.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <Send className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Messenger</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={shareLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <Send className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Telegram</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-900 hover:bg-black text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">X (Twitter)</span>
                  </a>

                  {/* Email */}
                  <a
                    href={shareLinks.email}
                    className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="p-1.5 bg-white/20 rounded-xl">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">ইমেইল</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* QR Code Display Tab */
            <div className="flex flex-col items-center justify-center text-center py-2 space-y-4">
              <div className="bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-xl relative inline-block">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Product QR Code" className="w-48 h-48 mx-auto" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-xs">
                    QR কোড জেনারেট হচ্ছে...
                  </div>
                )}
                <div className="mt-2 text-[11px] font-black text-blue-950 tracking-wider uppercase">
                  Ritam World Store
                </div>
              </div>

              <p className="text-xs font-medium text-gray-600 max-w-xs">
                যেকোনো স্মার্টফোন ক্যামেরা বা QR অ্যাপ দিয়ে স্ক্যান করলে সরাসরি এই প্রডাক্ট পেজটি ওপেন হবে।
              </p>

              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  onClick={downloadQrCode}
                  className="px-5 py-2.5 bg-blue-950 text-amber-300 font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>ডাউনলোড (PNG)</span>
                </button>

                <button
                  onClick={printQrCode}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 border border-gray-300"
                >
                  <Printer className="w-4 h-4 text-gray-700" />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <span>🔒 নিরাপদ ও সরাসরি ডিপ-লিংকিং সাপোর্টেড</span>
          <button onClick={onClose} className="hover:text-gray-800 font-bold">
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
