import urllib.request
import os

candidates = [
    ('six-white-01.jpg', 'https://images.unsplash.com/photo-1519077294537-9bc099d3ae6c?auto=format&fit=crop&w=800&q=80'),
    ('six-brown-01.jpg', 'https://images.unsplash.com/photo-1502630039397-c104a63cc224?auto=format&fit=crop&w=800&q=80'),
    ('six-carton-02.jpg', 'https://images.unsplash.com/photo-1529589776585-089471c85ff2?auto=format&fit=crop&w=800&q=80'),
    ('six-carton-03.jpg', 'https://images.unsplash.com/photo-1702819316778-ef58d48dd2a3?auto=format&fit=crop&w=800&q=80'),
]

headers = {'User-Agent': 'Mozilla/5.0'}
os.makedirs('public/images/products', exist_ok=True)

for name, url in candidates:
    target = os.path.join('public/images/products', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            with open(target, 'wb') as f:
                f.write(resp.read())
        size = os.path.getsize(target) / 1024
        print(f"OK: {name} ({size:.1f} KB)")
    except Exception as e:
        print(f"FAILED: {name} -> {e}")
