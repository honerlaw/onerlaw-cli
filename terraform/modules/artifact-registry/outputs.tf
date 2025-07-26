output "name" {
  description = "The name of the Artifact Registry repository"
  value       = google_artifact_registry_repository.repository.name
}

output "location" {
  description = "The location of the Artifact Registry repository"
  value       = google_artifact_registry_repository.repository.location
}

output "repository_id" {
  description = "The repository ID of the Artifact Registry"
  value       = google_artifact_registry_repository.repository.repository_id
}

output "registry_url" {
  description = "The URL of the Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.registry_name}"
}

output "service_account_email" {
  description = "The email of the service account for registry access"
  value       = google_service_account.registry_sa.email
}

output "service_account_key" {
  description = "The service account key for authentication (sensitive)"
  value       = google_service_account_key.registry_key.private_key
  sensitive   = true
} 