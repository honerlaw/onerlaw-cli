variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
}

variable "instance_name" {
  description = "The name of the Cloud SQL instance"
  type        = string
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
}

variable "database_name" {
  description = "The name of the database to create"
  type        = string
}

variable "database_user" {
  description = "The database user name"
  type        = string
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

variable "vpc_network_id" {
  description = "The VPC network ID"
  type        = string
}
