# Required variables

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

variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "Project ID must be 6-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens."
  }
}

variable "region" {
  description = "The Google Cloud region for the Network Endpoint Group"
  type        = string

  validation {
    condition     = can(regex("^[a-z]+-[a-z]+[0-9]+$", var.region))
    error_message = "Region must be in the format 'region-zone' (e.g., 'us-central1')."
  }
}

variable "domains" {
  description = "List of domains for the SSL certificate"
  type        = list(string)

  validation {
    condition     = length(var.domains) > 0 && alltrue([for domain in var.domains : can(regex("^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", domain))])
    error_message = "Domains must be valid domain names and at least one domain must be provided."
  }
}

variable "cloud_run_service_name" {
  description = "The name of the Cloud Run service to route traffic to"
  type        = string

  validation {
    condition     = length(var.cloud_run_service_name) >= 1 && length(var.cloud_run_service_name) <= 63
    error_message = "Cloud Run service name must be between 1 and 63 characters."
  }
}

variable "network" {
  description = "The VPC network name for firewall rules"
  type        = string

  validation {
    condition     = length(var.network) >= 1 && length(var.network) <= 63
    error_message = "Network name must be between 1 and 63 characters."
  }
}



 