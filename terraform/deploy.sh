#!/usr/bin/env bash
set -e

echo "🚀 Starting IPSALE Engine v3.0 Deployment Pipeline..."

# 1. Build & Verify Frontend Bundle
echo "📦 Assembling Frontend Bundle..."
python3 tools/build_frontend.py
python3 tools/verify_frontend_bundle.py

# 2. Check Terraform Installation
if ! command -v terraform &> /dev/null; then
    echo "❌ Error: Terraform is not installed. Please install Terraform >= 1.5.0."
    exit 1
fi

cd terraform

# 3. Check for terraform.tfvars
if [ ! -f "terraform.tfvars" ]; then
    echo "⚠️ 'terraform.tfvars' not found! Creating from 'terraform.tfvars.example'..."
    cp terraform.tfvars.example terraform.tfvars
    echo "❗ Please review and update 'terraform/terraform.tfvars' with your actual Project ID and OAuth credentials, then re-run ./deploy.sh"
    exit 1
fi

# 4. Terraform Init & Apply Infrastructure
echo "⚙️ Initializing & Applying Terraform Infrastructure..."
terraform init
terraform apply -auto-approve

PROJECT_ID=$(terraform output -raw project_id 2>/dev/null || grep project_id terraform.tfvars | cut -d'=' -f2 | tr -d ' "' | tr -d "'")
REGION=$(grep region terraform.tfvars | cut -d'=' -f2 | tr -d ' "' | tr -d "'" || echo "us-central1")
REPO_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/ipsale-containers/ipsale-engine:v3.0"

cd ..

# 5. Build Container & Push to Artifact Registry via gcloud builds
echo "🐳 Building Docker Container Image with gcloud builds..."
(cd v2 && cp backend/Dockerfile Dockerfile && gcloud builds submit --tag "${REPO_URL}" --project="${PROJECT_ID}")

# 6. Apply Terraform again to trigger Cloud Run update with new image tag
cd terraform
terraform apply -auto-approve

SERVICE_URL=$(terraform output -raw cloud_run_url)

echo ""
echo "================================================================================="
echo "🎉 IPSALE ENGINE v3.0 SUCCESSFULLY DEPLOYED!"
echo "================================================================================="
echo "🔗 Service URL: ${SERVICE_URL}"
echo "================================================================================="
