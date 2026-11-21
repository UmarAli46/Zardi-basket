-- ==============================================================================
-- ZARDI BASKET — SUPABASE POSTGRESQL SCHEMA & RLS SETUP
-- Run this script in the Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "eggType" TEXT NOT NULL,
  "breed" TEXT,
  "coopOrigin" TEXT,
  "region" TEXT,
  "dietInfo" TEXT,
  "yolkScore" INTEGER DEFAULT 12,
  "batchCode" TEXT,
  "layDate" TEXT,
  "expiryDays" INTEGER DEFAULT 30,
  "price6Pack" NUMERIC NOT NULL,
  "price12Pack" NUMERIC NOT NULL,
  "price30Tray" NUMERIC NOT NULL,
  "originalPrice12Pack" NUMERIC,
  "stockQuantity" NUMERIC DEFAULT 0,
  "badges" JSONB DEFAULT '[]'::jsonb,
  "imageUrl" TEXT,
  "nutritionalFacts" JSONB DEFAULT '{}'::jsonb,
  "isActive" BOOLEAN DEFAULT true,
  "featured" BOOLEAN DEFAULT false,
  "rating" NUMERIC DEFAULT 5.0,
  "reviewCount" INTEGER DEFAULT 0,
  "packagingSize" TEXT,
  "boxLabel" TEXT,
  "qualityTier" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- If the table was already created earlier, ensure missing columns are added:
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS "packagingSize" TEXT,
  ADD COLUMN IF NOT EXISTS "boxLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "qualityTier" TEXT;

-- 2. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  "id" TEXT PRIMARY KEY,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "deliveryAddress" TEXT NOT NULL,
  "deliveryCity" TEXT NOT NULL,
  "deliveryNotes" TEXT,
  "items" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "subtotal" NUMERIC DEFAULT 0,
  "deliveryFee" NUMERIC DEFAULT 0,
  "breakageGuarantee" BOOLEAN DEFAULT false,
  "discountAmount" NUMERIC DEFAULT 0,
  "totalAmount" NUMERIC DEFAULT 0,
  "paymentMethod" TEXT DEFAULT 'cod',
  "paymentReference" TEXT,
  "paymentStatus" TEXT DEFAULT 'pending',
  "orderStatus" TEXT DEFAULT 'confirmed',
  "batchTraceabilityCode" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_eggtype ON public.products("eggType");
CREATE INDEX IF NOT EXISTS idx_products_isactive ON public.products("isActive");
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products("slug");
CREATE INDEX IF NOT EXISTS idx_orders_ordernumber ON public.orders("orderNumber");
CREATE INDEX IF NOT EXISTS idx_orders_customerphone ON public.orders("customerPhone");
CREATE INDEX IF NOT EXISTS idx_orders_createdat ON public.orders("createdAt" DESC);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Full access products for service role" ON public.products;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
DROP POLICY IF EXISTS "Full access orders for service role" ON public.orders;

-- Products Policies
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Full access products for service role" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders Policies
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Full access orders for service role" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- 5. GRANT TABLE PRIVILEGES TO SUPABASE API ROLES
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
