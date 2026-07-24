import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingButtons } from './components/layout/FloatingButtons';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { CategoriesPage } from './components/categories/CategoriesPage';
import { OffersPage } from './components/offers/OffersPage';
import { TrackOrderPage } from './components/track/TrackOrderPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import { PoliciesPage } from './components/pages/PoliciesPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { AccountDrawer } from './components/auth/AccountDrawer';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/order/OrderSuccessPage';
import { ProductDetailView } from './components/product/ProductDetailView';
import { ProductComparisonModal } from './components/product/ProductComparisonModal';
import { ProductShareModal } from './components/product/ProductShareModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activePage, notification, shareProductModal, closeShareModal } = useStore();

  const renderView = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-details':
      case 'product':
        return <ProductDetailView />;
      case 'categories':
        return <CategoriesPage />;
      case 'offers':
        return <OffersPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'policy':
        return <PoliciesPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'admin-dashboard':
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  const isFullAdminView = activePage === 'admin-dashboard' || activePage === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col selection:bg-amber-400 selection:text-blue-950">
      {/* Toast Notification Popup */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-3 border animate-bounce ${
            notification.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-blue-900 text-amber-300 border-amber-400'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main App Layout */}
      {!isFullAdminView && <Header />}

      <main className="flex-1">{renderView()}</main>

      {!isFullAdminView && <Footer />}

      {/* Floating Action Buttons & Mobile Bottom Nav */}
      {!isFullAdminView && <FloatingButtons />}
      {!isFullAdminView && <MobileNav />}

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <AccountDrawer />
      <ProductComparisonModal />
      <ProductShareModal
        product={shareProductModal}
        isOpen={Boolean(shareProductModal)}
        onClose={closeShareModal}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
