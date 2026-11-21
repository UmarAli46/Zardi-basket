import json

qualities = [
    # White Farm Eggs (3 qualities)
    {
        'base_id': 'prod-wf-classic',
        'slug_base': 'classic-white-farm-eggs',
        'title_base': 'Classic White Farm Eggs',
        'title_urdu': 'کلاسک سفید فارمی انڈے',
        'eggType': 'white_farm',
        'qualityTier': 'Classic Daily Farm',
        'breed': 'Commercial Leghorn Cross',
        'coopOrigin': 'Thatta Coastal Aviary #02',
        'region': 'Thatta Green Belt, Sindh',
        'dietInfo': 'Certified Non-GMO grains, soya meal, calcium limestone, and essential vitamins',
        'yolkScore': 11,
        'batchCode': 'ZB-SND-W01',
        'prices': {'6pack': 160, '12pack': 310, '30tray': 750},
        'rating': 4.8,
        'reviews': 164,
        'image': 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1000&q=80',
        'protein': '6.4g',
        'calories': '70 kcal',
        'omega3': '110mg',
        'cholesterol': '185mg',
        'id_12': 'prod-white-001'
    },
    {
        'base_id': 'prod-wf-leghorn',
        'slug_base': 'premium-leghorn-white-eggs',
        'title_base': 'Premium Leghorn White Eggs',
        'title_urdu': 'پریمیم لیگ ہارن سفید انڈے',
        'eggType': 'white_farm',
        'qualityTier': 'Premium Leghorn A+',
        'breed': 'Pure White Leghorn Heritage',
        'coopOrigin': 'Malir Valley Aviary Unit #05',
        'region': 'Malir Agro Corridor, Karachi, Sindh',
        'dietInfo': 'Enriched wholesome corn meal, fortified calcium matrix, purified drinking water',
        'yolkScore': 12,
        'batchCode': 'ZB-SND-W02',
        'prices': {'6pack': 180, '12pack': 350, '30tray': 840},
        'rating': 4.9,
        'reviews': 142,
        'image': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80',
        'protein': '6.7g',
        'calories': '72 kcal',
        'omega3': '125mg',
        'cholesterol': '180mg',
        'id_12': 'prod-white-002'
    },
    {
        'base_id': 'prod-wf-enriched',
        'slug_base': 'enriched-protein-white-farm-eggs',
        'title_base': 'Enriched Protein White Farm Eggs',
        'title_urdu': 'پروٹین افزودہ سفید فارمی انڈے',
        'eggType': 'white_farm',
        'qualityTier': 'Enriched High-Protein',
        'breed': 'Fortified Commercial Layer',
        'coopOrigin': 'Hyderabad Agro Unit #03',
        'region': 'Hyderabad Farm Belt, Sindh',
        'dietInfo': 'Omega-3 enriched flaxseed feed, sunflower seeds, organic spirulina, Vitamin D',
        'yolkScore': 13,
        'batchCode': 'ZB-SND-W03',
        'prices': {'6pack': 200, '12pack': 390, '30tray': 920},
        'rating': 4.9,
        'reviews': 98,
        'image': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80',
        'protein': '7.2g',
        'calories': '74 kcal',
        'omega3': '175mg',
        'cholesterol': '175mg',
        'id_12': 'prod-white-003'
    },
    # Yellow Desi Eggs (3 qualities)
    {
        'base_id': 'prod-yd-aseel',
        'slug_base': 'pure-aseel-desi-eggs',
        'title_base': 'Pure Aseel Desi Eggs',
        'title_urdu': 'خالص اصیل دیسی انڈے',
        'eggType': 'desi_yellow',
        'qualityTier': 'Pure Sindhi Aseel',
        'breed': 'Pure Sindhi Indigenous Aseel',
        'coopOrigin': 'Indus Pastures Coop #01',
        'region': 'Thatta & Indus Basin, Sindh',
        'dietInfo': 'Non-GMO Golden Corn, Whole Wheat, Flaxseeds, Fresh Pasture Clover, Clean Spring Water',
        'yolkScore': 15,
        'batchCode': 'ZB-SND-D01',
        'prices': {'6pack': 280, '12pack': 540, '30tray': 1320},
        'rating': 5.0,
        'reviews': 286,
        'image': 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1000&q=80',
        'protein': '7.5g',
        'calories': '79 kcal',
        'omega3': '170mg',
        'cholesterol': '180mg',
        'id_12': 'prod-desi-001'
    },
    {
        'base_id': 'prod-yd-misri',
        'slug_base': 'golden-misri-desi-eggs',
        'title_base': 'Golden Misri Desi Eggs',
        'title_urdu': 'گولڈن مصری دیسی انڈے',
        'eggType': 'desi_yellow',
        'qualityTier': 'Golden Misri Free-Range',
        'breed': 'Sindh Acclimatized Golden Misri',
        'coopOrigin': 'Mirpurkhas Pasture Unit #04',
        'region': 'Mirpurkhas Citrus Pastures, Sindh',
        'dietInfo': 'Sunlit open pasture foraging, wild greens, cracked golden corn, mustard seeds',
        'yolkScore': 14,
        'batchCode': 'ZB-SND-D02',
        'prices': {'6pack': 250, '12pack': 480, '30tray': 1180},
        'rating': 4.9,
        'reviews': 175,
        'image': 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=1000&q=80',
        'protein': '7.1g',
        'calories': '76 kcal',
        'omega3': '155mg',
        'cholesterol': '185mg',
        'id_12': 'prod-desi-002'
    },
    {
        'base_id': 'prod-yd-heritage',
        'slug_base': 'sindh-organic-heritage-desi-eggs',
        'title_base': 'Sindh Organic Heritage Desi Eggs',
        'title_urdu': 'سندھ دیسی نامیاتی انڈے',
        'eggType': 'desi_yellow',
        'qualityTier': 'Organic Heritage Pasture',
        'breed': 'Heritage Sindhi Farmyard Breed',
        'coopOrigin': 'Malir Agro Valley Pastures #02',
        'region': 'Malir Agro Valley, Karachi, Sindh',
        'dietInfo': '100% Certified Organic grains, seasonal insects, river clover, naturally balanced herbs',
        'yolkScore': 15,
        'batchCode': 'ZB-SND-D03',
        'prices': {'6pack': 260, '12pack': 510, '30tray': 1250},
        'rating': 4.9,
        'reviews': 124,
        'image': 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1000&q=80',
        'protein': '7.3g',
        'calories': '77 kcal',
        'omega3': '165mg',
        'cholesterol': '180mg',
        'id_12': 'prod-desi-003'
    }
]

sizes = [
    ('6pack', '6-Egg Box', '6 انڈے'),
    ('12pack', '12-Egg Box', '12 انڈے'),
    ('30tray', '30-Tray Box', '30 انڈے')
]

products = []
for q in qualities:
    for size_id, size_label, size_urdu in sizes:
        pid = q['id_12'] if size_id == '12pack' else f"{q['base_id']}-{size_id}"
        slug = f"{q['slug_base']}-{size_id}"
        title = f"{q['title_base']} ({size_label}) • {q['title_urdu']} ({size_urdu})"
        p = {
            'id': pid,
            'slug': slug,
            'title': title,
            'subtitle': f"{q['qualityTier']} • {size_label} ({q['region']})",
            'description': f"Fresh daily harvest {size_label} of {q['title_base']}. Harvested ethically from bio-secure aviaries in {q['region']}.",
            'eggType': q['eggType'],
            'packagingSize': size_id,
            'boxLabel': size_label,
            'qualityTier': q['qualityTier'],
            'breed': q['breed'],
            'coopOrigin': q['coopOrigin'],
            'region': q['region'],
            'dietInfo': q['dietInfo'],
            'yolkScore': q['yolkScore'],
            'batchCode': q['batchCode'],
            'layDate': 'Fresh Harvest Today',
            'expiryDays': 30 if q['eggType'] == 'white_farm' else 28,
            'price6Pack': q['prices']['6pack'],
            'price12Pack': q['prices']['12pack'],
            'price30Tray': q['prices']['30tray'],
            'stockQuantity': 50 if size_id == '6pack' else (70 if size_id == '12pack' else 40),
            'badges': [q['qualityTier'], size_label, 'Fresh Harvest'],
            'imageUrl': q['image'],
            'nutritionalFacts': {
                'proteinPerEgg': q['protein'],
                'calories': q['calories'],
                'omega3': q['omega3'],
                'cholesterol': q['cholesterol']
            },
            'isActive': True,
            'featured': True,
            'rating': q['rating'],
            'reviewCount': q['reviews'],
            'createdAt': '2026-11-01T08:00:00.000Z'
        }
        products.append(p)

print(f"Generated {len(products)} products.")

# Update data/local-db.json
with open('data/local-db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

db['products'] = products

with open('data/local-db.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Saved data/local-db.json.")

# Generate lib/data/products.ts
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

export const initialProducts: Product[] = {json.dumps(products, indent=2, ensure_ascii=False)};
"""

with open('lib/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Saved lib/data/products.ts.")
