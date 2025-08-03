# Outputs for the load balancer module

output "ip_address" {
  description = "The global IP address of the load balancer"
  value       = google_compute_global_address.lb_ip.address
}

output "forwarding_rule_name" {
  description = "The name of the HTTPS forwarding rule"
  value       = google_compute_global_forwarding_rule.lb_forwarding_rule.name
}

output "url_map_name" {
  description = "The name of the URL map"
  value       = google_compute_url_map.lb_url_map.name
}

output "backend_service_name" {
  description = "The name of the backend service"
  value       = google_compute_backend_service.lb_backend.name
}

output "neg_name" {
  description = "The name of the Network Endpoint Group"
  value       = google_compute_region_network_endpoint_group.lb_neg.name
}

output "ssl_certificate_name" {
  description = "The name of the managed SSL certificate"
  value       = google_compute_managed_ssl_certificate.lb_ssl_cert.name
}

output "base_name" {
  description = "The base name used for all resources in this module"
  value       = "${var.environment}-${var.environment_name}"
} 