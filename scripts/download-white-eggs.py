import urllib.request
import os

candidates = [
    ('white-01.jpg', 'https://images.unsplash.com/photo-1758450286526-2d1588a6f322?auto=format&fit=crop&w=800&q=80'),
    ('white-02.jpg', 'https://images.unsplash.com/photo-1589928183476-89aa0fdd30d0?auto=format&fit=crop&w=800&q=80'),
    ('white-03.jpg', 'https://images.unsplash.com/photo-1713176679770-1ab32be3fb38?auto=format&fit=crop&w=800&q=80'),
    ('white-04.jpg', 'https://images.unsplash.com/photo-1713176679404-f46214c5b347?auto=format&fit=crop&w=800&q=80'),
    ('white-05.jpg', 'https://images.unsplash.com/photo-1634598467550-444d5743cc20?auto=format&fit=crop&w=800&q=80'),
    ('white-06.jpg', 'https://images.unsplash.com/photo-1713176679386-fc0ad35e56f8?auto=format&fit=crop&w=800&q=80'),
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
