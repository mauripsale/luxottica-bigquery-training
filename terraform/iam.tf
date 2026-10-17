# Dedicated Least-Privilege Service Account for IPSALE Engine Cloud Run
resource "google_service_account" "ipsale_sa" {
  account_id   = "ipsale-runner"
  display_name = "IPSALE Engine Cloud Run Execution Runner"
  description  = "Service account used by Cloud Run to interact with Firestore, BigQuery, and Secret Manager"
  project      = var.project_id
}

# IAM Role Bindings for IPSALE Service Account
resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.ipsale_sa.email}"
}

resource "google_project_iam_member" "bigquery_job_user" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.ipsale_sa.email}"
}

resource "google_project_iam_member" "bigquery_data_viewer" {
  project = var.project_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.ipsale_sa.email}"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.ipsale_sa.email}"
}
