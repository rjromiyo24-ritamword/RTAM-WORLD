import { pgTable, text, integer, boolean, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleBn: text('title_bn'),
  price: numeric('price').notNull(),
  discountPrice: numeric('discount_price'),
  inStock: boolean('in_stock').default(true).notNull(),
  stockCount: integer('stock_count').default(0).notNull(),
  sku: text('sku'),
  category: text('category').notNull(),
  categoryBn: text('category_bn'),
  brand: text('brand'),
  ageRecommendation: text('age_recommendation'),
  description: text('description'),
  specifications: jsonb('specifications').$type<Record<string, string>>().default({}),
  features: jsonb('features').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  videoUrl: text('video_url'),
  rating: numeric('rating').default('5.0'),
  reviewCount: integer('review_count').default(0),
  isFeatured: boolean('is_featured').default(false),
  isNewArrival: boolean('is_new_arrival').default(false),
  isBestSeller: boolean('is_best_seller').default(false),
  isFlashSale: boolean('is_flash_sale').default(false),
  flashSaleEnds: text('flash_sale_ends'),
  deliveryTimeDays: text('delivery_time_days'),
  warrantyPeriod: text('warranty_period'),
  reviews: jsonb('reviews').$type<any[]>().default([]),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
  slug: text('slug').notNull(),
  icon: text('icon'),
  image: text('image'),
  itemCount: integer('item_count').default(0),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerId: text('customer_id'),
  customerName: text('customer_name').notNull(),
  mobileNumber: text('mobile_number').notNull(),
  email: text('email'),
  altMobileNumber: text('alt_mobile_number'),
  address: text('address').notNull(),
  division: text('division').notNull(),
  district: text('district').notNull(),
  thana: text('thana').notNull(),
  postalCode: text('postal_code'),
  deliveryNotes: text('delivery_notes'),
  paymentMethod: text('payment_method').notNull(),
  senderNumber: text('sender_number'),
  transactionId: text('transaction_id'),
  paymentScreenshot: text('payment_screenshot'),
  items: jsonb('items').$type<any[]>().notNull(),
  subtotal: numeric('subtotal').notNull(),
  deliveryCharge: numeric('delivery_charge').notNull(),
  discount: numeric('discount').notNull(),
  totalAmount: numeric('total_amount').notNull(),
  couponCode: text('coupon_code'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  addresses: jsonb('addresses').$type<any[]>().default([]),
  wishlist: jsonb('wishlist').$type<string[]>().default([]),
  createdAt: text('created_at').notNull(),
});

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  discountType: text('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  minSpend: numeric('min_spend').notNull(),
  expiryDate: text('expiry_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const settings = pgTable('settings', {
  id: integer('id').primaryKey(),
  data: jsonb('data').$type<any>().notNull(),
});

export const adminCredentials = pgTable('admin_credentials', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
});
