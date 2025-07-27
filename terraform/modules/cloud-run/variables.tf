variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
}

variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
}

variable "image" {
  description = "The container image to deploy"
  type        = string
}

variable "database_instance_connection_name" {
  description = "The connection name of the Cloud SQL instance"
  type        = string
  default     = null
}

variable "database_name" {
  description = "The name of the database"
  type        = string
  default     = null
}

variable "database_user" {
  description = "The database user name"
  type        = string
  default     = null
}

variable "vpc_connector_name" {
  description = "The name of the VPC connector"
  type        = string
}

variable "cpu" {
  description = "CPU allocation for the service"
  type        = string
  default     = "1000m"
}

variable "memory" {
  description = "Memory allocation for the service"
  type        = string
  default     = "512Mi"
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "min_instances" {
  description = "Minimum number of instances"
  type        = number
  default     = 0
}

variable "port" {
  description = "The port the container listens on"
  type        = number
  default     = 3000
}

variable "secrets" {
  description = "List of secret names to mount as environment variables"
  type = list(object({
    name        = string
    secret_name = string
    version     = string
  }))
  default = []
}

variable "database_password_secret_name" {
  description = "The name of the Secret Manager secret containing the database password"
  type        = string
  default     = null
} 