# Outputs for the DNS module

output "dns_zone_name" {
  description = "The name of the DNS managed zone"
  value       = google_dns_managed_zone.dns_zone.name
}

output "dns_zone_dns_name" {
  description = "The DNS name of the managed zone"
  value       = google_dns_managed_zone.dns_zone.dns_name
}

output "name_servers" {
  description = "The list of name servers for the DNS zone"
  value       = google_dns_managed_zone.dns_zone.name_servers
}

output "primary_domain_a_record" {
  description = "The A record for the primary domain"
  value       = google_dns_record_set.a_record.name
}

output "www_a_record" {
  description = "The A record for www subdomain (if created)"
  value       = var.create_www_record ? google_dns_record_set.www_a_record[0].name : null
}

output "www_cname_record" {
  description = "The CNAME record for www subdomain (if created)"
  value       = var.create_www_cname_record ? google_dns_record_set.www_cname_record[0].name : null
}

output "additional_subdomain_records" {
  description = "The A records for additional subdomains"
  value       = [for record in google_dns_record_set.subdomain_a_records : record.name]
}

output "base_name" {
  description = "The base name used for all resources in this module"
  value       = "${var.environment}-${var.environment_name}"
} 