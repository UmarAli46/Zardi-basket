import urllib.request
import os

candidates = [
    ('unsplash-01.jpg', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-02.jpg', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-03.jpg', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-04.jpg', 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-05.jpg', 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-06.jpg', 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-07.jpg', 'https://images.unsplash.com/photo-1491925432139-be6843d1dfbf?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-08.jpg', 'https://images.unsplash.com/photo-1660224286794-fc173fa9295c?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-09.jpg', 'https://images.unsplash.com/photo-1658194171243-10f8f502b775?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-10.jpg', 'https://images.unsplash.com/photo-1575786647260-baddb8af504a?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-11.jpg', 'https://images.unsplash.com/photo-1736994113278-857f11aa92ae?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-12.jpg', 'https://images.unsplash.com/photo-1718042245788-78c199683e7f?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-13.jpg', 'https://images.unsplash.com/photo-1635223635662-a30d05836747?auto=format&fit=crop&w=800&q=80'),
    ('unsplash-14.jpg', 'https://images.unsplash.com/photo-1685552285979-ec5e04a4efa1?auto=format&fit=crop&w=800&q=80'),
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
