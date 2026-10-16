output "project_id" {
  description = "Configured GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

output "artifact_registry_repo" {
  description = "Docker Repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.hub_repo.repository_id}"
}

output "service_account_email" {
  description = "Cloud Run Backend Service Account Email"
  value       = google_service_account.training_hub_sa.email
}

output "bigquery_dataset" {
  description = "BigQuery Training Dataset"
  value       = "${var.project_id}.${google_bigquery_dataset.marketing_analytics.dataset_id}"
}

output "next_steps" {
  description = "Next deployment steps to build and launch Cloud Run"
  value       = "Run './deploy.sh' or 'gcloud builds submit --config=v2/cloudbuild.yaml .' to build and deploy the application container."
}
