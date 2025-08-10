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

# Local variables for conditional resource creation
locals {
  cloud_sql_enabled     = var.database_name != null && var.database_user != null
  load_balancer_enabled = var.domain_name != null
  pubsub_enabled        = var.pubsub_topic_name != null
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
    "secretmanager.googleapis.com",
    "dns.googleapis.com",
    "pubsub.googleapis.com"
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

  cloud_sql_enabled                 = local.cloud_sql_enabled
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

# Create Load Balancer (only if domain_name is provided)
module "load_balancer" {
  count  = local.load_balancer_enabled ? 1 : 0
  source = "./modules/load-balancer"

  environment            = var.environment
  environment_name       = var.environment_name
  project_id             = var.project_id
  region                 = var.region
  domains                = concat([var.domain_name], [for subdomain in var.subdomain_names : "${subdomain}.${var.domain_name}"])
  cloud_run_service_name = module.cloud_run.service_name
  network                = module.networking.vpc_network

  depends_on = [google_project_service.required_apis, module.cloud_run, module.networking]
}

# Create DNS records (only if domain_name is provided)
module "dns" {
  count  = local.load_balancer_enabled ? 1 : 0
  source = "./modules/dns"

  environment              = var.environment
  environment_name         = var.environment_name
  project_id               = var.project_id
  domain_name              = var.domain_name
  load_balancer_ip_address = module.load_balancer[0].ip_address
  subdomain_names          = var.subdomain_names
  create_www_record        = false

  depends_on = [module.load_balancer]
}

# Create Pub/Sub resources (only if enabled)
module "pubsub" {
  count  = local.pubsub_enabled ? 1 : 0
  source = "./modules/pubsub"

  project_id       = var.project_id
  environment      = var.environment
  environment_name = var.environment_name
  enabled          = local.pubsub_enabled
  topic_name       = var.pubsub_topic_name
  cloud_run_service_account = module.cloud_run.service_account_email

  # Optional: Customize Pub/Sub settings
  message_retention_duration = var.pubsub_message_retention_duration
  ack_deadline_seconds       = var.pubsub_ack_deadline_seconds
  max_delivery_attempts      = var.pubsub_max_delivery_attempts
  dead_letter_topic          = var.pubsub_dead_letter_topic
  topic_iam_members          = var.pubsub_topic_iam_members
  subscription_iam_members   = var.pubsub_subscription_iam_members

  depends_on = [google_project_service.required_apis]
} 