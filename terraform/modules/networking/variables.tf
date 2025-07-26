variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
}

variable "environment_name" {
  description = "The name of the environment"
  type        = string
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
}

variable "prevent_networking_destruction" {
  description = "Whether to prevent destruction of networking resources"
  type        = bool
  default     = false
}

 