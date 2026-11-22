import fs from 'fs';
import path from 'path';
import { initialProducts, initialStoreSettings } from '../data/products';
import { Order, OrderStatus, PaymentStatus, Product, StoreSettings } from '../types';
import { createClient } from '@supabase/supabase-js';

const DB_FILE = path.join(process.cwd(), 'data', 'local-db.json');

interface LocalDatabase {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}

// In-memory fallback if file system is read-only
let memoryDb: LocalDatabase | null = null;

// Default Supabase configuration for production cloud database
const DEFAULT_SUPABASE_URL = 'https://tsdbtzpofcqvyyjkcwju.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_cOdhyd3FgpqGEqyVcm99EA_S7BDRR1y';

function isRealKey(key?: string): boolean {
  if (!key) return false;
  const k = key.trim();
  return k !== '' && !k.includes('placeholder') && !k.startsWith('your-');
}

export function getSupabase() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL && isRealKey(process.env.NEXT_PUBLIC_SUPABASE_URL))
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : DEFAULT_SUPABASE_URL;

  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY && isRealKey(process.env.SUPABASE_SERVICE_ROLE_KEY))
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && isRealKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : DEFAULT_SUPABASE_KEY;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const isSupabaseConfigured = true;
const supabase = getSupabase();

// Local JSON Database Helper
function getLocalDb(): LocalDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Could not read local DB file, initializing fresh memory state', err);
  }

  if (memoryDb) return memoryDb;

  // Seed default data for Pakistani market
  const initialDb: LocalDatabase = {
    products: [...initialProducts],
    orders: [
      {
        id: 'ord-849201',
        orderNumber: 'ZB-84920',
        customerName: 'Begum Shazia Rehman',
        customerEmail: 'shazia.rehman@gmail.com',
        customerPhone: '0321-4567890',
        deliveryAddress: 'House 42, Street 8, Phase 5 DHA',
        deliveryCity: 'Lahore',
        deliveryNotes: 'Please deliver between 8 AM and 10 AM, hand the insulated cooler bag to gate security',
        items: [
          {
            productId: 'prod-001',
            title: 'Pure Desi Aseel Eggs',
            packagingId: '12pack',
            packagingLabel: '12-Pack (One Dozen)',
            quantity: 2,
            unitPrice: 520,
            lineTotal: 1040,
          },
          {
            productId: 'prod-004',
            title: 'Murree Hills Quail Eggs',
            packagingId: '6pack',
            packagingLabel: '18-Pack Box (Quail)',
            quantity: 1,
            unitPrice: 240,
            lineTotal: 240,
          },
        ],
        subtotal: 1280,
        deliveryFee: 150,
        breakageGuarantee: true,
        discountAmount: 0,
        totalAmount: 1480,
        paymentMethod: 'jazzcash_tid',
        paymentReference: 'TID-883920119',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        batchTraceabilityCode: 'ZB-CKW-912',
        createdAt: '2026-11-18T10:14:00.000Z',
        updatedAt: '2026-11-18T16:30:00.000Z',
      },
      {
        id: 'ord-849202',
        orderNumber: 'ZB-84921',
        customerName: 'Muhammad Hamza (Fitness Coach)',
        customerEmail: 'hamza.fitness@yahoo.com',
        customerPhone: '0302-9988776',
        deliveryAddress: 'Flat 4B, Gulberg Heights, Main Boulevard Gulberg II',
        deliveryCity: 'Lahore',
        deliveryNotes: 'Call customer 15 minutes before delivery arrival',
        items: [
          {
            productId: 'prod-005',
            title: '100% Pasteurized Liquid Whites',
            packagingId: '12pack',
            packagingLabel: '1000ml Bottle (1 Liter)',
            quantity: 3,
            unitPrice: 890,
            lineTotal: 2670,
          },
        ],
        subtotal: 2670,
        deliveryFee: 0, // Free delivery above 2000 PKR
        breakageGuarantee: false,
        discountAmount: 0,
        totalAmount: 2670,
        paymentMethod: 'safepay',
        paymentReference: 'SP_TRK_99201488',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        batchTraceabilityCode: 'ZB-LHR-881',
        createdAt: '2026-11-19T14:40:00.000Z',
        updatedAt: '2026-11-20T09:15:00.000Z',
      },
      {
        id: 'ord-849203',
        orderNumber: 'ZB-84922',
        customerName: 'Dr. Tariq Mahmood',
        customerEmail: 'dr.tariq@shifa.com.pk',
        customerPhone: '0333-5123456',
        deliveryAddress: 'House 14, Street 29, Sector F-7/2',
        deliveryCity: 'Islamabad',
        deliveryNotes: 'Insulated packaging required for fresh organic eggs',
        items: [
          {
            productId: 'prod-001',
            title: 'Pure Desi Aseel Eggs',
            packagingId: '30tray',
            packagingLabel: '30-Egg Tray',
            quantity: 1,
            unitPrice: 1250,
            lineTotal: 1250,
          },
          {
            productId: 'prod-003',
            title: 'Riverside Duck Eggs',
            packagingId: '12pack',
            packagingLabel: '12-Pack (One Dozen)',
            quantity: 1,
            unitPrice: 690,
            lineTotal: 690,
          },
        ],
        subtotal: 1940,
        deliveryFee: 150,
        breakageGuarantee: true,
        discountAmount: 0,
        totalAmount: 2140,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        batchTraceabilityCode: 'ZB-CKW-912',
        createdAt: '2026-11-20T18:20:00.000Z',
        updatedAt: '2026-11-20T18:20:00.000Z',
      },
    ],
    settings: { ...initialStoreSettings },
  };

  saveLocalDb(initialDb);
  memoryDb = initialDb;
  return initialDb;
}

function saveLocalDb(data: LocalDatabase): void {
  memoryDb = data;
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to local DB file, kept in memory', err);
  }
}

// -------------------------------------------------------------
// PRODUCT OPERATIONS
// -------------------------------------------------------------
export async function getProducts(options?: {
  onlyActive?: boolean;
  category?: string;
  search?: string;
}): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (options?.onlyActive !== false) {
        query = query.eq('isActive', true);
      }
      if (options?.category && options.category !== 'all') {
        query = query.eq('eggType', options.category);
      }
      const { data, error } = await query.order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    } catch (err) {
      console.warn('Supabase query failed, falling back to local DB', err);
    }
  }

  const db = getLocalDb();
  let list = db.products;

  if (options?.onlyActive !== false) {
    list = list.filter((p) => p.isActive);
  }

  if (options?.category && options.category !== 'all') {
    list = list.filter((p) => p.eggType === options.category);
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();
      if (!error && data) return data as Product;
    } catch (err) {
      console.warn('Supabase query failed, falling back to local DB', err);
    }
  }

  const db = getLocalDb();
  return (
    db.products.find((p) => p.id === id || p.slug === id) ||
    db.products.find((p) => p.slug.startsWith(id) || id.startsWith(p.slug)) ||
    null
  );
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    slug: payload.slug || (payload.title || 'egg-product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: payload.title || 'Fresh Farm Eggs',
    subtitle: payload.subtitle || 'Pasture-raised fresh eggs',
    description: payload.description || '',
    eggType: payload.eggType || 'hen',
    breed: payload.breed || 'Heritage Pasture Breed',
    coopOrigin: payload.coopOrigin || 'Sunrise Valley Coop',
    region: payload.region || 'Punjab Organic Valley',
    dietInfo: payload.dietInfo || '100% Non-GMO Pasture Forage',
    yolkScore: payload.yolkScore || 14,
    batchCode: payload.batchCode || `ZB-BT-${Math.floor(100 + Math.random() * 900)}`,
    layDate: payload.layDate || 'Fresh Yesterday',
    expiryDays: payload.expiryDays || 30,
    price6Pack: Number(payload.price6Pack) || 450,
    price12Pack: Number(payload.price12Pack) || 850,
    price30Tray: Number(payload.price30Tray) || 1950,
    originalPrice12Pack: payload.originalPrice12Pack ? Number(payload.originalPrice12Pack) : undefined,
    stockQuantity: Number(payload.stockQuantity) || 25,
    badges: payload.badges && payload.badges.length ? payload.badges : ['Fresh Farm', 'Pasture-Raised'],
    imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80',
    nutritionalFacts: payload.nutritionalFacts || {
      proteinPerEgg: '7.0g',
      calories: '75 kcal',
      omega3: '140mg',
      cholesterol: '185mg',
    },
    isActive: payload.isActive !== false,
    featured: Boolean(payload.featured),
    rating: 5.0,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) {
        const db = getLocalDb();
        db.products.unshift(data as Product);
        saveLocalDb(db);
        return data as Product;
      }
    } catch (err) {
      console.warn('Supabase insert failed, persisting to local DB', err);
    }
  }

  const db = getLocalDb();
  db.products.unshift(newProduct);
  saveLocalDb(db);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  let updatedProd: Product | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select()
        .single();
      if (!error && data) {
        updatedProd = data as Product;
      } else if (error) {
        console.warn('Supabase update returned error:', error);
      }
    } catch (err) {
      console.warn('Supabase update failed, updating local DB', err);
    }
  }

  const db = getLocalDb();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);
  if (index !== -1) {
    db.products[index] = {
      ...db.products[index],
      ...updates,
    };
    saveLocalDb(db);
    if (!updatedProd) updatedProd = db.products[index];
  }

  return updatedProd;
}

export async function deleteProduct(id: string): Promise<boolean> {
  let deleted = false;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().or(`id.eq.${id},slug.eq.${id}`);
      if (!error) deleted = true;
    } catch (err) {
      console.warn('Supabase delete failed, deleting from local DB', err);
    }
  }

  const db = getLocalDb();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);
  if (index !== -1) {
    db.products.splice(index, 1);
    saveLocalDb(db);
    deleted = true;
  }
  return deleted;
}

// -------------------------------------------------------------
// ORDER OPERATIONS
// -------------------------------------------------------------
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as Order[];
    } catch (err) {
      console.warn('Supabase orders fetch failed, reading local DB', err);
    }
  }

  const db = getLocalDb();
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${id},orderNumber.eq.${id}`)
        .maybeSingle();
      if (!error && data) return data as Order;
    } catch (err) {
      console.warn('Supabase single order fetch failed', err);
    }
  }

  const db = getLocalDb();
  return db.orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(orderPayload: Partial<Order>): Promise<Order> {
  const db = getLocalDb();
  const orderNum = `ZB-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    customerName: orderPayload.customerName || 'Customer',
    customerEmail: orderPayload.customerEmail || 'guest@example.com',
    customerPhone: orderPayload.customerPhone || '0300-0000000',
    deliveryAddress: orderPayload.deliveryAddress || 'Address',
    deliveryCity: orderPayload.deliveryCity || 'Lahore',
    deliveryNotes: orderPayload.deliveryNotes || '',
    items: orderPayload.items || [],
    subtotal: Number(orderPayload.subtotal) || 0,
    deliveryFee: Number(orderPayload.deliveryFee) || 0,
    breakageGuarantee: Boolean(orderPayload.breakageGuarantee),
    discountAmount: Number(orderPayload.discountAmount) || 0,
    totalAmount: Number(orderPayload.totalAmount) || 0,
    paymentMethod: orderPayload.paymentMethod || 'cod',
    paymentReference: orderPayload.paymentReference || '',
    paymentStatus: orderPayload.paymentStatus || 'pending',
    orderStatus: 'confirmed',
    batchTraceabilityCode: orderPayload.batchTraceabilityCode || 'ZB-LIVE-BATCH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Deduct inventory in both Supabase & Local Fallback
  for (const item of newOrder.items) {
    const unitsToDeduct = item.packagingId === '30tray' ? item.quantity * 2.5 : item.quantity;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: p } = await supabase.from('products').select('stockQuantity').eq('id', item.productId).single();
        if (p) {
          const currentStock = Number(p.stockQuantity) || 0;
          const newStock = Math.max(0, Math.round((currentStock - unitsToDeduct) * 10) / 10);
          await supabase.from('products').update({ stockQuantity: newStock }).eq('id', item.productId);
        }
      } catch (err) {
        console.warn('Failed to deduct stock in Supabase', err);
      }
    }

    const localProduct = db.products.find((p) => p.id === item.productId);
    if (localProduct) {
      localProduct.stockQuantity = Math.max(0, Math.round((localProduct.stockQuantity - unitsToDeduct) * 10) / 10);
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
      if (!error && data) return data as Order;
    } catch (err) {
      console.warn('Supabase order creation failed, persisting to local DB', err);
    }
  }

  db.orders.unshift(newOrder);
  saveLocalDb(db);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order | null> {
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const updates: any = { orderStatus, updatedAt };
      if (paymentStatus) {
        updates.paymentStatus = paymentStatus;
      }
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .or(`id.eq.${id},orderNumber.eq.${id}`)
        .select()
        .maybeSingle();

      if (!error && data) {
        // Also sync local if present
        const db = getLocalDb();
        const localIdx = db.orders.findIndex((o) => o.id === id || o.orderNumber === id);
        if (localIdx !== -1) {
          db.orders[localIdx].orderStatus = orderStatus;
          if (paymentStatus) db.orders[localIdx].paymentStatus = paymentStatus;
          db.orders[localIdx].updatedAt = updatedAt;
          saveLocalDb(db);
        }
        return data as Order;
      }
    } catch (err) {
      console.warn('Supabase order status update failed', err);
    }
  }

  const db = getLocalDb();
  const order = db.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) return null;

  order.orderStatus = orderStatus;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  order.updatedAt = updatedAt;
  saveLocalDb(db);
  return order;
}

// -------------------------------------------------------------
// SETTINGS & STATS
// -------------------------------------------------------------
export async function getStoreSettings(): Promise<StoreSettings> {
  const db = getLocalDb();
  return db.settings;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const db = getLocalDb();
  db.settings = { ...db.settings, ...settings };
  saveLocalDb(db);
  return db.settings;
}

export async function getAdminStats() {
  if (isSupabaseConfigured && supabase) {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*').order('createdAt', { ascending: false }),
      ]);

      const products = (productsRes.data || []) as Product[];
      const orders = (ordersRes.data || []) as Order[];

      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.isActive).length;
      const totalOrders = orders.length;
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      const lowStockCount = products.filter((p) => Number(p.stockQuantity) < 10).length;
      const pendingOrders = orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'packed').length;

      return {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        lowStockCount,
        pendingOrders,
        recentOrders: orders.slice(0, 5),
        lowStockItems: products.filter((p) => Number(p.stockQuantity) < 15),
      };
    } catch (err) {
      console.warn('Supabase getAdminStats failed, using local DB fallback', err);
    }
  }

  const db = getLocalDb();
  const totalProducts = db.products.length;
  const activeProducts = db.products.filter((p) => p.isActive).length;
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = db.products.filter((p) => p.stockQuantity < 10).length;
  const pendingOrders = db.orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'packed').length;

  return {
    totalProducts,
    activeProducts,
    totalOrders,
    totalRevenue,
    lowStockCount,
    pendingOrders,
    recentOrders: db.orders.slice(0, 5),
    lowStockItems: db.products.filter((p) => p.stockQuantity < 15),
  };
}
