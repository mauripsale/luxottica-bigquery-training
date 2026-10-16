#!/usr/bin/env bash
# =============================================================================
# Luxottica Marketing Analytics - BigQuery Seeding Script
# Populates the 4 workshop tables (116,000+ realistic rows) into target project
# =============================================================================
set -euo pipefail

# 1. Determine Target Project ID
PROJECT_ID="${1:-${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}}"
DATASET_ID="${2:-${BQ_DATASET_ID:-luxottica_marketing_analytics}}"
LOCATION="${3:-US}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "❌ Error: Project ID not provided and could not be detected from gcloud."
  echo "Usage: $0 [PROJECT_ID] [DATASET_ID] [LOCATION]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/../dataset/00_setup_schema_and_data.sql"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "❌ Error: SQL schema file not found at $SQL_FILE"
  exit 1
fi

echo "================================================================="
echo " 🕶️  SEEDING LUXOTTICA BIGQUERY WORKSHOP DATASET"
echo "================================================================="
echo " Target Project: $PROJECT_ID"
echo " Target Dataset: $DATASET_ID"
echo " Location:       $LOCATION"
echo " Source SQL:     $SQL_FILE"
echo "-----------------------------------------------------------------"

# 2. Ensure Dataset Exists
echo "🔍 Checking dataset $DATASET_ID..."
if ! bq show --project_id="$PROJECT_ID" "$PROJECT_ID:$DATASET_ID" >/dev/null 2>&1; then
  echo "📦 Creating dataset $DATASET_ID in $PROJECT_ID ($LOCATION)..."
  bq --location="$LOCATION" mk --dataset --description="Dataset for Luxottica BigQuery & AI Workshop" "$PROJECT_ID:$DATASET_ID"
fi

# 3. Execute Seeding Queries
echo "🚀 Populating 4 tables (116,000+ rows)..."
# Substitute any project ID in the SQL file with the target project ID and execute
TEMP_SQL=$(mktemp)
sed "s/qwiklabs-asl-02-9bb3224716de/${PROJECT_ID}/g" "$SQL_FILE" > "$TEMP_SQL"

bq query \
  --use_legacy_sql=false \
  --project_id="$PROJECT_ID" \
  --location="$LOCATION" \
  < "$TEMP_SQL"

rm -f "$TEMP_SQL"

# 4. Verify Tables
echo ""
echo "✅ Seeding complete! Running smoke test..."
python3 "$SCRIPT_DIR/preflight_smoke_test.py" "$PROJECT_ID"

echo ""
echo "🎉 BigQuery dataset $PROJECT_ID.$DATASET_ID is 100% ready for students & trainer!"
