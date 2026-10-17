# Cloud Run Gen2 Service for IPSALE Engine v3.0
resource "google_cloud_run_v2_service" "ipsale_service" {
  name     = var.service_name
  location = var.region
  project  = var.project_id
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.ipsale_sa.email

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.ipsale_repo.repository_id}/ipsale-engine:v3.0"

      resources {
        limits = {
          cpu    = "1000m"
          memory = "1024Mi"
        }
        cpu_idle = true
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "BQ_DATASET_ID"
        value = var.bq_dataset_id
      }

      env {
        name  = "GOOGLE_CLIENT_ID"
        value = var.google_client_id
      }

      env {
        name  = "AUTH_REQUIRED"
        value = var.auth_required ? "true" : "false"
      }

      env {
        name  = "ALLOWED_DOMAINS"
        value = var.allowed_domains
      }

      env {
        name  = "ALLOWED_EMAILS"
        value = var.allowed_emails
      }

      env {
        name  = "TRAINER_EMAILS"
        value = var.trainer_emails
      }

      env {
        name  = "MANAGER_EMAILS"
        value = var.manager_emails
      }

      env {
        name  = "CONTENT_CREATOR_EMAILS"
        value = var.content_creator_emails
      }

      ports {
        container_port = 8080
      }
    }
  }

  depends_on = [
    google_project_service.required_services["run.googleapis.com"],
    google_firestore_database.default
  ]
}

# Allow unauthenticated HTTP access (Authentication managed at Application Level via Google OAuth 2.0 & Allowlist)
resource "google_cloud_run_service_iam_binding" "public_access" {
  location = google_cloud_run_v2_service.ipsale_service.location
  project  = google_cloud_run_v2_service.ipsale_service.project
  service  = google_cloud_run_v2_service.ipsale_service.name
  role     = "roles/run.invoker"

  members = [
    "allUsers"
  ]
}

# Protected Static IP Resource Mapping for ipsa.datatonic.team
resource "google_compute_global_address" "ipsa_static_ip" {
  name         = "ipsa-static-ip"
  project      = var.project_id
  address_type = "EXTERNAL"
  address      = var.ipsa_static_ip

  lifecycle {
    prevent_destroy = true
  }
}
