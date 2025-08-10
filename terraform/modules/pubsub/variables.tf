variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "environment" {
  description = "The environment type (dev, staging, prod)"
  type        = string
}

variable "environment_name" {
  description = "The name of the environment (e.g., 'my-app-dev', 'my-app-prod')"
  type        = string
}

variable "enabled" {
  description = "Whether to enable Pub/Sub resources"
  type        = bool
  default     = false
}

variable "topic_name" {
  description = "The name of the Pub/Sub topic (if not provided, will use environment-based naming)"
  type        = string
  default     = null
}

variable "cloud_run_service_account" {
  description = "The Cloud Run service account email to grant Pub/Sub permissions to"
  type        = string
  default     = null
}

variable "message_retention_duration" {
  description = "How long to retain unacknowledged messages in the subscription's backlog"
  type        = string
  default     = "604800s" # 7 days
}

variable "ack_deadline_seconds" {
  description = "The maximum time after a subscriber receives a message before the subscriber should acknowledge the message"
  type        = number
  default     = 20
}

variable "subscription_expiration_ttl" {
  description = "The TTL for the subscription expiration policy"
  type        = string
  default     = "2678400s" # 31 days
}

variable "minimum_backoff" {
  description = "The minimum delay between consecutive deliveries of a given message"
  type        = string
  default     = "10s"
}

variable "maximum_backoff" {
  description = "The maximum delay between consecutive deliveries of a given message"
  type        = string
  default     = "600s" # 10 minutes
}

variable "dead_letter_topic" {
  description = "The name of the dead letter topic for failed message delivery"
  type        = string
  default     = null
}

variable "max_delivery_attempts" {
  description = "The maximum number of delivery attempts for any message"
  type        = number
  default     = 5
}

variable "topic_iam_members" {
  description = "List of IAM members to grant publisher role on the topic"
  type        = list(string)
  default     = []
}

variable "subscription_iam_members" {
  description = "List of IAM members to grant subscriber role on the subscription"
  type        = list(string)
  default     = []
}
