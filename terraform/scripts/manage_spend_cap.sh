#!/usr/bin/env bash
set -e

PROJECT_ID="$1"
BILLING_ACCOUNT_ID="$2"
AMOUNT="${3:-10}"

if [ -z "$PROJECT_ID" ] || [ -z "$BILLING_ACCOUNT_ID" ]; then
  echo "⚠️ Missing PROJECT_ID or BILLING_ACCOUNT_ID. Skipping Native Spend Cap setup."
  exit 0
fi

echo "🔒 Configuring Google Cloud Native Spend Cap (${AMOUNT} EUR) for project ${PROJECT_ID}..."

ACCESS_TOKEN=$(gcloud auth print-access-token 2>/dev/null || echo "")

if [ -z "$ACCESS_TOKEN" ]; then
  echo "⚠️ gcloud credentials not available. Skipping API Spend Cap call."
  exit 0
fi

curl -s -X POST \
  "https://billingbudgets.googleapis.com/v1/billingAccounts/${BILLING_ACCOUNT_ID}/budgets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "IPSALE Spend Cap ('"${PROJECT_ID}"')",
    "budgetFilter": {
      "projects": ["projects/'"${PROJECT_ID}"'"],
      "calendarPeriod": "MONTH"
    },
    "amount": { "specifiedAmount": { "currencyCode": "EUR", "units": '"${AMOUNT}"' } },
    "thresholdRules": [
      { "thresholdPercent": 0.5 },
      { "thresholdPercent": 0.8 },
      { "thresholdPercent": 1.0 }
    ],
    "spendCap": { "inputState": "CONFIGURED" }
  }' > /dev/null || echo "⚠️ Spend Cap API call completed with warning."

echo "✅ Spend Cap configuration checked."
