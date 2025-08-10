# Create a global external Application Load Balancer for Cloud Run

# Local variables for computed values and consistent naming
locals {
  # Base name for all resources using environment prefix
  base_name = "${var.environment}-${var.environment_name}"
}

# Reserve a global IP address for the load balancer
resource "google_compute_global_address" "lb_ip" {
  name         = "${local.base_name}-lb-ip"
  project      = var.project_id
  address_type = "EXTERNAL"
  description  = "Global IP address for ${local.base_name} load balancer"
}

# Create HTTPS forwarding rule for secure traffic
resource "google_compute_global_forwarding_rule" "lb_forwarding_rule" {
  name                  = "${local.base_name}-lb-forwarding-rule"
  project               = var.project_id
  target                = google_compute_target_https_proxy.lb_https_proxy.id
  port_range            = "443"
  ip_address            = google_compute_global_address.lb_ip.address
  load_balancing_scheme = "EXTERNAL"
}

# Create HTTP forwarding rule for automatic redirect to HTTPS
resource "google_compute_global_forwarding_rule" "lb_http_forwarding_rule" {
  name                  = "${local.base_name}-lb-http-forwarding-rule"
  project               = var.project_id
  target                = google_compute_target_http_proxy.lb_http_proxy.id
  port_range            = "80"
  ip_address            = google_compute_global_address.lb_ip.address
  load_balancing_scheme = "EXTERNAL"
}

# Create HTTP proxy for redirecting HTTP traffic to HTTPS
resource "google_compute_target_http_proxy" "lb_http_proxy" {
  name    = "${local.base_name}-lb-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.lb_http_redirect.id
}

# Create HTTPS proxy with SSL certificate
resource "google_compute_target_https_proxy" "lb_https_proxy" {
  name             = "${local.base_name}-lb-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.lb_url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.lb_ssl_cert.id]
}

resource "random_id" "certificate" {
  byte_length = 4
  prefix      = "${local.base_name}-lb-ssl-cert-"

  keepers = {
    domains = join(",", var.domains)
  }
}

# Create managed SSL certificate for automatic renewal
resource "google_compute_managed_ssl_certificate" "lb_ssl_cert" {
  name    = random_id.certificate.hex
  project = var.project_id

  lifecycle {
    create_before_destroy = true
  }

  managed {
    domains = var.domains
  }
}

# Create URL map for HTTP to HTTPS redirect
resource "google_compute_url_map" "lb_http_redirect" {
  name    = "${local.base_name}-lb-http-redirect"
  project = var.project_id

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

# Create URL map for routing traffic to backend services
resource "google_compute_url_map" "lb_url_map" {
  name            = "${local.base_name}-lb-url-map"
  project         = var.project_id
  default_service = google_compute_backend_service.lb_backend_default.id

  # Route traffic based on hostname to different backend services
  dynamic "host_rule" {
    for_each = var.cloud_run_services
    content {
      hosts        = var.domains
      path_matcher = "path-matcher-${host_rule.key}"
    }
  }

  dynamic "path_matcher" {
    for_each = var.cloud_run_services
    content {
      name            = "path-matcher-${path_matcher.key}"
      default_service = google_compute_backend_service.lb_backend_services[path_matcher.key].id
    }
  }
}

# Create backend services for each Cloud Run service
resource "google_compute_backend_service" "lb_backend_services" {
  count       = length(var.cloud_run_services)
  name        = "${local.base_name}-lb-backend-${count.index}"
  project     = var.project_id
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.lb_negs[count.index].id
  }
}

# Create a default backend service (first service)
resource "google_compute_backend_service" "lb_backend_default" {
  name        = "${local.base_name}-lb-backend-default"
  project     = var.project_id
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.lb_negs[0].id
  }
}

# Create Network Endpoint Groups (NEGs) for each Cloud Run service
resource "google_compute_region_network_endpoint_group" "lb_negs" {
  count                 = length(var.cloud_run_services)
  name                  = "${local.base_name}-lb-neg-${count.index}"
  project               = var.project_id
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = var.cloud_run_services[count.index].service_name
  }
} 