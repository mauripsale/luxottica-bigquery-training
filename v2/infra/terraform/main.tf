terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "GCP Project ID"
  default     = "qwiklabs-gcp-04-9efaa47f1d21"
}

variable "region" {
  type        = string
  description = "GCP Region for Cloud Run & Firestore"
  default     = "europe-west1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Enable Required GCP APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "cloudbuild.googleapis.com",
    "bigquery.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# 2. Firestore Database (Native mode)
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.apis]
}

# 3. Service Account for Training Hub Backend
resource "google_service_account" "training_hub_sa" {
  account_id   = "training-hub-backend-sa"
  display_name = "Luxottica Training Hub Cloud Run SA"
}

# 4. IAM Roles for Service Account (Least Privilege)
resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.training_hub_sa.email}"
}

resource "google_project_iam_member" "bigquery_viewer" {
  project = var.project_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.training_hub_sa.email}"
}

resource "google_project_iam_member" "bigquery_job_user" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.training_hub_sa.email}"
}
