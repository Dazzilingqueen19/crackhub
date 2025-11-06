import requests
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 CrackHub/1.0'}

def scrape_geeksforgeeks(url, limit=10):
    results = []
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        # primary selector: h2.entry-title a
        els = soup.select('h2.entry-title a')
        if not els:
            # fallback: h2 > a
            els = soup.select('h2 a')
        for a in els[:limit]:
            title = a.get_text(strip=True)
            if title:
                results.append({'title': title, 'source': 'GeeksforGeeks', 'url': a.get('href')})
    except Exception as e:
        print('GfG scrape error', url, e)
    return results
