#!/usr/bin/env bash
# =============================================================================
# Luxottica Training Hub - Turnkey 1-Click Redeployment Script
# Automates:
#   1. GCP APIs & Terraform Infrastructure (Firestore, SA, IAM, Artifact Registry, BigQuery)
#   2. BigQuery Data Seeding (116,000+ realistic workshop records)
#   3. Container Build & Cloud Run Serverless Deployment
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Parse optional arguments
TARGET_PROJECT="${1:-${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}}"
TARGET_REGION="${2:-us-central1}"

if [[ -z "$TARGET_PROJECT" ]]; then
  echo "❌ Error: Could not determine target GCP project ID."
  echo "Usage: $0 [PROJECT_ID] [REGION]"
  echo "Example: $0 qwiklabs-gcp-01-abcdef123456 us-central1"
  exit 1
fi

echo "================================================================="
echo " 🕶️  LUXOTTICA TRAINING HUB — REDEPLOY TO TARGET GCP PROJECT"
echo "================================================================="
echo " Target Project: $TARGET_PROJECT"
echo " Target Region:  $TARGET_REGION"
echo " Root Dir:       $ROOT_DIR"
echo "-----------------------------------------------------------------"

# Step 1: Initialize & Apply Terraform Infrastructure
echo ""
echo "🚀 [1/3] Provisioning GCP Infrastructure with Terraform..."
cd "$SCRIPT_DIR"

terraform init -upgrade

terraform apply -auto-approve \
  -var="project_id=$TARGET_PROJECT" \
  -var="region=$TARGET_REGION"

# Step 2: Seed BigQuery Dataset with Training Data
echo ""
echo "📦 [2/3] Seeding BigQuery Dataset ($TARGET_PROJECT.luxottica_marketing_analytics)..."
"$ROOT_DIR/scripts/seed_bigquery.sh" "$TARGET_PROJECT" "luxottica_marketing_analytics" "US"

# Step 3: Build & Deploy Cloud Run Service via Cloud Build
echo ""
echo "🚢 [3/3] Building Container & Deploying to Cloud Run..."
cd "$ROOT_DIR"

gcloud builds submit \
  --project="$TARGET_PROJECT" \
  --config="v2/cloudbuild.yaml" \
  .

# Step 4: Retrieve and Display Cloud Run Live URL
CLOUD_RUN_URL=$(gcloud run services describe luxottica-training-hub \
  --project="$TARGET_PROJECT" \
  --region="$TARGET_REGION" \
  --format="value(status.url)")

echo ""
echo "================================================================="
echo " 🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "================================================================="
echo " 📍 Student Hub URL:       $CLOUD_RUN_URL"
echo " 🎓 Trainer Console URL:   $CLOUD_RUN_URL?role=trainer"
echo " 📊 BigQuery Dataset:      $TARGET_PROJECT.luxottica_marketing_analytics"
echo " 🐳 Container Image:       $TARGET_REGION-docker.pkg.dev/$TARGET_PROJECT/training-hub/training-hub-app:latest"
echo "================================================================="
