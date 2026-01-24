import requests
import random
from bs4 import BeautifulSoup
from pathlib import Path

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
]

def debug_search():
    query = "BLANGTON'S SINGLE BARREL bottle official photo"
    url = f"https://www.google.com/search?q={query}&tbm=isch&udm=2"
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        images = soup.find_all('img')
        print(f"Found {len(images)} images")
        
        for i, img in enumerate(images[:20]):
            src = img.get('src', '')
            print(f"Img {i}: src={src[:50]}...")
            
        debug_file = Path('c:/k-spirits-club-hub/debug_search.html')
        with open(debug_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"Saved to {debug_file}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_search()
