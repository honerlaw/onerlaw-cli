terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Backend configuration for storing state in Google Cloud Storage
  backend "gcs" {
    # These will be configured via backend.tfbackend config file (created by setup-backend command)
  }
}

# Local variable to determine if Cloud SQL is enabled
locals {
  cloud_sql_enabled = var.database_name != null && var.database_user != null
}

# Create service account for Terraform backend access
resource "google_service_account" "terraform_backend" {
  account_id   = "${var.environment}-${var.environment_name}-terraform-backend-sa"
  display_name = "Terraform Backend Service Account for ${var.environment}-${var.environment_name}"
  project      = var.project_id
}

# Create service account key for backend authentication
resource "google_service_account_key" "terraform_backend_key" {
  service_account_id = google_service_account.terraform_backend.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "cloudresourcemanager.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "compute.googleapis.com",
    "storage.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com",
    "secretmanager.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Create networking infrastructure
module "networking" {
  source = "./modules/networking"

  project_id       = var.project_id
  environment      = var.environment
  environment_name = var.environment_name
  region           = var.region

  depends_on = [google_project_service.required_apis]
}

# Create Cloud SQL instance (only if database_name and database_user are provided)
module "cloud_sql" {
  count  = local.cloud_sql_enabled ? 1 : 0
  source = "./modules/cloud-sql"

  project_id     = var.project_id
  environment    = var.environment
  instance_name  = "${var.environment}-${var.environment_name}"
  region         = var.region
  database_name  = var.database_name
  database_user  = var.database_user
  vpc_network_id = module.networking.vpc_network_id

  depends_on = [google_project_service.required_apis, module.networking]
}

# Create Cloud Run service
module "cloud_run" {
  source = "./modules/cloud-run"

  project_id   = var.project_id
  environment  = var.environment
  service_name = "${var.environment}-${var.environment_name}"
  region       = var.region
  image        = var.container_image

  database_instance_connection_name = local.cloud_sql_enabled ? module.cloud_sql[0].instance_connection_name : null
  database_name                     = var.database_name
  database_user                     = var.database_user
  database_password_secret_name     = local.cloud_sql_enabled ? module.cloud_sql[0].database_password_secret_name : null
  vpc_connector_name                = module.networking.vpc_connector_name
  secrets                           = var.cloud_run_secrets

  depends_on = [google_project_service.required_apis, module.networking]
}

# Create Artifact Registry
module "artifact_registry" {
  source = "./modules/artifact-registry"

  project_id    = var.project_id
  environment   = var.environment
  registry_name = "${var.environment}-${var.environment_name}"
  region        = var.region

  depends_on = [google_project_service.required_apis]
} 