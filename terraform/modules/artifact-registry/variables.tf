variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
}

variable "registry_name" {
  description = "The name of the Artifact Registry repository"
  type        = string
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
} 