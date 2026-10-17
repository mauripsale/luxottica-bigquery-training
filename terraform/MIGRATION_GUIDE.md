# 🗺️ IPSALE Engine v3.0 — GCP Project Migration Guide

This guide details the exact step-by-step procedure for migrating or deploying **IPSALE Engine v3.0** to a **new Google Cloud Platform (GCP) Project**.

---

## 📋 Step 1: Target Project Prerequisites

Before executing Terraform, ensure you have:
1. **GCP Project Created**: Note your new `PROJECT_ID` (e.g., `my-new-ipsale-project`).
2. **Billing Account Attached**: Ensure billing is enabled for the new project.
3. **Owner / Editor Permissions**: Ensure your IAM user or service account has `roles/owner` or `roles/editor` + `roles/resourcemanager.projectIamAdmin` on the target project.
4. **`gcloud` CLI Authenticated**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project <NEW_PROJECT_ID>
   ```

---

## 🔑 Step 2: Configure Google OAuth 2.0 Client ID

In order for Google OAuth 2.0 & Allowlist authentication to work in the new project:
1. Navigate to **Google Cloud Console** -> **APIs & Services** -> **OAuth consent screen**.
2. Select **Internal** (for corporate domain) or **External**, enter the App Name (`IPSALE Training Hub`), User Support Email, and Developer Contact.
3. Navigate to **APIs & Services** -> **Credentials** -> **Create Credentials** -> **OAuth client ID**.
4. Select **Web application**.
5. Note the generated **Client ID** (e.g., `1234567890-xyz.apps.googleusercontent.com`).

---

## ⚙️ Step 3: Configure Terraform Variables

1. Navigate to the `terraform/` directory:
   ```bash
   cd terraform
   ```
2. Copy `terraform.tfvars.example` to `terraform.tfvars`:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
3. Edit `terraform.tfvars` with your new project details:
   ```hcl
   project_id             = "my-new-ipsale-project"
   region                 = "us-central1"
   service_name           = "ipsale-training-hub"
   bq_dataset_id          = "luxottica_marketing_analytics"
   google_client_id       = "1234567890-xyz.apps.googleusercontent.com"
   auth_required          = true
   allowed_domains        = "luxottica.com,essilorluxottica.com,datatonic.com"
   trainer_emails         = "your.email@domain.com"
   manager_emails         = "your.email@domain.com"
   content_creator_emails = "your.email@domain.com"
   monthly_budget_amount  = 10.0
   ```

---

## 🚀 Step 4: Provision Infrastructure & Deploy

Run the automated one-click deployment pipeline from the project root:

```bash
cd ..
./terraform/deploy.sh
```

The script will automatically:
1. Recompile and verify the 40-module frontend bundle (`tools/build_frontend.py`).
2. Run `terraform init` and `terraform apply` to enable GCP APIs, create the dedicated Service Account, Artifact Registry, Firestore database, and Cloud Run service.
3. Build the Docker container image using `gcloud builds` and push it to Artifact Registry.
4. Deploy the Cloud Run Gen2 container service.
5. Output the public Cloud Run Service URL.

---

## 🌐 Step 5: Authorize Domain & Update OAuth Client

Once you have the new Cloud Run Service URL (e.g., `https://ipsale-training-hub-xyz-uc.a.run.app`):

1. Go back to **Google Cloud Console** -> **APIs & Services** -> **Credentials** -> Your OAuth 2.0 Web Client.
2. Under **Authorized JavaScript origins**, add:
   - `https://ipsale-training-hub-xyz-uc.a.run.app`
   - `https://ipsa.datatonic.team` (if using custom domain)
3. Save changes.

---

## 🔒 Step 6: Static IP & Custom Domain (Important Security Rule)

> [!IMPORTANT]
> The static IP address `34.111.146.153` is mapped to `ipsa.datatonic.team`. The Terraform configuration protects this resource with `prevent_destroy = true`.
> If migrating the DNS mapping to the new Cloud Run service, attach a Cloud Load Balancer or Serverless Network Endpoint Group (NEG) pointing to the new Cloud Run service while preserving the IP address.

---

## ✅ Step 7: Post-Migration Verification

Run the verification test suite against the new backend:
```bash
./v2/backend/.venv/bin/python scratch/test_v3_backend.py
```

Expected result:
```text
🎉 ALL BACKEND HARDENING & SECURITY TESTS PASSED PERFECTLY!
```
