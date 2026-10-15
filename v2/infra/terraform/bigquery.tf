# BigQuery Dataset for Workshop & Student Validation
resource "google_bigquery_dataset" "marketing_analytics" {
  dataset_id                  = var.bigquery_dataset_id
  friendly_name               = "Luxottica Marketing Analytics"
  description                 = "Dataset for Luxottica BigQuery & AI Workshop"
  location                    = var.bigquery_location
  default_table_expiration_ms = null

  depends_on = [google_project_service.apis]
}
