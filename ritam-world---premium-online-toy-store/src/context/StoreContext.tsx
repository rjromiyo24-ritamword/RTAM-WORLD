import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, StoreSettings, Coupon, PaymentMethod, CustomerUser, CustomerAddress } from '../types';
import { getProductPermalink, updateProductMetaTags } from '../utils/shareUtils';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  compareList: string[];
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  activePage: string;
  selectedProductId: string | null;
  policyType: 'privacy' | 'terms' | 'refund' | 'shipping';
  activeOrder: Order | null;
  adminToken: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedAge: string;
  priceRange: [number, number];
  sortBy: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAccountDrawerOpen: boolean;
  setIsAccountDrawerOpen: (open: boolean) => void;
  customerUser: CustomerUser | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Product Sharing
  shareProductModal: Product | null;
  openShareModal: (product: Product) => void;
  closeShareModal: () => void;
  
  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setSelectedAge: (a: string) => void;
  setPriceRange: (r: [number, number]) => void;
  setSortBy: (s: string) => void;
  
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  openProductDetails: (productId: string) => void;
  navigateTo: (page: string, params?: { productId?: string; policyType?: 'privacy' | 'terms' | 'refund' | 'shipping'; category?: string; searchQuery?: string }) => void;
  
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order | null>;
  trackOrderLookup: (orderId: string, phone: string) => Promise<Order | null>;
  
  // Customer Auth
  loginCustomer: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerCustomer: (data: { name: string; phone: string; email?: string; password: string }) => Promise<{ success: boolean; message: string }>;
  resetCustomerPassword: (data: { phone: string; newPassword: string }) => Promise<{ success: boolean; message: string }>;
  logoutCustomer: () => void;
  updateCustomerProfile: (data: { name?: string; email?: string; phone?: string; avatarUrl?: string }) => Promise<boolean>;
  updateCustomerAddresses: (addresses: CustomerAddress[]) => Promise<boolean>;
  
  isAdminLoggedIn: boolean;
  orders: Order[];
  coupons: Coupon[];
  adminLogin: (u: string, p?: string) => Promise<boolean>;
  adminLogout: () => void;
  updateOrderStatus: (orderId: string, status: any) => Promise<boolean>;
  addNewProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  addNewCategory: (catData: Partial<Category>) => Promise<boolean>;
  deleteCategory: (catId: string) => Promise<boolean>;
  fetchAdminData: () => Promise<void>;
  refreshStoreData: () => Promise<void>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  
  // Totals
  cartSubtotal: number;
  cartTotalCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Ritam World',
    storeMotto: 'গ্রাহকের বিশ্বাসই আমাদের সবচেয়ে বড় সম্পদ',
    hotlinePhone: '01700112233',
    whatsappNumber: '8801700112233',
    messengerLink: 'https://m.me/ritamworldbd',
    storeEmail: 'support@ritamworld.com',
    storeAddress: 'যমুনা ফিউচার পার্ক, প্রগতি স্বরনি, ঢাকা-১২২৯',
    insideDhakaFee: 60,
    outsideDhakaFee: 120,
    freeShippingOnlinePayment: true,
    bkashNumber: '01711223344',
    bkashAccountType: 'Personal / Agent',
    bkashInstructions: 'আপনার বিকাশ অ্যাপ থেকে Send Money করুন এবং TrxID প্রদান করুন। অনলাইন পেমেন্টে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
    nagadNumber: '01822334455',
    nagadAccountType: 'Personal',
    nagadInstructions: 'আপনার নগদ অ্যাপ থেকে Send Money করুন এবং TrxID প্রদান করুন। অনলাইন পেমেন্টে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
    noticeBarText: '🎉 অনলাইন পেমেন্ট (bKash/Nagad) করলে সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
    heroBanners: [],
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rw_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'refund' | 'shipping'>('privacy');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('rw_admin_token'));
  const isAdminLoggedIn = Boolean(adminToken);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rw_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rw_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showNotification('তুলনা তালিকা থেকে সরানো হয়েছে', 'info');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showNotification('সর্বোচ্চ ৪টি খেলনা একসঙ্গে তুলনা করা যায়', 'error');
        return prev;
      }
      showNotification('তুলনা তালিকায় যোগ করা হয়েছে!');
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareList([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('rw_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('rw_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('rw_customer');
    }
  }, [customerUser]);

  const loginCustomer = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCustomerUser(data.user);
        showNotification(data.message || 'লগইন সফল হয়েছে!');
        setIsAccountDrawerOpen(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'লগইন ব্যর্থ হয়েছে' };
    } catch {
      return { success: false, message: 'নেটওয়ার্ক ত্রুটি, পরে চেষ্টা করুন' };
    }
  };

  const registerCustomer = async (formData: { name: string; phone: string; email?: string; password: string }) => {
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCustomerUser(data.user);
        showNotification(data.message || 'একাউন্ট তৈরি হয়েছে!');
        setIsAccountDrawerOpen(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'নিবন্ধন ব্যর্থ হয়েছে' };
    } catch {
      return { success: false, message: 'নেটওয়ার্ক ত্রুটি, পরে চেষ্টা করুন' };
    }
  };

  const resetCustomerPassword = async (data: { phone: string; newPassword: string }) => {
    try {
      const res = await fetch('/api/customer/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        showNotification(result.message);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message };
    } catch {
      return { success: false, message: 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে' };
    }
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    localStorage.removeItem('rw_customer');
    showNotification('আপনি একাউন্ট থেকে সফলভাবে লগআউট হয়েছেন', 'info');
  };

  const updateCustomerProfile = async (data: { name?: string; email?: string; phone?: string; avatarUrl?: string }) => {
    if (!customerUser) return false;
    try {
      const res = await fetch(`/api/customer/profile/${customerUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setCustomerUser(resData.user);
        showNotification('প্রোফাইল আপডেট হয়েছে!');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateCustomerAddresses = async (addresses: CustomerAddress[]) => {
    if (!customerUser) return false;
    try {
      const res = await fetch(`/api/customer/addresses/${customerUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses }),
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setCustomerUser(resData.user);
        showNotification('ঠিকানা সংরক্ষণ করা হয়েছে');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Save cart & wishlist
  useEffect(() => {
    localStorage.setItem('rw_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch store data
  const refreshStoreData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (setRes.ok) {
        const setStat = await setRes.json();
        setSettings(setStat);
      }
    } catch (err) {
      console.error('Error fetching initial store data:', err);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Cart logic
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`"${product.titleBn || product.title}" কার্টে যোগ করা হয়েছে!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('কার্ট থেকে পণ্যটি সরানো হয়েছে', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('উইশলিস্ট থেকে সরানো হয়েছে', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('উইশলিস্টে যুক্ত করা হয়েছে!');
        return [...prev, productId];
      }
    });
  };

  const navigateTo = (
    page: string,
    params?: { productId?: string; policyType?: 'privacy' | 'terms' | 'refund' | 'shipping'; category?: string; searchQuery?: string }
  ) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.policyType) {
      setPolicyType(params.policyType);
    }
    if (params?.category) {
      setSelectedCategory(params.category);
    }
    if (params?.searchQuery !== undefined) {
      setSearchQuery(params.searchQuery);
    }
  };

  const [shareProductModal, setShareProductModal] = useState<Product | null>(null);

  const openShareModal = (product: Product) => setShareProductModal(product);
  const closeShareModal = () => setShareProductModal(null);

  // Deep Link Parser (Detect #product=ID or #p=ID or ?product=ID)
  useEffect(() => {
    const checkDeepLink = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      let targetProductId: string | null = null;

      if (hash) {
        const match = hash.match(/#(?:product|p)=([^&]+)/i);
        if (match && match[1]) {
          targetProductId = decodeURIComponent(match[1]);
        }
      }

      if (!targetProductId && search) {
        const params = new URLSearchParams(search);
        targetProductId = params.get('product') || params.get('p');
      }

      if (targetProductId && products.length > 0) {
        const found = products.find(
          (p) => p.id === targetProductId || p.sku.toLowerCase() === targetProductId?.toLowerCase()
        );
        if (found) {
          setSelectedProductId(found.id);
          setActivePage('product-details');
          updateProductMetaTags(found, settings.storeName);
        }
      }
    };

    checkDeepLink();
    window.addEventListener('hashchange', checkDeepLink);
    window.addEventListener('popstate', checkDeepLink);

    return () => {
      window.removeEventListener('hashchange', checkDeepLink);
      window.removeEventListener('popstate', checkDeepLink);
    };
  }, [products, settings.storeName]);

  const openProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 10));

    const found = products.find((p) => p.id === productId);
    if (found) {
      updateProductMetaTags(found, settings.storeName);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', getProductPermalink(productId));
      }
    }
  };

  const addNewCategory = async (catData: Partial<Category>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data.category]);
        showNotification('নতুন ক্যাটাগরি সফলভাবে যোগ হয়েছে!');
        return true;
      }
      return false;
    } catch {
      showNotification('ক্যাটাগরি যোগ করতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  const deleteCategory = async (catId: string) => {
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== catId && c.slug !== catId));
        showNotification('ক্যাটাগরি মুছে ফেলা হয়েছে', 'info');
        return true;
      }
      return false;
    } catch {
      showNotification('ক্যাটাগরি মুছতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveOrder(data.order);
        clearCart();
        navigateTo('order-success');
        showNotification(`অভিনন্দন! আপনার অর্ডার #${data.order.id} সফলভাবে সম্পন্ন হয়েছে।`);
        return data.order;
      } else {
        showNotification('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
        return null;
      }
    } catch (err) {
      showNotification('সার্ভার কানেকশন ত্রুটি।', 'error');
      return null;
    }
  };

  const trackOrderLookup = async (orderId: string, phone: string) => {
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        return data.order;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const fetchAdminData = async () => {
    try {
      const [ordRes, cpnRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/coupons'),
      ]);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }
      if (cpnRes.ok) {
        const cpnData = await cpnRes.json();
        setCoupons(cpnData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  const adminLogin = async (u: string, p?: string) => {
    const username = p !== undefined ? u : 'admin';
    const password = p !== undefined ? p : u;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        localStorage.setItem('rw_admin_token', data.token);
        fetchAdminData();
        showNotification('এডমিন প্যানেলে স্বাগতম!');
        return true;
      } else {
        const data = await res.json();
        showNotification(data.message || 'ইউজারনেম বা পাসওয়ার্ড ভুল', 'error');
        return false;
      }
    } catch (err) {
      showNotification('লগইন ব্যর্থ হয়েছে', 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: any) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        showNotification(`অর্ডার #${orderId} এর স্ট্যাটাস ${status} এ পরিবর্তন করা হয়েছে`);
        return true;
      }
      return false;
    } catch {
      showNotification('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে', 'error');
      return false;
    }
  };

  const addNewProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        showNotification('নতুন পণ্য সফলভাবে যোগ করা হয়েছে!');
        return data.product;
      }
      return null;
    } catch {
      showNotification('পণ্য যোগ করতে সমস্যা হয়েছে', 'error');
      return null;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
        showNotification('পণ্য আপডেট করা হয়েছে');
        return data.product;
      }
      return null;
    } catch {
      showNotification('পণ্য আপডেট করতে সমস্যা হয়েছে', 'error');
      return null;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showNotification('পণ্যটি মুছে ফেলা হয়েছে', 'info');
        return true;
      }
      return false;
    } catch {
      showNotification('পণ্য মুছতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('rw_admin_token');
    navigateTo('admin-login');
    showNotification('এডমিন প্যানেল থেকে লগআউট করা হয়েছে', 'info');
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showNotification('ওয়েবসাইট সেটিং সফলভাবে আপডেট করা হয়েছে');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        recentlyViewed,
        compareList,
        isCompareOpen,
        setIsCompareOpen,
        toggleCompare,
        clearCompare,
        activePage,
        selectedProductId,
        policyType,
        activeOrder,
        adminToken,
        isAdminLoggedIn,
        orders,
        coupons,
        searchQuery,
        selectedCategory,
        selectedAge,
        priceRange,
        sortBy,
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAccountDrawerOpen,
        setIsAccountDrawerOpen,
        customerUser,
        notification,

        shareProductModal,
        openShareModal,
        closeShareModal,

        setSearchQuery,
        setSelectedCategory,
        setSelectedAge,
        setPriceRange,
        setSortBy,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        openProductDetails,
        navigateTo,

        placeOrder,
        trackOrderLookup,
        loginCustomer,
        registerCustomer,
        resetCustomerPassword,
        logoutCustomer,
        updateCustomerProfile,
        updateCustomerAddresses,
        adminLogin,
        adminLogout,
        updateOrderStatus,
        addNewProduct,
        updateProduct,
        deleteProduct,
        addNewCategory,
        deleteCategory,
        fetchAdminData,
        refreshStoreData,
        updateStoreSettings,
        showNotification,

        cartSubtotal,
        cartTotalCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
