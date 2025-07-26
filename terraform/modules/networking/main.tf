# Create VPC for private connectivity
resource "google_compute_network" "vpc" {
  name                    = "${var.environment}-${var.environment_name}-vpc"
  auto_create_subnetworks = false
  project                 = var.project_id
}

# Create private services connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.environment}-${var.environment_name}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Create subnet for VPC
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.environment}-${var.environment_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.vpc.id
  region        = var.region
  project       = var.project_id
}

# Create VPC connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "${var.environment}-${var.environment_name}-connector"
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.vpc.name
  region        = var.region
  project       = var.project_id

  depends_on = [google_project_service.vpcaccess_api]
}

# Enable VPC Access API
resource "google_project_service" "vpcaccess_api" {
  project = var.project_id
  service = "vpcaccess.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
} 