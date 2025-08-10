output "topic_name" {
  description = "The name of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].name : null
}

output "topic_id" {
  description = "The ID of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].id : null
}

output "topic_project" {
  description = "The project ID of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].project : null
}

output "subscription_name" {
  description = "The name of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].name : null
}

output "subscription_id" {
  description = "The ID of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].id : null
}

output "subscription_project" {
  description = "The project ID of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].project : null
}

output "enabled" {
  description = "Whether Pub/Sub resources are enabled"
  value       = var.enabled
}
