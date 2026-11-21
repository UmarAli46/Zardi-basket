import urllib.request
import os

os.makedirs('public/images/products', exist_ok=True)

test_urls = [
    ('wf-classic-6pack.jpg', 'https://upload.wikimedia.org/wikipedia/commons/1/12/6-Pack-Chicken-Eggs.jpg'),
    ('wf-classic-12pack.jpg', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1000&q=80'),
    ('wf-classic-30tray.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Tray_of_eggs_4.50.jpg'),
    ('yd-aseel-12pack.jpg', 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1000&q=80'),
    ('yd-aseel-30tray.jpg', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80'),
    ('yd-misri-12pack.jpg', 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=1000&q=80'),
]

headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in test_urls:
    target_path = os.path.join('public/images/products', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(target_path, 'wb') as f:
                f.write(resp.read())
        size_kb = os.path.getsize(target_path) / 1024
        print(f"Downloaded {name} ({size_kb:.1f} KB)")
    except Exception as e:
        print(f"Failed {name}: {e}")
