#!/usr/bin/env bash
# Google Ads Transparency Center Scraper - curl example
# Requires: APIFY_TOKEN env var, jq
#
# Usage: ./curl.sh [domain] [maxAds]
# Runs the actor, waits for it to finish, and prints the first ad.

set -euo pipefail

if [ -z "${APIFY_TOKEN:-}" ]; then
    echo "Set APIFY_TOKEN env var first. Get one at https://console.apify.com/account/integrations"
    exit 1
fi

DOMAIN="${1:-nike.com}"
MAX_ADS="${2:-20}"

curl -s -X POST \
    "https://api.apify.com/v2/acts/agnes.developer.queen~google-ads-transparency-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300" \
    -H "Content-Type: application/json" \
    -d "{
        \"domains\": [\"${DOMAIN}\"],
        \"region\": \"anywhere\",
        \"maxAdsPerAdvertiser\": ${MAX_ADS},
        \"proxyConfiguration\": {\"useApifyProxy\": true, \"apifyProxyGroups\": [\"RESIDENTIAL\"]}
    }" \
    | jq '.[0]'
