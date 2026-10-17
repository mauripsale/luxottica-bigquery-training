variable "project_id" {
  type        = string
  description = "Google Cloud Project ID where IPSALE Engine v3.0 will be deployed"
}

variable "region" {
  type        = string
  description = "GCP Region for Cloud Run, Artifact Registry, and Firestore"
  default     = "us-central1"
}

variable "service_name" {
  type        = string
  description = "Name of the Cloud Run Service"
  default     = "ipsale-training-hub"
}

variable "bq_dataset_id" {
  type        = string
  description = "BigQuery dataset ID containing course training data"
  default     = "luxottica_marketing_analytics"
}

variable "google_client_id" {
  type        = string
  description = "Google OAuth 2.0 Web Client ID for authentication"
  default     = ""
}

variable "auth_required" {
  type        = bool
  description = "Enforce Google OAuth & Allowlist authentication on endpoints"
  default     = true
}

variable "allowed_domains" {
  type        = string
  description = "Comma-separated list of allowed email domains"
  default     = "luxottica.com,essilorluxottica.com,datatonic.com"
}

variable "allowed_emails" {
  type        = string
  description = "Comma-separated list of explicitly allowed email addresses"
  default     = ""
}

variable "trainer_emails" {
  type        = string
  description = "Comma-separated list of trainer email addresses with elevated control panel privileges"
  default     = "maurizio.ipsale@gmail.com"
}

variable "manager_emails" {
  type        = string
  description = "Comma-separated list of manager email addresses with administrative allowlist privileges"
  default     = "maurizio.ipsale@gmail.com"
}

variable "content_creator_emails" {
  type        = string
  description = "Comma-separated list of content creator email addresses with full administrative access"
  default     = "maurizio.ipsale@gmail.com"
}

variable "billing_account_id" {
  type        = string
  description = "Optional Billing Account ID for Spend Cap auto-pause configuration"
  default     = ""
}

variable "enable_spend_cap" {
  type        = bool
  description = "Enable automatic Spend Cap auto-pause budget trigger"
  default     = true
}

variable "monthly_budget_amount" {
  type        = number
  description = "Monthly budget cap in EUR/USD"
  default     = 10.0
}

variable "ipsa_static_ip" {
  type        = string
  description = "Reserved Static External IP mapped to ipsa.datatonic.team (DO NOT DESTROY)"
  default     = "34.111.146.153"
}
