import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
queries = ['white eggs carton', 'white eggs', 'brown eggs carton', 'brown eggs', 'eggs tray']

candidates = []

for q in queries:
    url = f'https://unsplash.com/napi/search/photos?query={urllib.parse.quote(q)}&per_page=20'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('results', [])
            print(f"Query: '{q}' -> {len(results)} results")
            for r in results:
                desc = (r.get('alt_description') or r.get('description') or '').lower()
                photo_id = r.get('id')
                regular_url = r.get('urls', {}).get('regular')
                # Filter for egg-related descriptions
                if 'egg' in desc:
                    candidates.append({
                        'query': q,
                        'id': photo_id,
                        'desc': desc,
                        'url': regular_url
                    })
    except Exception as e:
        print(f"Error searching '{q}': {e}")

print(f"\nTotal egg candidates found: {len(candidates)}")
with open('data/egg-candidates.json', 'w', encoding='utf-8') as f:
    json.dump(candidates, f, indent=2)
print("Saved to data/egg-candidates.json")
