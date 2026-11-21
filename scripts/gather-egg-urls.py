import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0'}
queries = [
    'brown eggs in carton',
    'white eggs in carton',
    'chicken eggs carton',
    'eggs in tray',
    'egg tray carton',
    'fresh chicken eggs'
]

results = []
seen = set()

for q in queries:
    url = f'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url&format=json'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                info = (p.get('imageinfo') or [{}])[0]
                u_full = info.get('url', '')
                u = u_full.split('?')[0] if u_full else ''
                if u and u.lower().endswith(('.jpg', '.jpeg', '.png')) and u not in seen:
                    if 'logo' not in title.lower() and 'icon' not in title.lower() and 'diagram' not in title.lower():
                        seen.add(u)
                        results.append({'query': q, 'title': title, 'url': u})
    except Exception as e:
        print('Error', q, e)

print(f"Found {len(results)} image candidates:")
for i, r in enumerate(results):
    print(f"{i+1}. {r['title']} -> {r['url']}")

with open('data/wiki-egg-images.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
