import postgres from 'postgres';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../data/initialData.js';

export async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('No DATABASE_URL provided. Running in fallback memory mode.');
    return null;
  }

  try {
    const sql = postgres(connectionString, { max: 10, ssl: false });

    // Create tables if not exist
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_bn TEXT,
        price NUMERIC NOT NULL,
        discount_price NUMERIC,
        in_stock BOOLEAN DEFAULT TRUE NOT NULL,
        stock_count INT DEFAULT 0 NOT NULL,
        sku TEXT,
        category TEXT NOT NULL,
        category_bn TEXT,
        brand TEXT,
        age_recommendation TEXT,
        description TEXT,
        specifications JSONB DEFAULT '{}'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        images JSONB DEFAULT '[]'::jsonb,
        video_url TEXT,
        rating NUMERIC DEFAULT 5.0,
        review_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_new_arrival BOOLEAN DEFAULT FALSE,
        is_best_seller BOOLEAN DEFAULT FALSE,
        is_flash_sale BOOLEAN DEFAULT FALSE,
        flash_sale_ends TEXT,
        delivery_time_days TEXT,
        warranty_period TEXT,
        reviews JSONB DEFAULT '[]'::jsonb
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_bn TEXT NOT NULL,
        slug TEXT NOT NULL,
        icon TEXT,
        image TEXT,
        item_count INT DEFAULT 0
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        mobile_number TEXT NOT NULL,
        alt_mobile_number TEXT,
        address TEXT NOT NULL,
        division TEXT NOT NULL,
        district TEXT NOT NULL,
        thana TEXT NOT NULL,
        delivery_notes TEXT,
        payment_method TEXT NOT NULL,
        sender_number TEXT,
        transaction_id TEXT,
        payment_screenshot TEXT,
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        delivery_charge NUMERIC NOT NULL,
        discount NUMERIC NOT NULL,
        total_amount NUMERIC NOT NULL,
        coupon_code TEXT,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        addresses JSONB DEFAULT '[]'::jsonb,
        wishlist JSONB DEFAULT '[]'::jsonb,
        created_at TEXT NOT NULL
      );
    `;

    // Ensure orders table columns exist
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id TEXT;`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS postal_code TEXT;`;

    await sql`
      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value NUMERIC NOT NULL,
        min_spend NUMERIC NOT NULL,
        expiry_date TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id INT PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        avatar_url TEXT
      );
    `;

    // Seed default data if empty
    const productCount = await sql`SELECT count(*)::int as count FROM products`;
    if (productCount[0].count === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await sql`
          INSERT INTO products (
            id, title, title_bn, price, discount_price, in_stock, stock_count, sku,
            category, category_bn, brand, age_recommendation, description, specifications,
            features, images, video_url, rating, review_count, is_featured, is_new_arrival,
            is_best_seller, is_flash_sale, flash_sale_ends, delivery_time_days, warranty_period, reviews
          ) VALUES (
            ${p.id}, ${p.title}, ${p.titleBn || null}, ${p.price}, ${p.discountPrice || null}, ${p.inStock},
            ${p.stockCount}, ${p.sku}, ${p.category}, ${p.categoryBn || null}, ${p.brand || 'Ritam'}, ${p.ageRecommendation || '3+'},
            ${p.description || ''}, ${JSON.stringify(p.specifications || {})}, ${JSON.stringify(p.features || [])},
            ${JSON.stringify(p.images || [])}, ${p.videoUrl || null}, ${p.rating || 5.0}, ${p.reviewCount || 0}, ${p.isFeatured || false},
            ${p.isNewArrival || false}, ${p.isBestSeller || false}, ${p.isFlashSale || false}, ${p.flashSaleEnds || null},
            ${p.deliveryTimeDays || null}, ${p.warrantyPeriod || null}, ${JSON.stringify(p.reviews || [])}
          )
        `;
      }
    }

    const catCount = await sql`SELECT count(*)::int as count FROM categories`;
    if (catCount[0].count === 0) {
      for (const c of INITIAL_CATEGORIES) {
        await sql`
          INSERT INTO categories (id, name, name_bn, slug, icon, image, item_count)
          VALUES (${c.id}, ${c.name}, ${c.nameBn}, ${c.slug}, ${c.icon || null}, ${c.image || null}, ${c.itemCount || 0})
        `;
      }
    }

    const orderCount = await sql`SELECT count(*)::int as count FROM orders`;
    if (orderCount[0].count === 0) {
      for (const o of INITIAL_ORDERS) {
        await sql`
          INSERT INTO orders (
            id, customer_name, mobile_number, alt_mobile_number, address, division, district, thana,
            delivery_notes, payment_method, sender_number, transaction_id, payment_screenshot, items,
            subtotal, delivery_charge, discount, total_amount, coupon_code, status, created_at, updated_at
          ) VALUES (
            ${o.id}, ${o.customerName}, ${o.mobileNumber}, ${o.altMobileNumber || null}, ${o.address}, ${o.division},
            ${o.district}, ${o.thana}, ${o.deliveryNotes || null}, ${o.paymentMethod}, ${o.senderNumber || null},
            ${o.transactionId || null}, ${o.paymentScreenshot || null}, ${JSON.stringify(o.items)}, ${o.subtotal},
            ${o.deliveryCharge}, ${o.discount}, ${o.totalAmount}, ${o.couponCode || null}, ${o.status},
            ${o.createdAt}, ${o.updatedAt}
          )
        `;
      }
    }

    const couponCount = await sql`SELECT count(*)::int as count FROM coupons`;
    if (couponCount[0].count === 0) {
      for (const cp of INITIAL_COUPONS) {
        await sql`
          INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, is_active)
          VALUES (${cp.id}, ${cp.code}, ${cp.discountType}, ${cp.discountValue}, ${cp.minSpend}, ${cp.expiryDate}, ${cp.isActive})
        `;
      }
    }

    const settingsCount = await sql`SELECT count(*)::int as count FROM settings`;
    if (settingsCount[0].count === 0) {
      await sql`
        INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(INITIAL_SETTINGS)})
      `;
    }

    const adminCount = await sql`SELECT count(*)::int as count FROM admin_credentials`;
    if (adminCount[0].count === 0) {
      await sql`
        INSERT INTO admin_credentials (id, username, password, email, phone, avatar_url)
        VALUES (1, 'admin', '123123', 'admin@ritamworld.com', '01700112233', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')
      `;
    }

    console.log('Cloud SQL Postgres database initialized and seeded successfully.');
    return sql;
  } catch (err) {
    console.error('Error initializing Cloud SQL database:', err);
    return null;
  }
}
