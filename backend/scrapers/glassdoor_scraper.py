import requests
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 CrackHub/1.0'}

def scrape_glassdoor(url, limit=10):
    results = []
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        # Glassdoor’s structure varies; try to get anchor text mentioning 'Interview'
        for a in soup.find_all('a'):
            txt = a.get_text(strip=True)
            if 'Interview' in txt or 'interview' in txt:
                results.append({'title': txt, 'source': 'Glassdoor', 'url': a.get('href')})
            if len(results) >= limit:
                break
    except Exception as e:
        print('Glassdoor scrape error', e)
    return results
