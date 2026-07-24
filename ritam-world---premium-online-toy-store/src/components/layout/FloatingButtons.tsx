import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FloatingButtons: React.FC = () => {
  const { settings } = useStore();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 z-40 flex flex-col items-end gap-3 pointer-events-none">
      <div className="flex flex-col gap-2.5 pointer-events-auto">
        {/* WhatsApp Chat Floating Button */}
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
            'হ্যালো! Ritam World খেলনা শপ থেকে তথ্য জানতে চাই।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
          title="WhatsApp এ কথা বলুন"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold px-0 group-hover:px-2">
            WhatsApp
          </span>
        </a>

        {/* Messenger Chat Floating Button */}
        <a
          href={settings.messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
          title="Messenger এ চ্যাট করুন"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold px-0 group-hover:px-2">
            Messenger
          </span>
        </a>

        {/* Phone Call Floating Button */}
        <a
          href={`tel:${settings.hotlinePhone}`}
          className="group flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-600 text-blue-950 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 font-bold"
          title="সরাসরি কল করুন"
        >
          <Phone className="w-5 h-5 fill-blue-950" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-black px-0 group-hover:px-2">
            কল করুন
          </span>
        </a>

        {/* Back To Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 bg-gray-900/80 hover:bg-blue-900 text-white rounded-full shadow-lg backdrop-blur hover:scale-110 transition-all duration-300 border border-gray-700"
            title="উপরে যান"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
