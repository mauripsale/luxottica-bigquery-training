data "google_project" "current" {
  project_id = var.project_id
}

# 1. Service Account for Training Hub Backend
resource "google_service_account" "training_hub_sa" {
  account_id   = "training-hub-backend-sa"
  display_name = "Luxottica Training Hub Cloud Run SA"
}

# 2. IAM Roles for Backend Service Account (Least Privilege)
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

# 3. Cloud Build Permissions to Deploy Cloud Run Service & Impersonate SA
resource "google_project_iam_member" "cloudbuild_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"

  depends_on = [google_project_service.apis]
}

resource "google_service_account_iam_member" "cloudbuild_sa_user" {
  service_account_id = google_service_account.training_hub_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}
