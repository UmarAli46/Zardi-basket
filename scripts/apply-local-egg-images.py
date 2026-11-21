import json

# Mapping of product ID to local image URL
PRODUCT_IMAGE_MAP = {
    # 1. Classic White Farm (Thatta)
    'prod-wf-classic-6pack': '/images/products/wf-classic-6pack.jpg',
    'prod-white-001': '/images/products/wf-classic-12pack.jpg',
    'prod-wf-classic-30tray': '/images/products/wf-classic-30tray.jpg',

    # 2. Premium Leghorn White (Malir)
    'prod-wf-leghorn-6pack': '/images/products/wf-leghorn-6pack.jpg',
    'prod-white-002': '/images/products/wf-leghorn-12pack.jpg',
    'prod-wf-leghorn-30tray': '/images/products/wf-leghorn-30tray.jpg',

    # 3. Enriched Protein White (Hyderabad)
    'prod-wf-enriched-6pack': '/images/products/wf-enriched-6pack.jpg',
    'prod-white-003': '/images/products/wf-enriched-12pack.jpg',
    'prod-wf-enriched-30tray': '/images/products/wf-enriched-30tray.jpg',

    # 4. Pure Aseel Desi (Thatta & Indus Basin)
    'prod-yd-aseel-6pack': '/images/products/yd-aseel-6pack.jpg',
    'prod-desi-001': '/images/products/yd-aseel-12pack.jpg',
    'prod-yd-aseel-30tray': '/images/products/yd-aseel-30tray.jpg',

    # 5. Golden Misri Desi (Mirpurkhas)
    'prod-yd-misri-6pack': '/images/products/yd-misri-6pack.jpg',
    'prod-desi-002': '/images/products/yd-misri-12pack.jpg',
    'prod-yd-misri-30tray': '/images/products/yd-misri-30tray.jpg',

    # 6. Sindh Organic Heritage Desi (Malir)
    'prod-yd-heritage-6pack': '/images/products/yd-heritage-6pack.jpg',
    'prod-desi-003': '/images/products/yd-heritage-12pack.jpg',
    'prod-yd-heritage-30tray': '/images/products/yd-heritage-30tray.jpg',
}

# Update data/local-db.json
with open('data/local-db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for p in db['products']:
    pid = p['id']
    if pid in PRODUCT_IMAGE_MAP:
        p['imageUrl'] = PRODUCT_IMAGE_MAP[pid]
    else:
        print(f"Warning: No image map for {pid}")

with open('data/local-db.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Updated data/local-db.json with verified local egg image paths.")

# Update lib/data/products.ts
ts_content = f"""import {{ Product, StoreSettings }} from '../types';

export const initialStoreSettings: StoreSettings = {{
  storeName: 'Zardi Basket',
  tagline: 'Farm-Fresh Organic Desi & Farm Eggs Delivered Exclusively Across Sindh (Karachi, Hyderabad & Beyond)',
  deliveryCharge: 150,
  freeDeliveryThreshold: 2000,
  breakageGuaranteeFee: 50,
  contactPhone: '+92 300 8492011',
  contactEmail: 'care@zardibasket.pk',
  merchantJazzCash: '0300-8492011 (Till ID: 002910)',
  merchantEasypaisa: '0345-8492011',
  merchantTitle: 'Zardi Basket Farms Sindh Pvt Ltd',
}};

export const initialProducts: Product[] = {json.dumps(db['products'], indent=2, ensure_ascii=False)};
"""

with open('lib/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Updated lib/data/products.ts with verified local egg image paths.")
