# Create DNS zone and records for load balancer

# Local variables for computed values and consistent naming
locals {
  # Base name for all resources using environment prefix
  base_name = "${var.environment}-${var.environment_name}"
}

# Create a Cloud DNS managed zone
resource "google_dns_managed_zone" "dns_zone" {
  name        = "${local.base_name}-dns-zone"
  dns_name    = "${var.domain_name}."
  description = "DNS zone for ${local.base_name} load balancer"
  project     = var.project_id

  # Enable DNSSEC for security
  dnssec_config {
    state = "on"
  }

  # Enable Cloud Logging for DNS queries
  cloud_logging_config {
    enable_logging = true
  }
}

# Create A record pointing to the load balancer IP
resource "google_dns_record_set" "a_record" {
  name         = "${var.domain_name}."
  managed_zone = google_dns_managed_zone.dns_zone.name
  type         = "A"
  ttl          = 300
  project      = var.project_id

  rrdatas = [var.load_balancer_ip_address]
}

# Create A record for www subdomain (if enabled)
resource "google_dns_record_set" "www_a_record" {
  count        = var.create_www_record ? 1 : 0
  name         = "www.${var.domain_name}."
  managed_zone = google_dns_managed_zone.dns_zone.name
  type         = "A"
  ttl          = 300
  project      = var.project_id

  rrdatas = [var.load_balancer_ip_address]
}

# Create CNAME record for www subdomain (alternative to A record)
resource "google_dns_record_set" "www_cname_record" {
  count        = var.create_www_cname_record ? 1 : 0
  name         = "www.${var.domain_name}."
  managed_zone = google_dns_managed_zone.dns_zone.name
  type         = "CNAME"
  ttl          = 300
  project      = var.project_id

  rrdatas = ["${var.domain_name}."]
}

# Create additional A records for subdomains if specified
resource "google_dns_record_set" "subdomain_a_records" {
  for_each = toset(var.subdomain_names)

  name         = "${each.value}.${var.domain_name}."
  managed_zone = google_dns_managed_zone.dns_zone.name
  type         = "A"
  ttl          = 300
  project      = var.project_id

  rrdatas = [var.load_balancer_ip_address]
} 