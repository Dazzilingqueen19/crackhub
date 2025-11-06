import requests

def scrape_leetcode(limit=20):
    results = []
    try:
        # public problems listing (best-effort)
        url = 'https://leetcode.com/api/problems/all/'
        r = requests.get(url, timeout=12)
        data = r.json()
        for item in data.get('stat_status_pairs', [])[:limit]:
            title = item.get('stat', {}).get('question__title')
            if title:
                results.append({'title': title, 'source': 'LeetCode', 'url': None})
    except Exception as e:
        print('LeetCode scrape error', e)
    return results
