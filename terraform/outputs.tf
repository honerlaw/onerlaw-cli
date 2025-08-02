output "cloud_run_service_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = module.cloud_run.service_url
}

output "cloud_run_service_name" {
  description = "The name of the Cloud Run service"
  value       = module.cloud_run.service_name
}

output "database_instance_name" {
  description = "The name of the Cloud SQL instance"
  value       = local.cloud_sql_enabled ? module.cloud_sql[0].instance_name : null
}

output "database_instance_connection_name" {
  description = "The connection name of the Cloud SQL instance"
  value       = local.cloud_sql_enabled ? module.cloud_sql[0].instance_connection_name : null
}

output "vpc_connector_name" {
  description = "The full path of the VPC connector"
  value       = module.networking.vpc_connector_name
}

output "database_name" {
  description = "The name of the database"
  value       = local.cloud_sql_enabled ? module.cloud_sql[0].database_name : null
}

output "database_password_secret_name" {
  description = "The name of the Secret Manager secret containing the database password"
  value       = local.cloud_sql_enabled ? module.cloud_sql[0].database_password_secret_name : null
}

output "artifact_registry_location" {
  description = "The location of the Artifact Registry"
  value       = module.artifact_registry.location
}

output "artifact_registry_name" {
  description = "The name of the Artifact Registry"
  value       = module.artifact_registry.name
}

output "artifact_registry_repository_id" {
  description = "The repository ID of the Artifact Registry"
  value       = module.artifact_registry.repository_id
}

output "terraform_backend_service_account" {
  description = "The service account email for Terraform backend access"
  value       = google_service_account.terraform_backend.email
}

output "terraform_backend_key" {
  description = "The service account key for Terraform backend authentication (sensitive)"
  value       = google_service_account_key.terraform_backend_key.private_key
  sensitive   = true
} 