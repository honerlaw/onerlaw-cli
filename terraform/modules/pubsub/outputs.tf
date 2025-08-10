output "topic_name" {
  description = "The name of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].name : null
}

output "topic_id" {
  description = "The ID of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].id : null
}

output "topic_self_link" {
  description = "The self-link of the Pub/Sub topic"
  value       = var.enabled ? google_pubsub_topic.topic[0].self_link : null
}

output "subscription_name" {
  description = "The name of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].name : null
}

output "subscription_id" {
  description = "The ID of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].id : null
}

output "subscription_self_link" {
  description = "The self-link of the Pub/Sub subscription"
  value       = var.enabled ? google_pubsub_subscription.subscription[0].self_link : null
}

output "enabled" {
  description = "Whether Pub/Sub resources are enabled"
  value       = var.enabled
}
