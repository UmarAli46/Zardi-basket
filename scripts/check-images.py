import json

db = json.load(open('data/local-db.json', encoding='utf-8'))
for p in db['products']:
    print(f"{p['id']} [{p['eggType']}] [{p['packagingSize']}]: {p['imageUrl']}")
