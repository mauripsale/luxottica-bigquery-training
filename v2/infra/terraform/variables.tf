variable "project_id" {
  type        = string
  description = "Target Google Cloud / Qwiklabs Project ID"
  default     = "qwiklabs-asl-02-9bb3224716de"
}

variable "region" {
  type        = string
  description = "GCP Region for Cloud Run & Artifact Registry"
  default     = "us-central1"
}

variable "firestore_location" {
  type        = string
  description = "Location ID for Firestore Native database (nam5 for multi-region US)"
  default     = "nam5"
}

variable "bigquery_location" {
  type        = string
  description = "Location for BigQuery dataset"
  default     = "US"
}

variable "bigquery_dataset_id" {
  type        = string
  description = "ID of the BigQuery dataset used for student exercises and analytics"
  default     = "luxottica_marketing_analytics"
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name"
  default     = "luxottica-training-hub"
}
