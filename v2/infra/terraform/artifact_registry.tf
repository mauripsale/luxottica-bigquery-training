# Artifact Registry Repository for Docker Images
resource "google_artifact_registry_repository" "hub_repo" {
  project       = var.project_id
  location      = var.region
  repository_id = "training-hub"
  description   = "Docker repository for Luxottica Training Hub"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}
