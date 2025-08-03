variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "environment_name" {
  description = "The name of the environment (e.g., 'my-app-dev', 'my-app-prod')"
  type        = string
  validation {
    condition     = length(var.environment_name) >= 3 && length(var.environment_name) <= 63
    error_message = "Environment name must be between 3 and 63 characters."
  }
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "database_name" {
  description = "The name of the database to create"
  type        = string
  default     = null
}

variable "database_user" {
  description = "The database user name"
  type        = string
  default     = null
}

variable "container_image" {
  description = "The container image to deploy to Cloud Run"
  type        = string
  default     = "gcr.io/PROJECT_ID/IMAGE:TAG"
}

variable "database_tier" {
  description = "The Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"
}

variable "database_version" {
  description = "The Cloud SQL database version"
  type        = string
  default     = "POSTGRES_15"
}

variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run service"
  type        = string
  default     = "1000m"
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run service"
  type        = string
  default     = "512Mi"
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0
}

variable "cloud_run_secrets" {
  description = "List of secrets to mount in Cloud Run service"
  type = list(object({
    name        = string
    secret_name = string
    version     = string
  }))
  default = []
}

# DNS Variables
variable "domain_name" {
  description = "The primary domain name for DNS records (e.g., 'example.com'). If provided, DNS records and load balancer will be created automatically."
  type        = string
  default     = null

  validation {
    condition     = var.domain_name == null || can(regex("^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", var.domain_name))
    error_message = "Domain name must be a valid domain format if provided."
  }
}

variable "subdomain_names" {
  description = "List of subdomain names to create A records for (e.g., ['api', 'admin', 'staging'])"
  type        = list(string)
  default     = []
}


