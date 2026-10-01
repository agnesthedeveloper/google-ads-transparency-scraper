// Google Ads Transparency Center Scraper - Node.js example
// Requires: Node 18+ (built-in fetch), APIFY_TOKEN env var
//
// Usage: node node.js [domain] [maxAds]
// Runs the actor, waits for it to finish, and prints every ad's dates, headline and link.

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
    console.error('Set APIFY_TOKEN env var. Get one at https://console.apify.com/account/integrations');
    process.exit(1);
}

const domain = process.argv[2] || 'nike.com';
const maxAdsPerAdvertiser = Number(process.argv[3] || 20);

const url = `https://api.apify.com/v2/acts/agnes.developer.queen~google-ads-transparency-scraper/run-sync-get-dataset-items?token=${TOKEN}&timeout=300`;

const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        domains: [domain],
        region: 'anywhere',
        maxAdsPerAdvertiser,
        proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
    }),
});

if (!response.ok) {
    console.error(`Apify API returned ${response.status}: ${await response.text()}`);
    process.exit(1);
}

const ads = await response.json();
console.log(`${ads.length} ads, ${ads.filter((ad) => ad.charged).length} charged`);
for (const ad of ads) {
    console.log(ad.firstShown, ad.lastShown, ad.format, ad.headline ?? '(picture only)', ad.transparencyUrl);
}
