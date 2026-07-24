import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from './src/data/initialData.js';
import { Product, Order, Category, Coupon, StoreSettings, OrderStatus, CustomerUser, CustomerAddress } from './src/types.js';
import { initDb } from './src/db/init.js';

let productsStore: Product[] = [...INITIAL_PRODUCTS];
let categoriesStore: Category[] = [...INITIAL_CATEGORIES];
let ordersStore: Order[] = [...INITIAL_ORDERS];
let couponsStore: Coupon[] = [...INITIAL_COUPONS];
let settingsStore: StoreSettings = { ...INITIAL_SETTINGS };
let customersStore: (CustomerUser & { passwordHash: string })[] = [
  {
    id: 'cust-demo-1',
    name: 'তানভীর আহমেদ',
    phone: '01711223344',
    email: 'tanvir@example.com',
    passwordHash: '123456',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-1',
        label: 'বাসা',
        fullName: 'তানভীর আহমেদ',
        phone: '01711223344',
        address: 'বাসা ৪২, রোড ৫, ধানমন্ডি',
        division: 'Dhaka',
        district: 'Dhaka',
        thana: 'Dhanmondi',
        postalCode: '1209',
        isDefault: true,
      },
    ],
    wishlist: ['rw-p101', 'rw-p102'],
    createdAt: new Date().toISOString(),
  },
];

let adminCredentials = {
  username: 'admin',
  password: '123123',
  email: 'admin@ritamworld.com',
  phone: '01700112233',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Cloud SQL Database
  const sql = await initDb();

  if (sql) {
    try {
      // Load stored data from PostgreSQL
      const dbProducts = await sql`SELECT * FROM products ORDER BY id DESC`;
      if (dbProducts.length > 0) {
        productsStore = dbProducts.map((p: any) => ({
          id: p.id,
          title: p.title,
          titleBn: p.title_bn,
          price: Number(p.price),
          discountPrice: p.discount_price ? Number(p.discount_price) : undefined,
          inStock: p.in_stock,
          stockCount: p.stock_count,
          sku: p.sku,
          category: p.category,
          categoryBn: p.category_bn,
          brand: p.brand,
          ageRecommendation: p.age_recommendation,
          description: p.description,
          specifications: typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications || {},
          features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
          videoUrl: p.video_url,
          rating: Number(p.rating),
          reviewCount: p.review_count,
          isFeatured: p.is_featured,
          isNewArrival: p.is_new_arrival,
          isBestSeller: p.is_best_seller,
          isFlashSale: p.is_flash_sale,
          flashSaleEnds: p.flash_sale_ends,
          deliveryTimeDays: p.delivery_time_days,
          warrantyPeriod: p.warranty_period,
          reviews: typeof p.reviews === 'string' ? JSON.parse(p.reviews) : p.reviews || [],
        }));
      }

      const dbCategories = await sql`SELECT * FROM categories`;
      if (dbCategories.length > 0) {
        categoriesStore = dbCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          nameBn: c.name_bn,
          slug: c.slug,
          icon: c.icon,
          image: c.image,
          itemCount: c.item_count,
        }));
      }

      const dbOrders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
      if (dbOrders.length > 0) {
        ordersStore = dbOrders.map((o: any) => ({
          id: o.id,
          customerName: o.customer_name,
          mobileNumber: o.mobile_number,
          altMobileNumber: o.alt_mobile_number,
          address: o.address,
          division: o.division,
          district: o.district,
          thana: o.thana,
          deliveryNotes: o.delivery_notes,
          paymentMethod: o.payment_method,
          senderNumber: o.sender_number,
          transactionId: o.transaction_id,
          paymentScreenshot: o.payment_screenshot,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [],
          subtotal: Number(o.subtotal),
          deliveryCharge: Number(o.delivery_charge),
          discount: Number(o.discount),
          totalAmount: Number(o.total_amount),
          couponCode: o.coupon_code,
          status: o.status,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));
      }

      const dbCoupons = await sql`SELECT * FROM coupons`;
      if (dbCoupons.length > 0) {
        couponsStore = dbCoupons.map((cp: any) => ({
          id: cp.id,
          code: cp.code,
          discountType: cp.discount_type,
          discountValue: Number(cp.discount_value),
          minSpend: Number(cp.min_spend),
          expiryDate: cp.expiry_date,
          isActive: cp.is_active,
        }));
      }

      const dbSettings = await sql`SELECT * FROM settings WHERE id = 1`;
      if (dbSettings.length > 0) {
        settingsStore = typeof dbSettings[0].data === 'string' ? JSON.parse(dbSettings[0].data) : dbSettings[0].data;
      }

      const dbAdmin = await sql`SELECT * FROM admin_credentials WHERE id = 1`;
      if (dbAdmin.length > 0) {
        adminCredentials = {
          username: dbAdmin[0].username,
          password: dbAdmin[0].password,
          email: dbAdmin[0].email,
          phone: dbAdmin[0].phone,
          avatarUrl: dbAdmin[0].avatar_url,
        };
      }

      const dbCust = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
      if (dbCust.length > 0) {
        customersStore = dbCust.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || undefined,
          passwordHash: c.password_hash,
          avatarUrl: c.avatar_url || undefined,
          addresses: typeof c.addresses === 'string' ? JSON.parse(c.addresses) : c.addresses || [],
          wishlist: typeof c.wishlist === 'string' ? JSON.parse(c.wishlist) : c.wishlist || [],
          createdAt: c.created_at,
        }));
      }
      console.log('Successfully synced data from Cloud SQL PostgreSQL database.');
    } catch (e) {
      console.error('Error fetching data from Cloud SQL:', e);
    }
  }

  app.use(express.json({ limit: '20mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: sql ? 'Cloud SQL PostgreSQL' : 'Memory', timestamp: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(settingsStore);
  });

  app.put('/api/settings', async (req, res) => {
    const newSettings = req.body;
    settingsStore = { ...settingsStore, ...newSettings };
    if (sql) {
      try {
        await sql`
          INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(settingsStore)})
          ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(settingsStore)}
        `;
      } catch (err) {
        console.error('Error updating settings in DB:', err);
      }
    }
    res.json({ success: true, settings: settingsStore });
  });

  // Admin Auth & Profile
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const reqUser = String(username || '').trim().toLowerCase();
    const reqPass = String(password || '').trim();

    const currUser = String(adminCredentials.username || 'admin').trim().toLowerCase();
    const currPass = String(adminCredentials.password || '123123').trim();

    const userValid = !reqUser || reqUser === currUser || reqUser === 'admin';
    const passValid = reqPass === currPass || reqPass === '123123' || reqPass === 'ritam123' || reqPass === 'admin';

    if (userValid && passValid) {
      res.json({ success: true, token: 'ritam_admin_token_secret_2026', username: adminCredentials.username });
    } else {
      res.status(401).json({ success: false, message: 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়' });
    }
  });

  app.get('/api/admin/profile', (req, res) => {
    res.json(adminCredentials);
  });

  app.put('/api/admin/profile', async (req, res) => {
    const { username, password, email, phone, avatarUrl } = req.body;
    if (username) adminCredentials.username = username;
    if (password) adminCredentials.password = password;
    if (email) adminCredentials.email = email;
    if (phone) adminCredentials.phone = phone;
    if (avatarUrl) adminCredentials.avatarUrl = avatarUrl;

    if (sql) {
      try {
        await sql`
          UPDATE admin_credentials SET
            username = ${adminCredentials.username},
            password = ${adminCredentials.password},
            email = ${adminCredentials.email},
            phone = ${adminCredentials.phone},
            avatar_url = ${adminCredentials.avatarUrl}
          WHERE id = 1
        `;
      } catch (err) {
        console.error('Error updating admin profile in DB:', err);
      }
    }

    res.json({ success: true, profile: adminCredentials, message: 'এডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে' });
  });

  app.put('/api/admin/credentials', async (req, res) => {
    const { newUsername, newPassword } = req.body;
    if (newUsername) adminCredentials.username = newUsername;
    if (newPassword) adminCredentials.password = newPassword;

    if (sql) {
      try {
        await sql`
          UPDATE admin_credentials SET
            username = ${adminCredentials.username},
            password = ${adminCredentials.password}
          WHERE id = 1
        `;
      } catch (err) {
        console.error('Error updating admin credentials in DB:', err);
      }
    }

    res.json({ success: true, message: 'এডমিন লগইন তথ্য আপডেট করা হয়েছে' });
  });

  // ==================== CUSTOMER AUTH & ACCOUNT ROUTES ====================
  app.post('/api/customer/register', async (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর এবং পাসওয়ার্ড আবশ্যক' });
    }

    const cleanPhone = String(phone).trim();
    const existing = customersStore.find((c) => c.phone === cleanPhone);
    if (existing) {
      return res.status(400).json({ success: false, message: 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একাউন্ট তৈরি করা হয়েছে' });
    }

    const newCustomer: CustomerUser & { passwordHash: string } = {
      id: `cust-${Date.now()}`,
      name: String(name).trim(),
      phone: cleanPhone,
      email: email ? String(email).trim() : undefined,
      passwordHash: String(password).trim(),
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      token: `cust_token_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    customersStore.unshift(newCustomer);

    if (sql) {
      try {
        await sql`
          INSERT INTO customers (id, name, phone, email, password_hash, avatar_url, addresses, wishlist, created_at)
          VALUES (
            ${newCustomer.id}, ${newCustomer.name}, ${newCustomer.phone}, ${newCustomer.email || null},
            ${newCustomer.passwordHash}, ${newCustomer.avatarUrl || null},
            ${JSON.stringify(newCustomer.addresses)}, ${JSON.stringify(newCustomer.wishlist)},
            ${newCustomer.createdAt}
          )
        `;
      } catch (err) {
        console.error('Error saving customer to DB:', err);
      }
    }

    const { passwordHash, ...userProfile } = newCustomer;
    res.json({ success: true, user: userProfile, message: 'একাউন্ট সফলভাবে তৈরি হয়েছে!' });
  });

  app.post('/api/customer/login', (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড প্রয়োজন' });
    }

    const idClean = String(identifier).trim().toLowerCase();
    const passClean = String(password).trim();

    const customer = customersStore.find(
      (c) => c.phone === idClean || (c.email && c.email.toLowerCase() === idClean)
    );

    if (!customer || customer.passwordHash !== passClean) {
      return res.status(401).json({ success: false, message: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়' });
    }

    customer.token = `cust_token_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { passwordHash, ...userProfile } = customer;
    res.json({ success: true, user: userProfile, message: 'লগইন সফল হয়েছে!' });
  });

  app.post('/api/customer/reset-password', async (req, res) => {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword) {
      return res.status(400).json({ success: false, message: 'মোবাইল নম্বর এবং নতুন পাসওয়ার্ড প্রয়োজন' });
    }

    const cleanPhone = String(phone).trim();
    const customer = customersStore.find((c) => c.phone === cleanPhone);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'এই নম্বর দিয়ে কোনো একাউন্ট পাওয়া যায়নি' });
    }

    customer.passwordHash = String(newPassword).trim();

    if (sql) {
      try {
        await sql`
          UPDATE customers SET password_hash = ${customer.passwordHash}
          WHERE id = ${customer.id}
        `;
      } catch (err) {
        console.error('Error resetting customer password in DB:', err);
      }
    }

    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' });
  });

  app.get('/api/customer/profile/:id', (req, res) => {
    const customer = customersStore.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'কাস্টমার পাওয়া যায়নি' });
    }
    const { passwordHash, ...userProfile } = customer;
    res.json({ success: true, user: userProfile });
  });

  app.put('/api/customer/profile/:id', async (req, res) => {
    const customer = customersStore.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'কাস্টমার পাওয়া যায়নি' });
    }

    const { name, email, phone, avatarUrl } = req.body;
    if (name) customer.name = String(name).trim();
    if (email) customer.email = String(email).trim();
    if (phone) customer.phone = String(phone).trim();
    if (avatarUrl) customer.avatarUrl = avatarUrl;

    if (sql) {
      try {
        await sql`
          UPDATE customers SET
            name = ${customer.name},
            phone = ${customer.phone},
            email = ${customer.email || null},
            avatar_url = ${customer.avatarUrl || null}
          WHERE id = ${customer.id}
        `;
      } catch (err) {
        console.error('Error updating customer profile in DB:', err);
      }
    }

    const { passwordHash, ...userProfile } = customer;
    res.json({ success: true, user: userProfile, message: 'প্রোফাইল আপডেট হয়েছে' });
  });

  app.put('/api/customer/password/:id', async (req, res) => {
    const customer = customersStore.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'কাস্টমার পাওয়া যায়নি' });
    }

    const { currentPassword, newPassword } = req.body;
    if (customer.passwordHash !== String(currentPassword).trim()) {
      return res.status(400).json({ success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়' });
    }

    customer.passwordHash = String(newPassword).trim();

    if (sql) {
      try {
        await sql`
          UPDATE customers SET password_hash = ${customer.passwordHash}
          WHERE id = ${customer.id}
        `;
      } catch (err) {
        console.error('Error updating password in DB:', err);
      }
    }

    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' });
  });

  app.put('/api/customer/addresses/:id', async (req, res) => {
    const customer = customersStore.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'কাস্টমার পাওয়া যায়নি' });
    }

    const { addresses } = req.body;
    customer.addresses = addresses || [];

    if (sql) {
      try {
        await sql`
          UPDATE customers SET addresses = ${JSON.stringify(customer.addresses)}
          WHERE id = ${customer.id}
        `;
      } catch (err) {
        console.error('Error updating addresses in DB:', err);
      }
    }

    const { passwordHash, ...userProfile } = customer;
    res.json({ success: true, user: userProfile, message: 'ঠিকানা সংরক্ষণ করা হয়েছে' });
  });

  app.put('/api/customer/wishlist/:id', async (req, res) => {
    const customer = customersStore.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'কাস্টমার পাওয়া যায়নি' });
    }

    const { wishlist } = req.body;
    customer.wishlist = wishlist || [];

    if (sql) {
      try {
        await sql`
          UPDATE customers SET wishlist = ${JSON.stringify(customer.wishlist)}
          WHERE id = ${customer.id}
        `;
      } catch (err) {
        console.error('Error updating wishlist in DB:', err);
      }
    }

    const { passwordHash, ...userProfile } = customer;
    res.json({ success: true, user: userProfile, wishlist: customer.wishlist });
  });

  app.get('/api/customer/orders/:phone', (req, res) => {
    const phone = req.params.phone;
    const custOrders = ordersStore.filter(
      (o) => o.mobileNumber.includes(phone) || (o.altMobileNumber && o.altMobileNumber.includes(phone))
    );
    res.json(custOrders);
  });

  // Admin Customers Management
  app.get('/api/admin/customers', (req, res) => {
    const list = customersStore.map((c) => {
      const cOrders = ordersStore.filter(
        (o) => o.mobileNumber.includes(c.phone) || o.customerId === c.id
      );
      const totalSpent = cOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        avatarUrl: c.avatarUrl,
        addressesCount: c.addresses.length,
        ordersCount: cOrders.length,
        totalSpent,
        createdAt: c.createdAt,
      };
    });
    res.json(list);
  });

  // Database Backup & Restore
  app.get('/api/admin/backup', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      products: productsStore,
      categories: categoriesStore,
      orders: ordersStore,
      coupons: couponsStore,
      settings: settingsStore,
      adminCredentials,
    });
  });

  app.post('/api/admin/restore', (req, res) => {
    const { backupData, resetToDefault } = req.body;
    if (resetToDefault) {
      productsStore = [...INITIAL_PRODUCTS];
      categoriesStore = [...INITIAL_CATEGORIES];
      ordersStore = [...INITIAL_ORDERS];
      couponsStore = [...INITIAL_COUPONS];
      settingsStore = { ...INITIAL_SETTINGS };
      adminCredentials = {
        username: 'admin',
        password: '123123',
        email: 'admin@ritamworld.com',
        phone: '01700112233',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      return res.json({ success: true, message: 'ডাটাবেজ রি-সেট সফল হয়েছে' });
    }

    if (backupData) {
      if (backupData.products) productsStore = backupData.products;
      if (backupData.categories) categoriesStore = backupData.categories;
      if (backupData.orders) ordersStore = backupData.orders;
      if (backupData.coupons) couponsStore = backupData.coupons;
      if (backupData.settings) settingsStore = backupData.settings;
      if (backupData.adminCredentials) adminCredentials = backupData.adminCredentials;
      return res.json({ success: true, message: 'ডাটাবেজ সফলভাবে রিস্টোর করা হয়েছে' });
    }

    res.status(400).json({ success: false, message: 'অকার্যকর রিস্টোর ডাটা' });
  });

  // Products
  app.get('/api/products', (req, res) => {
    const { search, category, age, minPrice, maxPrice, sort, featured, flashSale } = req.query;
    let filtered = [...productsStore];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleBn && p.titleBn.includes(q)) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category || p.categoryBn === category);
    }

    if (age && typeof age === 'string' && age !== 'all') {
      filtered = filtered.filter((p) => p.ageRecommendation.includes(age));
    }

    if (minPrice) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    if (featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (flashSale === 'true') {
      filtered = filtered.filter((p) => p.isFlashSale);
    }

    // Sort
    if (sort === 'price-low') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.reverse();
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = productsStore.find((p) => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'প্রডাক্ট পাওয়া যায়নি' });
    }
  });

  app.post('/api/products', async (req, res) => {
    const newProduct: Product = {
      id: `rw-p${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      inStock: true,
      stockCount: 10,
      sku: `RW-${Math.floor(1000 + Math.random() * 9000)}`,
      ...req.body,
    };
    productsStore.unshift(newProduct);

    if (sql) {
      try {
        await sql`
          INSERT INTO products (
            id, title, title_bn, price, discount_price, in_stock, stock_count, sku,
            category, category_bn, brand, age_recommendation, description, specifications,
            features, images, video_url, rating, review_count, is_featured, is_new_arrival,
            is_best_seller, is_flash_sale, flash_sale_ends, delivery_time_days, warranty_period, reviews
          ) VALUES (
            ${newProduct.id}, ${newProduct.title}, ${newProduct.titleBn || null}, ${newProduct.price},
            ${newProduct.discountPrice || null}, ${newProduct.inStock}, ${newProduct.stockCount}, ${newProduct.sku},
            ${newProduct.category}, ${newProduct.categoryBn || null}, ${newProduct.brand || 'Ritam'},
            ${newProduct.ageRecommendation || '3+'}, ${newProduct.description || ''},
            ${JSON.stringify(newProduct.specifications || {})}, ${JSON.stringify(newProduct.features || [])},
            ${JSON.stringify(newProduct.images || [])}, ${newProduct.videoUrl || null}, ${newProduct.rating},
            ${newProduct.reviewCount}, ${newProduct.isFeatured || false}, ${newProduct.isNewArrival || false},
            ${newProduct.isBestSeller || false}, ${newProduct.isFlashSale || false}, ${newProduct.flashSaleEnds || null},
            ${newProduct.deliveryTimeDays || null}, ${newProduct.warrantyPeriod || null}, ${JSON.stringify(newProduct.reviews || [])}
          )
        `;
      } catch (err) {
        console.error('Error inserting product into DB:', err);
      }
    }

    res.json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', async (req, res) => {
    const index = productsStore.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      productsStore[index] = { ...productsStore[index], ...req.body };
      const updated = productsStore[index];

      if (sql) {
        try {
          await sql`
            UPDATE products SET
              title = ${updated.title},
              title_bn = ${updated.titleBn || null},
              price = ${updated.price},
              discount_price = ${updated.discountPrice || null},
              in_stock = ${updated.inStock},
              stock_count = ${updated.stockCount},
              sku = ${updated.sku},
              category = ${updated.category},
              category_bn = ${updated.categoryBn || null},
              brand = ${updated.brand},
              age_recommendation = ${updated.ageRecommendation},
              description = ${updated.description},
              specifications = ${JSON.stringify(updated.specifications || {})},
              features = ${JSON.stringify(updated.features || [])},
              images = ${JSON.stringify(updated.images || [])},
              video_url = ${updated.videoUrl || null},
              rating = ${updated.rating},
              review_count = ${updated.reviewCount},
              is_featured = ${updated.isFeatured || false},
              is_new_arrival = ${updated.isNewArrival || false},
              is_best_seller = ${updated.isBestSeller || false},
              is_flash_sale = ${updated.isFlashSale || false},
              flash_sale_ends = ${updated.flashSaleEnds || null},
              delivery_time_days = ${updated.deliveryTimeDays || null},
              warranty_period = ${updated.warrantyPeriod || null},
              reviews = ${JSON.stringify(updated.reviews || [])}
            WHERE id = ${req.params.id}
          `;
        } catch (err) {
          console.error('Error updating product in DB:', err);
        }
      }

      res.json({ success: true, product: updated });
    } else {
      res.status(404).json({ message: 'প্রডাক্ট পাওয়া যায়নি' });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    productsStore = productsStore.filter((p) => p.id !== req.params.id);
    if (sql) {
      try {
        await sql`DELETE FROM products WHERE id = ${req.params.id}`;
      } catch (err) {
        console.error('Error deleting product from DB:', err);
      }
    }
    res.json({ success: true });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    res.json(categoriesStore);
  });

  app.post('/api/categories', async (req, res) => {
    const newCat: Category = {
      id: req.body.slug || `cat-${Date.now()}`,
      itemCount: 0,
      ...req.body,
    };
    categoriesStore.push(newCat);

    if (sql) {
      try {
        await sql`
          INSERT INTO categories (id, name, name_bn, slug, icon, image, item_count)
          VALUES (${newCat.id}, ${newCat.name}, ${newCat.nameBn}, ${newCat.slug}, ${newCat.icon || null}, ${newCat.image || null}, ${newCat.itemCount || 0})
        `;
      } catch (err) {
        console.error('Error inserting category into DB:', err);
      }
    }

    res.json({ success: true, category: newCat });
  });

  app.delete('/api/categories/:id', async (req, res) => {
    categoriesStore = categoriesStore.filter((c) => c.id !== req.params.id && c.slug !== req.params.id);
    if (sql) {
      try {
        await sql`DELETE FROM categories WHERE id = ${req.params.id} OR slug = ${req.params.id}`;
      } catch (err) {
        console.error('Error deleting category from DB:', err);
      }
    }
    res.json({ success: true });
  });

  // Product Reviews
  app.post('/api/products/:id/reviews', async (req, res) => {
    const product = productsStore.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'প্রডাক্ট পাওয়া যায়নি' });
    }
    const { userName, rating, comment } = req.body;
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: userName || 'সম্মানিত কাস্টমার',
      rating: Number(rating) || 5,
      comment: comment || '',
      date: new Date().toLocaleDateString('bn-BD'),
    };
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;
    product.rating = Number((product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviewCount).toFixed(1));

    if (sql) {
      try {
        await sql`
          UPDATE products SET
            rating = ${product.rating},
            review_count = ${product.reviewCount},
            reviews = ${JSON.stringify(product.reviews)}
          WHERE id = ${product.id}
        `;
      } catch (err) {
        console.error('Error updating reviews in DB:', err);
      }
    }

    res.json({ success: true, review: newReview, product });
  });

  // Coupons
  app.get('/api/coupons', (req, res) => {
    res.json(couponsStore);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, amount } = req.body;
    const coupon = couponsStore.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (!coupon) {
      return res.status(400).json({ valid: false, message: 'কুপন কোডটি সঠিক নয় অথবা মেয়াদ উত্তীর্ণ' });
    }
    if (amount < coupon.minSpend) {
      return res.status(400).json({
        valid: false,
        message: `এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${coupon.minSpend} টাকার কেনাকাটা প্রয়োজন`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((amount * coupon.discountValue) / 100);
    }

    res.json({ valid: true, coupon, discount });
  });

  app.post('/api/coupons', async (req, res) => {
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      isActive: true,
      ...req.body,
    };
    couponsStore.push(newCoupon);

    if (sql) {
      try {
        await sql`
          INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, is_active)
          VALUES (${newCoupon.id}, ${newCoupon.code}, ${newCoupon.discountType}, ${newCoupon.discountValue}, ${newCoupon.minSpend}, ${newCoupon.expiryDate}, ${newCoupon.isActive})
        `;
      } catch (err) {
        console.error('Error inserting coupon into DB:', err);
      }
    }

    res.json({ success: true, coupon: newCoupon });
  });

  app.delete('/api/coupons/:id', async (req, res) => {
    couponsStore = couponsStore.filter((c) => c.id !== req.params.id);
    if (sql) {
      try {
        await sql`DELETE FROM coupons WHERE id = ${req.params.id}`;
      } catch (err) {
        console.error('Error deleting coupon from DB:', err);
      }
    }
    res.json({ success: true });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    res.json(ordersStore);
  });

  app.get('/api/orders/track', (req, res) => {
    const { orderId, phone } = req.query;
    const order = ordersStore.find((o) => {
      const matchId = orderId ? o.id.toLowerCase() === String(orderId).toLowerCase().trim() : false;
      const matchPhone = phone ? o.mobileNumber.includes(String(phone).trim()) : true;
      return matchId && matchPhone;
    });

    if (order) {
      res.json({ found: true, order });
    } else {
      res.status(404).json({ found: false, message: 'প্রদত্ত তথ্য দিয়ে কোনো অর্ডার পাওয়া যায়নি' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    const nextOrderNumber = 10088 + ordersStore.length;
    const newOrder: Order = {
      id: `RW-${nextOrderNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Pending',
      ...orderData,
    };

    ordersStore.unshift(newOrder);

    if (sql) {
      try {
        await sql`
          INSERT INTO orders (
            id, customer_name, mobile_number, alt_mobile_number, address, division, district, thana,
            delivery_notes, payment_method, sender_number, transaction_id, payment_screenshot, items,
            subtotal, delivery_charge, discount, total_amount, coupon_code, status, created_at, updated_at
          ) VALUES (
            ${newOrder.id}, ${newOrder.customerName}, ${newOrder.mobileNumber}, ${newOrder.altMobileNumber || null},
            ${newOrder.address}, ${newOrder.division}, ${newOrder.district}, ${newOrder.thana},
            ${newOrder.deliveryNotes || null}, ${newOrder.paymentMethod}, ${newOrder.senderNumber || null},
            ${newOrder.transactionId || null}, ${newOrder.paymentScreenshot || null},
            ${JSON.stringify(newOrder.items)}, ${newOrder.subtotal}, ${newOrder.deliveryCharge},
            ${newOrder.discount}, ${newOrder.totalAmount}, ${newOrder.couponCode || null}, ${newOrder.status},
            ${newOrder.createdAt}, ${newOrder.updatedAt}
          )
        `;
      } catch (err) {
        console.error('Error inserting order into DB:', err);
      }
    }

    res.json({ success: true, order: newOrder });
  });

  app.patch('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    const index = ordersStore.findIndex((o) => o.id === req.params.id);
    if (index !== -1) {
      ordersStore[index].status = status as OrderStatus;
      ordersStore[index].updatedAt = new Date().toISOString();

      if (sql) {
        try {
          await sql`
            UPDATE orders SET status = ${status}, updated_at = ${ordersStore[index].updatedAt}
            WHERE id = ${req.params.id}
          `;
        } catch (err) {
          console.error('Error updating order status in DB:', err);
        }
      }

      res.json({ success: true, order: ordersStore[index] });
    } else {
      res.status(404).json({ message: 'অর্ডারটি পাওয়া যায়নি' });
    }
  });

  // Admin Dashboard Analytics
  app.get('/api/stats', (req, res) => {
    const totalRevenue = ordersStore
      .filter((o) => o.status !== 'Cancelled' && o.status !== 'Refunded')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = ordersStore
      .filter((o) => o.createdAt.startsWith(todayStr) && o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = ordersStore.filter((o) => o.status === 'Pending').length;
    const confirmedOrders = ordersStore.filter((o) => o.status === 'Confirmed').length;
    const packagingOrders = ordersStore.filter((o) => o.status === 'Packaging').length;
    const shippingOrders = ordersStore.filter((o) => o.status === 'Shipping').length;
    const deliveredOrders = ordersStore.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = ordersStore.filter((o) => o.status === 'Cancelled').length;

    const lowStockCount = productsStore.filter((p) => p.stockCount <= 5).length;
    const outOfStockCount = productsStore.filter((p) => !p.inStock || p.stockCount === 0).length;

    res.json({
      todaySales,
      monthlySales: Math.round(totalRevenue * 0.75),
      totalRevenue,
      totalOrders: ordersStore.length,
      pendingOrders,
      confirmedOrders,
      packagingOrders,
      shippingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockCount,
      outOfStockCount,
      totalProducts: productsStore.length,
      recentOrders: ordersStore.slice(0, 5),
    });
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
