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

variable "domain_name" {
  description = "The primary domain name for DNS records (e.g., 'jurnara.com')"
  type        = string

  validation {
    condition     = can(regex("^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", var.domain_name))
    error_message = "Domain name must be a valid domain format."
  }
}

variable "load_balancer_ip_address" {
  description = "The IP address of the load balancer to point DNS records to"
  type        = string

  validation {
    condition     = can(regex("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$", var.load_balancer_ip_address))
    error_message = "Load balancer IP address must be a valid IPv4 address."
  }
}

# Optional variables

variable "create_www_record" {
  description = "Whether to create an A record for www subdomain"
  type        = bool
  default     = true
}

variable "create_www_cname_record" {
  description = "Whether to create a CNAME record for www subdomain (alternative to A record)"
  type        = bool
  default     = false
}

variable "subdomain_names" {
  description = "List of subdomain names to create A records for (e.g., ['api', 'admin', 'staging'])"
  type        = list(string)
  default     = []
} 