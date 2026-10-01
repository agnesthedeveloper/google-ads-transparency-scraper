"""Google Ads Transparency Center Scraper - Python example.

Requires: requests, APIFY_TOKEN env var.
    pip install requests

Usage: python python.py [domain] [maxAds]
Runs the actor, waits for it to finish, and prints every ad's dates, headline and link.
"""

import os
import sys

import requests

TOKEN = os.environ.get('APIFY_TOKEN')
if not TOKEN:
    print('Set APIFY_TOKEN env var. Get one at https://console.apify.com/account/integrations')
    sys.exit(1)

domain = sys.argv[1] if len(sys.argv) > 1 else 'nike.com'
max_ads = int(sys.argv[2]) if len(sys.argv) > 2 else 20

url = (
    'https://api.apify.com/v2/acts/agnes.developer.queen~google-ads-transparency-scraper'
    f'/run-sync-get-dataset-items?token={TOKEN}&timeout=300'
)

run_input = {
    'domains': [domain],
    'region': 'anywhere',
    'maxAdsPerAdvertiser': max_ads,
    'proxyConfiguration': {'useApifyProxy': True, 'apifyProxyGroups': ['RESIDENTIAL']},
}

response = requests.post(url, json=run_input, timeout=330)
response.raise_for_status()
ads = response.json()

print(f"{len(ads)} ads, {sum(1 for ad in ads if ad.get('charged'))} charged")
for ad in ads:
    print(ad['firstShown'], ad['lastShown'], ad['format'], ad.get('headline') or '(picture only)', ad['transparencyUrl'])
