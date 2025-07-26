output "vpc_network" {
  description = "The VPC network name"
  value       = google_compute_network.vpc.name
}

output "vpc_network_id" {
  description = "The VPC network ID"
  value       = google_compute_network.vpc.id
}

output "vpc_connector_name" {
  description = "The full path of the VPC connector"
  value       = "projects/${var.project_id}/locations/${var.region}/connectors/${google_vpc_access_connector.connector.name}"
}

output "private_vpc_connection" {
  description = "The Service Networking Connection"
  value       = google_service_networking_connection.private_vpc_connection
} 