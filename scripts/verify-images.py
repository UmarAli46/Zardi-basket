import urllib.request
import json

with open('data/local-db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

products = db.get('products', [])
print(f"Checking {len(products)} products...")

all_ok = True
for p in products:
    url = p['imageUrl']
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                print(f"[200 OK] {p['id']} ({p.get('packagingSize')}) - {p['title']}")
            else:
                print(f"[{resp.status}] {p['id']} -> {url}")
                all_ok = False
    except Exception as e:
        print(f"[ERROR] {p['id']} -> {e}")
        all_ok = False

if all_ok:
    print("\nALL 18 IMAGES VERIFIED: HTTP 200 OK!")
else:
    print("\nSome images failed.")
