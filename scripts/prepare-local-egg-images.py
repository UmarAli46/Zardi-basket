import shutil
import os

source_map = {
    'wf-classic-6pack.jpg': 'public/images/products/wf-classic-6pack.jpg',
    'wf-classic-12pack.jpg': 'public/images/products/wf-classic-12pack.jpg',
    'wf-classic-30tray.jpg': 'public/images/products/unsplash-10.jpg',
    'wf-leghorn-6pack.jpg': 'public/images/products/six-white-01.jpg',
    'wf-leghorn-12pack.jpg': 'public/images/products/white-02.jpg',
    'wf-leghorn-30tray.jpg': 'public/images/products/unsplash-12.jpg',
    'wf-enriched-6pack.jpg': 'public/images/products/white-03.jpg',
    'wf-enriched-12pack.jpg': 'public/images/products/white-04.jpg',
    'wf-enriched-30tray.jpg': 'public/images/products/white-01.jpg',

    'yd-aseel-6pack.jpg': 'public/images/products/six-brown-01.jpg',
    'yd-aseel-12pack.jpg': 'public/images/products/unsplash-01.jpg',
    'yd-aseel-30tray.jpg': 'public/images/products/unsplash-03.jpg',
    'yd-misri-6pack.jpg': 'public/images/products/six-carton-03.jpg',
    'yd-misri-12pack.jpg': 'public/images/products/unsplash-08.jpg',
    'yd-misri-30tray.jpg': 'public/images/products/unsplash-11.jpg',
    'yd-heritage-6pack.jpg': 'public/images/products/six-carton-02.jpg',
    'yd-heritage-12pack.jpg': 'public/images/products/unsplash-06.jpg',
    'yd-heritage-30tray.jpg': 'public/images/products/unsplash-04.jpg',
}

dest_dir = 'public/images/products'
os.makedirs(dest_dir, exist_ok=True)

print("Preparing 18 clean egg product images...")
for dest_name, src_path in source_map.items():
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.abspath(src_path) != os.path.abspath(dest_path):
        shutil.copyfile(src_path, dest_path)
    size_kb = os.path.getsize(dest_path) / 1024
    print(f"  [OK] /images/products/{dest_name} ({size_kb:.1f} KB)")

print("\nAll 18 product images successfully verified on disk!")
