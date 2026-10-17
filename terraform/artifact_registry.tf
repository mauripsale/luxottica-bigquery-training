# Artifact Registry Docker Repository
resource "google_artifact_registry_repository" "ipsale_repo" {
  location      = var.region
  repository_id = "ipsale-containers"
  description   = "Docker container images for IPSALE Engine v3.0"
  format        = "DOCKER"
  project       = var.project_id

  depends_on = [
    google_project_service.required_services["artifactregistry.googleapis.com"]
  ]
}
