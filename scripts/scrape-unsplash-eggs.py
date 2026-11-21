import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

urls = [
    'https://unsplash.com/s/photos/white-eggs',
    'https://unsplash.com/s/photos/brown-eggs',
    'https://unsplash.com/s/photos/eggs-in-carton',
    'https://unsplash.com/s/photos/eggs-tray',
    'https://unsplash.com/s/photos/fresh-eggs'
]

results = []
seen_urls = set()

for u in urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8')
            # Look for img tags with alt description containing egg
            # Pattern for img tags in Unsplash SSR markup
            tags = re.findall(r'<img[^>]+>', html)
            print(f"Scraped {u}: found {len(tags)} img tags")
            for tag in tags:
                alt_m = re.search(r'alt=["\']([^"\']*)["\']', tag)
                src_m = re.search(r'src=["\'](https://images\.unsplash\.com/photo-[^"\'\?]+)', tag)
                if alt_m and src_m:
                    alt = alt_m.group(1)
                    src = src_m.group(1)
                    if 'egg' in alt.lower() and src not in seen_urls:
                        # Avoid avatars or profile photos
                        if 'profile' not in src:
                            seen_urls.add(src)
                            results.append({'alt': alt, 'src': src})
    except Exception as ex:
        print(f"Error {u}: {ex}")

print(f"\nTotal verified egg images found: {len(results)}")
for i, r in enumerate(results[:25]):
    print(f"{i+1}. {r['alt'][:50]} -> {r['src']}")

with open('data/verified-unsplash-eggs.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
