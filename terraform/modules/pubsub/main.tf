# Create Pub/Sub topic
resource "google_pubsub_topic" "topic" {
  count   = var.enabled ? 1 : 0
  name    = var.topic_name != null ? var.topic_name : "${var.environment}-${var.environment_name}-topic"
  project = var.project_id

  labels = {
    environment = var.environment
    managed-by  = "terraform"
  }
}

# Create Pub/Sub subscription
resource "google_pubsub_subscription" "subscription" {
  count   = var.enabled ? 1 : 0
  name    = "${var.environment}-${var.environment_name}-subscription"
  topic   = google_pubsub_topic.topic[0].name
  project = var.project_id

  # Configure message retention and acknowledgment deadline
  message_retention_duration = var.message_retention_duration
  ack_deadline_seconds       = var.ack_deadline_seconds

  # Configure expiration policy
  expiration_policy {
    ttl = var.subscription_expiration_ttl
  }

  # Configure retry policy
  retry_policy {
    minimum_backoff = var.minimum_backoff
    maximum_backoff = var.maximum_backoff
  }

  # Configure dead letter policy if enabled
  dynamic "dead_letter_policy" {
    for_each = var.dead_letter_topic != null ? [1] : []
    content {
      dead_letter_topic     = var.dead_letter_topic
      max_delivery_attempts = var.max_delivery_attempts
    }
  }

  labels = {
    environment = var.environment
    managed-by  = "terraform"
  }

  depends_on = [google_pubsub_topic.topic]
}

# Create IAM binding for the topic (optional)
resource "google_pubsub_topic_iam_binding" "topic_iam" {
  for_each = var.enabled && length(var.topic_iam_members) > 0 ? toset(var.topic_iam_members) : []

  project = var.project_id
  topic   = google_pubsub_topic.topic[0].name
  role    = "roles/pubsub.publisher"
  members = [each.value]

  depends_on = [google_pubsub_topic.topic]
}

# Create IAM binding for the subscription (optional)
resource "google_pubsub_subscription_iam_binding" "subscription_iam" {
  for_each = var.enabled && length(var.subscription_iam_members) > 0 ? toset(var.subscription_iam_members) : []

  project      = var.project_id
  subscription = google_pubsub_subscription.subscription[0].name
  role         = "roles/pubsub.subscriber"
  members      = [each.value]

  depends_on = [google_pubsub_subscription.subscription]
}

# Automatically grant Cloud Run service accounts publisher access to the topic
resource "google_pubsub_topic_iam_binding" "cloud_run_topic_publishers" {
  for_each = var.enabled && length(var.cloud_run_service_accounts) > 0 ? toset(var.cloud_run_service_accounts) : []

  project = var.project_id
  topic   = google_pubsub_topic.topic[0].name
  role    = "roles/pubsub.publisher"
  members = ["serviceAccount:${each.value}"]

  depends_on = [google_pubsub_topic.topic]
}

# Automatically grant Cloud Run service accounts subscriber access to the subscription
resource "google_pubsub_subscription_iam_binding" "cloud_run_subscription_subscribers" {
  for_each = var.enabled && length(var.cloud_run_service_accounts) > 0 ? toset(var.cloud_run_service_accounts) : []

  project      = var.project_id
  subscription = google_pubsub_subscription.subscription[0].name
  role         = "roles/pubsub.subscriber"
  members      = ["serviceAccount:${each.value}"]

  depends_on = [google_pubsub_subscription.subscription]
}
