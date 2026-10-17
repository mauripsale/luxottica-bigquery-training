# Firestore Native Database for Session State & Allowlist Persistence
resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  deletion_policy = "ABANDON"

  depends_on = [
    google_project_service.required_services["firestore.googleapis.com"]
  ]
}
