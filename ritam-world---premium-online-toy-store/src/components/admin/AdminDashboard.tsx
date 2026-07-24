import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  LogOut,
  Lock,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Printer,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  X,
  Phone,
  MapPin,
  FolderTree,
  User,
  Users,
  Database,
  Download,
  Upload,
  RefreshCw,
  CreditCard,
  Globe,
  Share2,
  Server,
  Key,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, Product, OrderStatus } from '../../types';
import { getCloudDbConfig, saveCloudDbConfig, testCloudDbConnection, CloudDbConfig } from '../../utils/cloudDb';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    products,
    categories,
    orders,
    coupons,
    settings,
    updateOrderStatus,
    addNewProduct,
    updateProduct,
    deleteProduct,
    addNewCategory,
    deleteCategory,
    updateStoreSettings,
    fetchAdminData,
    showNotification,
    openShareModal,
  } = useStore();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active tab state inside dashboard
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'customers' | 'coupons' | 'settings' | 'profile' | 'backup'
  >('overview');

  // Customer Management State
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'customers' && isAdminLoggedIn) {
      setLoadingCustomers(true);
      fetch('/api/admin/customers')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setAdminCustomers(data);
        })
        .catch((err) => console.error('Error fetching admin customers:', err))
        .finally(() => setLoadingCustomers(false));
    }
  }, [activeTab, isAdminLoggedIn]);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameBn, setNewCatNameBn] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🚗');

  // Admin Profile State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('123123');
  const [adminEmail, setAdminEmail] = useState('admin@ritamworld.com');
  const [adminPhone, setAdminPhone] = useState('01700112233');
  const [adminAvatar, setAdminAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Settings State
  const [dbConfig, setDbConfig] = useState<CloudDbConfig>(getCloudDbConfig());
  const [isTestingDb, setIsTestingDb] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    hotlinePhone: settings.hotlinePhone || '01700112233',
    whatsappNumber: settings.whatsappNumber || '8801700112233',
    bkashNumber: settings.bkashNumber || '01711223344',
    bkashAccountType: settings.bkashAccountType || 'Personal',
    bkashInstructions: settings.bkashInstructions || 'বিকাশ অ্যাপ থেকে Send Money করে ট্রানজেকশন আইডি দিন।',
    nagadNumber: settings.nagadNumber || '01822334455',
    nagadAccountType: settings.nagadAccountType || 'Personal',
    nagadInstructions: settings.nagadInstructions || 'নগদ অ্যাপ থেকে Send Money করে ট্রানজেকশন আইডি দিন।',
    insideDhakaFee: settings.insideDhakaFee || 60,
    outsideDhakaFee: settings.outsideDhakaFee || 120,
    storeMotto: settings.storeMotto || 'গ্রাহকের বিশ্বাসই আমাদের সবচেয়ে বড় সম্পদ',
    noticeBarText: settings.noticeBarText || '🎉 অনলাইন পেমেন্ট (bKash/Nagad) করলে সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
    seoTitle: 'Ritam World - বাংলাদেশের সেরা খেলনার দোকান',
    seoDescription: 'শিশুদের আকর্ষণীয় ও শিক্ষণীয় প্রিমিয়াম খেলনার বিশ্বস্ত ই-কমার্স শপ।',
    seoKeywords: 'toys, ritam world, baby toys, rc car, educational toys, bangladesh',
  });

  // Orders Filter & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Products Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    titleBn: '',
    price: 0,
    discountPrice: 0,
    category: 'rc-cars',
    categoryBn: 'আরসি ড্রেন ও কার',
    stock: 20,
    description: '',
    descriptionBn: '',
    ageRecommendation: '৩-৮ বছর',
    images: '',
    videoUrl: '',
    sku: '',
  });

  // Coupons Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(100);
  const [newCouponMinAmount, setNewCouponMinAmount] = useState(1000);

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await adminLogin(usernameInput, passwordInput);
    setIsLoggingIn(false);
    if (success) {
      setPasswordInput('');
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoggingIn(true);
    await adminLogin('admin', '123123');
    setIsLoggingIn(false);
  };

  // If not logged in, render Secure Login Form
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-blue-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-400/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">অ্যাডমিন প্যানেল লগইন</h1>
            <p className="text-xs text-gray-500 mt-1">
              Ritam World অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার ইউজারনেম ও পাসওয়ার্ড দিন।
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ইউজারনেম:
              </label>
              <input
                type="text"
                placeholder="ইউজারনেম (Default: admin)"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-900 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পাসওয়ার্ড:
              </label>
              <input
                type="password"
                placeholder="পাসওয়ার্ড টাইপ করুন (Default: 123123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-900 focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition-all"
            >
              ⚡ এক-ক্লিকে টেস্ট লগইন করুন (admin / 123123)
            </button>
            <p className="text-[11px] text-gray-400">
              ডিফল্ট ইউজারনেম: <strong className="text-blue-900">admin</strong> | পাসওয়ার্ড: <strong className="text-blue-900">123123</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered Orders List
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'All' && order.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.mobileNumber.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Handle Save Product (Create / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const imgArray = productForm.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: productForm.title,
      titleBn: productForm.titleBn,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      category: productForm.category,
      categoryBn: productForm.categoryBn,
      stockCount: Number(productForm.stock),
      inStock: Number(productForm.stock) > 0,
      description: productForm.descriptionBn || productForm.description,
      ageRecommendation: productForm.ageRecommendation,
      images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80'],
      videoUrl: productForm.videoUrl,
      sku: productForm.sku || `RW-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5,
      numReviews: 12,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addNewProduct(payload);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      titleBn: '',
      price: 1500,
      discountPrice: 1200,
      category: 'rc-cars',
      categoryBn: 'আরসি ড্রেন ও কার',
      stock: 15,
      description: '',
      descriptionBn: '',
      ageRecommendation: '৩-৮ বছর',
      images: '',
      videoUrl: '',
      sku: '',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      titleBn: product.titleBn || '',
      price: product.price,
      discountPrice: product.discountPrice || 0,
      category: product.category,
      categoryBn: product.categoryBn || '',
      stock: product.stockCount,
      description: product.description,
      descriptionBn: product.description || '',
      ageRecommendation: product.ageRecommendation,
      images: product.images.join(', '),
      videoUrl: product.videoUrl || '',
      sku: product.sku,
    });
    setIsProductModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-blue-950 text-white flex-shrink-0 p-4 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-blue-900">
          <div>
            <span className="text-xl font-black uppercase text-white">
              Ritam<span className="text-amber-400 ml-1">Admin</span>
            </span>
            <p className="text-[10px] text-amber-300">কন্ট্রোল প্যানেল</p>
          </div>

          <button
            onClick={adminLogout}
            className="p-1.5 rounded-lg bg-blue-900 hover:bg-red-600 text-white transition-colors"
            title="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ওভারভিউ ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার ম্যানেজমেন্ট</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'products'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>প্রডাক্ট ক্যাটালগ</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>ক্যাটাগরি ও ব্র্যান্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>কাস্টমার লিস্ট ({adminCustomers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'coupons'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>কুপন ও ছাড় অফার</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>সাইট ও পেমেন্ট সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>এডমিন প্রোফাইল</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === 'backup'
                ? 'bg-amber-500 text-blue-950 shadow-lg'
                : 'text-gray-300 hover:bg-blue-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ডাটাবেজ ব্যাকআপ ও রিস্টোর</span>
          </button>
        </nav>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">বিক্রি ও অর্ডার ওভারভিউ</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500">মোট বিক্রয় (Revenue)</span>
                  <p className="text-2xl font-black text-blue-900 mt-1">৳{totalRevenue}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500">মোট অর্ডার সংখ্যা</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{totalOrdersCount}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500">পেন্ডিং অর্ডার (Pending)</span>
                  <p className="text-2xl font-black text-red-600 mt-1">{pendingOrdersCount}</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500">মোট খেলনা আইটেম</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{products.length}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Preview Table */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-900">সাম্প্রতিক অর্ডারসমূহ</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-blue-900 hover:underline"
                >
                  সবগুলো দেখুন
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                      <th className="p-3">অর্ডার আইডি</th>
                      <th className="p-3">কাস্টমারের নাম</th>
                      <th className="p-3">মোবাইল</th>
                      <th className="p-3">পেমেন্ট মেথড</th>
                      <th className="p-3">সর্বমোট মূল্য</th>
                      <th className="p-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80">
                        <td className="p-3 font-mono font-bold text-blue-900">{ord.id}</td>
                        <td className="p-3 font-medium">{ord.customerName}</td>
                        <td className="p-3">{ord.mobileNumber}</td>
                        <td className="p-3 uppercase font-bold text-[11px]">{ord.paymentMethod}</td>
                        <td className="p-3 font-black text-blue-900">৳{ord.totalAmount}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl md:text-2xl font-black text-gray-900">অর্ডার ম্যানেজমেন্ট</h1>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Pending', 'Confirmed', 'Packaging', 'Shipping', 'Delivered', 'Cancelled'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                        orderStatusFilter === status
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="অর্ডার আইডি, কাস্টমার নাম বা ফোন দিয়ে খুঁজুন..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none"
              />
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-blue-900 text-white font-bold">
                      <th className="p-3">আইডি</th>
                      <th className="p-3">কাস্টমার ও ঠিকানা</th>
                      <th className="p-3">পেমেন্ট ও TrxID</th>
                      <th className="p-3">মূল্য</th>
                      <th className="p-3">স্ট্যাটাস চেঞ্জ</th>
                      <th className="p-3 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-blue-900">{ord.id}</td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{ord.customerName}</strong>
                            <span className="text-[11px] text-gray-500 block">{ord.mobileNumber}</span>
                            <span className="text-[10px] text-gray-400 truncate block max-w-xs">
                              {ord.address}, {ord.thana}, {ord.district}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold uppercase text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                              {ord.paymentMethod}
                            </span>
                            {ord.transactionId && (
                              <span className="block text-[11px] font-mono text-pink-700 font-bold mt-1">
                                TrxID: {ord.transactionId} ({ord.senderNumber})
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-black text-blue-900">৳{ord.totalAmount}</td>
                          <td className="p-3">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="p-1.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-[11px] outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packaging">Packaging</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedOrderForModal(ord)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl"
                              title="বিস্তারিত ও ইনভয়েস"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-black text-gray-900">প্রডাক্ট ক্যাটালগ</h1>
              <button
                onClick={openNewProductModal}
                className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন খেলনা যোগ করুন</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-blue-900 text-white font-bold">
                      <th className="p-3">ছবি</th>
                      <th className="p-3">খেলনার নাম</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">মূল্য / অফার</th>
                      <th className="p-3">স্টক</th>
                      <th className="p-3 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {prod.titleBn || prod.title}
                          <span className="block text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                        </td>
                        <td className="p-3">{prod.categoryBn || prod.category}</td>
                        <td className="p-3">
                          <span className="font-bold text-blue-900">৳{prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-[10px] text-gray-400 line-through block">৳{prod.price}</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-emerald-700">{prod.stockCount} টি</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openShareModal(prod)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg flex items-center gap-1 font-bold text-[11px] border border-blue-200"
                              title="শেয়ার ও লিংক কপি করুন"
                            >
                              <Share2 className="w-3.5 h-3.5 text-blue-900" />
                              <span>শেয়ার</span>
                            </button>

                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200"
                              title="এডিট"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">কুপন ও প্রমোশনাল ছাড়</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Add Coupon Form */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 border-b pb-2">নতুন কুপন কোড তৈরি করুন</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newCouponCode) {
                      showNotification(`কুপন "${newCouponCode.toUpperCase()}" তৈরি হয়েছে!`);
                      setNewCouponCode('');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-bold mb-1">কুপন কোড (যেমন: RITAM100)</label>
                    <input
                      type="text"
                      placeholder="কুপন কোড"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold uppercase outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ডিসকাউন্ট পরিমাণ (৳)</label>
                    <input
                      type="number"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ন্যূনতম শপিং অর্ডার (৳)</label>
                    <input
                      type="number"
                      value={newCouponMinAmount}
                      onChange={(e) => setNewCouponMinAmount(Number(e.target.value))}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl shadow"
                  >
                    কুপন সেইভ করুন
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 border-b pb-2 mb-4">সক্রিয় কুপন কোডসমূহ</h3>
                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-black text-sm text-blue-900">{c.code}</span>
                        <p className="text-xs text-gray-500">
                          ছাড়: ৳{c.discountAmount} (মিনিমাম অর্ডার: ৳{c.minOrderAmount})
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">ক্যাটাগরি ও ব্র্যান্ড ম্যানেজমেন্ট</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
                <h3 className="font-bold text-sm text-gray-900 border-b pb-2">নতুন ক্যাটাগরি তৈরি করুন</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCatNameBn || !newCatSlug) {
                      showNotification('ক্যাটাগরির নাম ও স্ল্যাগ প্রয়োজন', 'error');
                      return;
                    }
                    await addNewCategory({
                      name: newCatName || newCatNameBn,
                      nameBn: newCatNameBn,
                      slug: newCatSlug.toLowerCase().trim().replace(/\s+/g, '-'),
                      icon: newCatIcon,
                    });
                    setNewCatName('');
                    setNewCatNameBn('');
                    setNewCatSlug('');
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block font-bold mb-1">ক্যাটাগরির নাম (বাংলা)</label>
                    <input
                      type="text"
                      placeholder="যেমন: স্মার্ট ট্রেন ও ট্র্যাক"
                      value={newCatNameBn}
                      onChange={(e) => setNewCatNameBn(e.target.value)}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ক্যাটাগরির নাম (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Smart Trains & Tracks"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ক্যাটাগরি স্ল্যাগ (URL ID)</label>
                    <input
                      type="text"
                      placeholder="e.g. smart-trains"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-mono text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">আইকন (Emoji/Text)</label>
                    <input
                      type="text"
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full p-3 bg-gray-50 border rounded-xl text-center text-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl shadow"
                  >
                    ক্যাটাগরি যুক্ত করুন
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 border-b pb-2 mb-4">বিদ্যমান ক্যাটাগরি তালিকা</h3>
                <div className="space-y-3">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.icon || '🧸'}</span>
                        <div>
                          <p className="font-black text-gray-900">{c.nameBn || c.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Slug: {c.slug}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900">কাস্টমার অ্যাকাউন্ট ম্যানেজমেন্ট</h1>
                <p className="text-xs text-gray-500 mt-1">
                  আপনার ওয়েবসাইটে নিবন্ধিত সকল কাস্টমারদের তালিকা ও তাদের অ্যাক্টিভিটি।
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-900 border border-blue-200 rounded-2xl font-black text-xs flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>মোট নিবন্ধিত গ্রাহক: {adminCustomers.length} জন</span>
              </div>
            </div>

            {loadingCustomers ? (
              <div className="py-12 text-center text-gray-500">কাস্টমার তালিকা লোড হচ্ছে...</div>
            ) : adminCustomers.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-500 space-y-2">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="font-bold">এখনও কোনো গ্রাহক অ্যাকাউন্ট খোলেননি।</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-4">গ্রাহকের নাম ও ছবি</th>
                        <th className="p-4">মোবাইল নম্বর</th>
                        <th className="p-4">ইমেইল</th>
                        <th className="p-4">নিবন্ধনের তারিখ</th>
                        <th className="p-4">সংরক্ষিত ঠিকানা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {adminCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={
                                c.avatarUrl ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`
                              }
                              alt={c.name}
                              className="w-9 h-9 rounded-full object-cover border border-amber-400 bg-gray-100"
                            />
                            <div>
                              <span className="font-bold text-gray-900 block">{c.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">ID: {c.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-blue-900">{c.phone}</td>
                          <td className="p-4 text-gray-600">{c.email || 'N/A'}</td>
                          <td className="p-4 text-gray-500">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('bn-BD') : 'N/A'}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full font-bold">
                              {c.addresses ? c.addresses.length : 0} টি
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">সাইট, পেমেন্ট ও SEO সেটিংস</h1>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm max-w-3xl space-y-6 text-xs font-medium text-gray-700">
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-900 border-b pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  অনলাইন পেমেন্ট নম্বর (bKash & Nagad)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">বিকাশ পেমেন্ট নম্বর:</label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-pink-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">নগদ পেমেন্ট নম্বর:</label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-orange-700"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-900 border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  ডেলিভারি চার্জ ও কন্টাক্ট ইনফো
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">ঢাকায় ডেলিভারি ফি (৳):</label>
                    <input
                      type="number"
                      value={settingsForm.insideDhakaFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, insideDhakaFee: Number(e.target.value) })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ঢাকার বাইরে ডেলিভারি ফি (৳):</label>
                    <input
                      type="number"
                      value={settingsForm.outsideDhakaFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaFee: Number(e.target.value) })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">হটলাইন ফোন নম্বর:</label>
                    <input
                      type="text"
                      value={settingsForm.hotlinePhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hotlinePhone: e.target.value })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">হোয়াটসঅ্যাপ নম্বর:</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-900 border-b pb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  SEO সেটিংস (Google Search Optimization)
                </h3>
                <div>
                  <label className="block font-bold mb-1">মেটা টাইটেল (Title Tag):</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">মেটা ডেসক্রিপশন (Description):</label>
                  <textarea
                    rows={2}
                    value={settingsForm.seoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* CLOUD DATABASE INTEGRATION CONFIGURATION */}
              <div className="space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-800" />
                  ক্লাউড ডাটাবেজ কনফিগারেশন (Supabase / Firebase / Production Cloud DB)
                </h3>
                <p className="text-[11px] text-gray-600">
                  Netlify বা যেকোনো হোস্টিং সার্ভারে ডাটা স্থায়ীভাবে সংরক্ষণ করতে আপনার Supabase/Firebase ক্রেডেনশিয়াল দিন। কোনো সোর্স কোড এডিট করার প্রয়োজন নেই।
                </p>

                <div>
                  <label className="block font-bold mb-1">ডাটাবেজ প্রোভাইডার সিলেক্ট করুন:</label>
                  <select
                    value={dbConfig.provider}
                    onChange={(e) => setDbConfig({ ...dbConfig, provider: e.target.value as any })}
                    className="w-full p-3 bg-white border rounded-xl font-bold text-blue-900"
                  >
                    <option value="supabase">Supabase (Recommended Cloud DB)</option>
                    <option value="firebase">Firebase Firestore</option>
                    <option value="custom_rest">Custom REST API Endpoint</option>
                    <option value="local">Local Persistent Auto-Sync Store</option>
                  </select>
                </div>

                {dbConfig.provider === 'supabase' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold mb-1">Supabase Project URL:</label>
                      <input
                        type="text"
                        placeholder="https://your-project.supabase.co"
                        value={dbConfig.supabaseUrl || ''}
                        onChange={(e) => setDbConfig({ ...dbConfig, supabaseUrl: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Supabase Anon Key:</label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={dbConfig.supabaseAnonKey || ''}
                        onChange={(e) => setDbConfig({ ...dbConfig, supabaseAnonKey: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {dbConfig.provider === 'firebase' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold mb-1">Firebase Project ID:</label>
                      <input
                        type="text"
                        placeholder="my-project-id"
                        value={dbConfig.firebaseProjectId || ''}
                        onChange={(e) => setDbConfig({ ...dbConfig, firebaseProjectId: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Firebase API Key:</label>
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={dbConfig.firebaseApiKey || ''}
                        onChange={(e) => setDbConfig({ ...dbConfig, firebaseApiKey: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {dbConfig.provider === 'custom_rest' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold mb-1">Custom API Endpoint URL:</label>
                      <input
                        type="text"
                        placeholder="https://api.yourdomain.com/v1"
                        value={dbConfig.customApiEndpoint || ''}
                        onChange={(e) => setDbConfig({ ...dbConfig, customApiEndpoint: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isTestingDb}
                    onClick={async () => {
                      setIsTestingDb(true);
                      const res = await testCloudDbConnection(dbConfig);
                      setIsTestingDb(false);
                      if (res.success) {
                        saveCloudDbConfig(dbConfig);
                        showNotification(res.message);
                      } else {
                        showNotification(res.message, 'error');
                      }
                    }}
                    className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isTestingDb ? 'কানেকশন টেস্ট হচ্ছে...' : 'কানেকশন টেস্ট ও সেইভ করুন'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={async () => {
                  saveCloudDbConfig(dbConfig);
                  await updateStoreSettings({
                    bkashNumber: settingsForm.bkashNumber,
                    nagadNumber: settingsForm.nagadNumber,
                    insideDhakaFee: settingsForm.insideDhakaFee,
                    outsideDhakaFee: settingsForm.outsideDhakaFee,
                    hotlinePhone: settingsForm.hotlinePhone,
                    whatsappNumber: settingsForm.whatsappNumber,
                    storeMotto: settingsForm.storeMotto,
                  });
                  showNotification('সাইট, পেমেন্ট ও ক্লাউড ডাটাবেজ সেটিংস সফলভাবে আপডেট হয়েছে!');
                }}
                className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow text-xs"
              >
                সেটিংস সেইভ করুন
              </button>
            </div>
          </div>
        )}

        {/* TAB: ADMIN PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">এডমিন প্রোফাইল ও সিকিউরিটি সেটিংস</h1>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm max-w-xl space-y-4 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-4 pb-4 border-b">
                <img
                  src={adminAvatar}
                  alt="Admin Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{adminUsername}</h3>
                  <p className="text-gray-500">Chief Executive Admin</p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/admin/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        username: adminUsername,
                        password: adminPassword,
                        email: adminEmail,
                        phone: adminPhone,
                        avatarUrl: adminAvatar,
                      }),
                    });
                    if (res.ok) {
                      showNotification('এডমিন প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!');
                    }
                  } catch {
                    showNotification('প্রোফাইল আপডেট করতে সমস্যা হয়েছে', 'error');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-bold mb-1">ইউজারনেম (Username):</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">নতুন পাসওয়ার্ড (Password):</label>
                  <input
                    type="text"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-blue-900"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">পাসওয়ার্ড পরিবর্তন করলে তা ডাটাবেজে স্থায়ীভাবে সংরক্ষিত থাকবে</p>
                </div>

                <div>
                  <label className="block font-bold mb-1">ইমেইল ঠিকানা (Email):</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">ফোন নম্বর (Phone):</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">প্রোফাইল ছবি লিঙ্ক (Avatar URL):</label>
                  <input
                    type="text"
                    value={adminAvatar}
                    onChange={(e) => setAdminAvatar(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow"
                >
                  প্রোফাইল আপডেট করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: DATABASE BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-black text-gray-900">ডাটাবেজ ব্যাকআপ ও রিস্টোর (Backup & Restore)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {/* Backup Download Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-gray-900">ডাটাবেজ ডাউনলোড করুন (Backup JSON)</h3>
                <p className="text-gray-500 leading-relaxed">
                  ওয়েবসাইটের সমস্ত প্রডাক্ট, ক্যাটাগরি, অর্ডার ও সেটিংস এক ক্লিকে আপনার কম্পিউটারে ব্যাকআপ হিসেবে ডাউনলোড করে সংরক্ষণ করুন।
                </p>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/admin/backup');
                      const data = await res.json();
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ritam_world_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      showNotification('ডাটাবেজ ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!');
                    } catch {
                      showNotification('ডাউনলোড করতে সমস্যা হয়েছে', 'error');
                    }
                  }}
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  ব্যাকআপ ফাইল ডাউনলোড করুন
                </button>
              </div>

              {/* Restore / Reset Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-gray-900">ডাটাবেজ রিস্টোর বা রি-সেট করুন</h3>
                <p className="text-gray-500 leading-relaxed">
                  আপনার পূর্বে ডাউনলোড করা ব্যাকআপ JSON ফাইল সিলেক্ট করে সমস্ত ডাটা পুনারুদ্ধার করুন অথবা অরিজিনাল স্যাম্পল ডাটাতে রি-সেট করুন।
                </p>

                <div className="space-y-2 pt-2">
                  <label className="block font-bold">JSON ফাইল সিলেক্ট করুন:</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (evt) => {
                        try {
                          const backupData = JSON.parse(evt.target?.result as string);
                          const res = await fetch('/api/admin/restore', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ backupData }),
                          });
                          if (res.ok) {
                            fetchAdminData();
                            showNotification('ডাটাবেজ সফলভাবে রিস্টোর করা হয়েছে!');
                          }
                        } catch {
                          showNotification('ভুল ব্যাকআপ ফাইল', 'error');
                        }
                      };
                      reader.readAsText(file);
                    }}
                    className="w-full p-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={async () => {
                      if (window.confirm('আপনি কি নিশ্চিত যে ডাটাবেজ প্রাথমিক অবস্থায় রি-সেট করতে চান?')) {
                        const res = await fetch('/api/admin/restore', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ resetToDefault: true }),
                        });
                        if (res.ok) {
                          fetchAdminData();
                          showNotification('ডাটাবেজ অরিজিনাল অবস্থায় রি-সেট করা হয়েছে!');
                        }
                      }
                    }}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    ডাটাবেজ ফ্যাক্টরি রি-সেট করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-gray-900">
                {editingProduct ? 'খেলনা আপডেট করুন' : 'নতুন খেলনা যুক্ত করুন'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">খেলনার নাম (English)</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">খেলনার নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={productForm.titleBn}
                    onChange={(e) => setProductForm({ ...productForm, titleBn: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">নিয়মিত মূল্যে (৳)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">ডিসকাউন্ট অফার মূল্য (৳)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">স্টক সংখ্যা</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">ছবি লিঙ্ক (Image URLs - কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium"
                  placeholder="https://...1.jpg, https://...2.jpg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={productForm.descriptionBn}
                  onChange={(e) => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl shadow"
              >
                সেইভ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-gray-900">
                অর্ডার ইনভয়েস: {selectedOrderForModal.id}
              </h3>
              <button onClick={() => setSelectedOrderForModal(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl">
              <p><strong>কাস্টমার:</strong> {selectedOrderForModal.customerName}</p>
              <p><strong>মোবাইল:</strong> {selectedOrderForModal.mobileNumber}</p>
              <p><strong>ঠিকানা:</strong> {selectedOrderForModal.address}, {selectedOrderForModal.thana}, {selectedOrderForModal.district}</p>
              <p><strong>পেমেন্ট মেথড:</strong> {selectedOrderForModal.paymentMethod}</p>
              {selectedOrderForModal.transactionId && (
                <p className="text-pink-700 font-bold font-mono">TrxID: {selectedOrderForModal.transactionId}</p>
              )}
            </div>

            <div className="border-t pt-2 space-y-1">
              <p className="font-bold">আইটেমসমূহ:</p>
              {selectedOrderForModal.items.map((it, i) => (
                <div key={i} className="flex justify-between text-gray-700">
                  <span>{it.productTitle} (x{it.quantity})</span>
                  <span className="font-bold">৳{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 flex justify-between font-black text-sm text-blue-900">
              <span>সর্বমোট:</span>
              <span>৳{selectedOrderForModal.totalAmount}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
