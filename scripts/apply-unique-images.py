import json

# Define the 18 unique image mappings:
# (product_id, packaging_size, unique_image_url)
UNIQUE_IMAGES = {
    # 1. Classic White Farm (Thatta)
    ('prod-wf-classic-6pack', '6pack'): 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=1000&q=80',
    ('prod-white-001', '12pack'): 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1000&q=80',
    ('prod-wf-classic-30tray', '30tray'): 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80',

    # 2. Premium Leghorn White (Malir)
    ('prod-wf-leghorn-6pack', '6pack'): 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=1000&q=80',
    ('prod-white-002', '12pack'): 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80',
    ('prod-wf-leghorn-30tray', '30tray'): 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1000&q=80',

    # 3. Enriched Protein White (Hyderabad)
    ('prod-wf-enriched-6pack', '6pack'): 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1000&q=80',
    ('prod-white-003', '12pack'): 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80',
    ('prod-wf-enriched-30tray', '30tray'): 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=1000&q=80',

    # 4. Pure Aseel Desi (Thatta & Indus Basin)
    ('prod-yd-aseel-6pack', '6pack'): 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80',
    ('prod-desi-001', '12pack'): 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1000&q=80',
    ('prod-yd-aseel-30tray', '30tray'): 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80',

    # 5. Golden Misri Desi (Mirpurkhas)
    ('prod-yd-misri-6pack', '6pack'): 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=1000&q=80',
    ('prod-desi-002', '12pack'): 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=1000&q=80',
    ('prod-yd-misri-30tray', '30tray'): 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80',

    # 6. Sindh Organic Heritage Desi (Malir)
    ('prod-yd-heritage-6pack', '6pack'): 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=1000&q=80',
    ('prod-desi-003', '12pack'): 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    ('prod-yd-heritage-30tray', '30tray'): 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=1000&q=80',
}

# Update data/local-db.json
with open('data/local-db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

unique_urls = set()
for p in db['products']:
    key = (p['id'], p.get('packagingSize', '12pack'))
    if key in UNIQUE_IMAGES:
        p['imageUrl'] = UNIQUE_IMAGES[key]
        unique_urls.add(p['imageUrl'])
    else:
        print(f"Warning: No match for {key}")

print(f"Assigned {len(unique_urls)} distinct images across {len(db['products'])} products.")
assert len(unique_urls) == 18, f"Expected 18 unique images, got {len(unique_urls)}"

with open('data/local-db.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Successfully saved data/local-db.json.")

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

print("Successfully saved lib/data/products.ts.")
