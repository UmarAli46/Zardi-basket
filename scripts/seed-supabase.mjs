/**
 * Zardi Basket — Automated Supabase Database Seeder
 * Reads product and order catalog from data/local-db.json and uploads them to your Supabase tables.
 *
 * Usage:
 *   node scripts/seed-supabase.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local manually so dotenv is not strictly required as a dependency
function loadEnvLocal() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnvLocal();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey || supabaseKey.includes('your-') || supabaseKey.includes('placeholder')) {
  supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
if (!supabaseKey || supabaseKey.includes('your-') || supabaseKey.includes('placeholder')) {
  supabaseKey = null;
}

console.log('\n========================================================');
console.log('🌿 ZARDI BASKET — SUPABASE SEEDING UTILITY');
console.log('========================================================\n');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')) {
  console.error('❌ Supabase credentials are missing or still set to placeholders in .env.local!');
  console.log('\nPlease update .env.local with your real project keys:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>');
  console.log('\nThen run: node scripts/seed-supabase.mjs\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  const localDbPath = path.join(rootDir, 'data', 'local-db.json');
  if (!fs.existsSync(localDbPath)) {
    console.error(`❌ Local database file not found at: ${localDbPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(localDbPath, 'utf-8');
  const db = JSON.parse(rawData);

  console.log(`🔗 Connecting to Supabase at: ${supabaseUrl}`);
  console.log(`📦 Found ${db.products?.length || 0} products and ${db.orders?.length || 0} orders to seed.`);

  // 1. Seed Products
  if (db.products && db.products.length > 0) {
    console.log('\n⏳ Uploading products to public.products table...');
    const { data, error } = await supabase
      .from('products')
      .upsert(db.products, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error inserting products:', error.message);
      console.log('💡 TIP: Make sure you ran "supabase-schema.sql" in your Supabase SQL Editor first!');
      process.exit(1);
    }
    console.log(`✅ Successfully seeded ${db.products.length} products!`);
  }

  // 2. Seed Orders
  if (db.orders && db.orders.length > 0) {
    console.log('\n⏳ Uploading orders to public.orders table...');
    const { data, error } = await supabase
      .from('orders')
      .upsert(db.orders, { onConflict: 'id' });

    if (error) {
      console.warn('⚠️ Could not insert orders:', error.message);
    } else {
      console.log(`✅ Successfully seeded ${db.orders.length} orders!`);
    }
  }

  console.log('\n🎉 Supabase seeding completed successfully!');
  console.log('✨ You can now restart your Next.js dev server (npm run dev) to see live Supabase data.\n');
}

runSeed().catch((err) => {
  console.error('❌ Unexpected error during seeding:', err);
  process.exit(1);
});
