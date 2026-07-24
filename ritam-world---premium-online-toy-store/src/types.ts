export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packaging'
  | 'Shipping'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
}

export interface Product {
  id: string;
  title: string;
  titleBn?: string;
  price: number;
  discountPrice?: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  category: string;
  categoryBn?: string;
  brand: string;
  ageRecommendation: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleEnds?: string;
  deliveryTimeDays?: string;
  warrantyPeriod?: string;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  image?: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  division: string;
  district: string;
  thana: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  addresses: CustomerAddress[];
  wishlist: string[];
  createdAt: string;
  token?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface WebsiteBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLink?: string;
  position: 'hero' | 'middle' | 'sidebar' | 'footer';
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  mobileNumber: string;
  email?: string;
  altMobileNumber?: string;
  address: string;
  division: string;
  district: string;
  thana: string;
  postalCode?: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  senderNumber?: string;
  transactionId?: string;
  paymentScreenshot?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeMotto: string;
  hotlinePhone: string;
  whatsappNumber: string;
  messengerLink: string;
  storeEmail: string;
  storeAddress: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingOnlinePayment: boolean;
  bkashNumber: string;
  bkashAccountType: string;
  bkashInstructions: string;
  nagadNumber: string;
  nagadAccountType: string;
  nagadInstructions: string;
  noticeBarText: string;
  heroBanners: { id: string; title: string; subtitle: string; imageUrl: string; ctaLink: string }[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  customPages?: CustomPage[];
}

export interface AdminUser {
  username: string;
  token?: string;
}
