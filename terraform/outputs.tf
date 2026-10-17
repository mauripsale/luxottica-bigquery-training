output "cloud_run_url" {
  description = "The public URL of the deployed IPSALE Engine Cloud Run service"
  value       = google_cloud_run_v2_service.ipsale_service.uri
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository path"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.ipsale_repo.repository_id}"
}

output "service_account_email" {
  description = "Email of the dedicated Cloud Run Service Account"
  value       = google_service_account.ipsale_sa.email
}

output "static_ip_address" {
  description = "Reserved Global Static IP mapped to ipsa.datatonic.team"
  value       = google_compute_global_address.ipsa_static_ip.address
}

output "post_deploy_instructions" {
  description = "Steps to perform after Terraform deployment"
  value       = <<EOF
🎉 IPSALE Engine v3.0 successfully provisioned!

Next steps:
1. Add the Cloud Run Service URL (${google_cloud_run_v2_service.ipsale_service.uri}) to Google Cloud Console:
   APIs & Services -> Credentials -> OAuth 2.0 Client IDs -> Authorized JavaScript Origins / Redirect URIs.
2. Open the Cloud Run URL in your browser to verify the interactive platform.
EOF
}
