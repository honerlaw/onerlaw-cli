# Pub/Sub Module

This Terraform module creates Google Cloud Pub/Sub resources including topics and subscriptions with configurable settings.

## Features

- **Conditional Creation**: Resources are only created when `enabled = true`
- **Configurable Settings**: Customizable message retention, acknowledgment deadlines, and retry policies
- **IAM Integration**: Optional IAM bindings for topics and subscriptions
- **Dead Letter Support**: Configurable dead letter topic for failed message delivery
- **Environment-aware Naming**: Resources are prefixed with environment and environment name

## Usage

```hcl
module "pubsub" {
  source = "./modules/pubsub"

  project_id       = "your-project-id"
  environment      = "dev"
  environment_name = "my-app"
  enabled          = true

  # Optional: Customize subscription settings
  message_retention_duration = "1209600s"  # 14 days
  ack_deadline_seconds      = 30
  max_delivery_attempts     = 3

  # Optional: Configure IAM members
  topic_iam_members = [
    "serviceAccount:my-service@my-project.iam.gserviceaccount.com"
  ]
}
```

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| google | ~> 5.0 |

## Providers

| Name | Version |
|------|---------|
| google | ~> 5.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| project_id | The Google Cloud Project ID | `string` | n/a | yes |
| environment | The environment type (dev, staging, prod) | `string` | n/a | yes |
| environment_name | The name of the environment (e.g., 'my-app-dev', 'my-app-prod') | `string` | n/a | yes |
| enabled | Whether to enable Pub/Sub resources | `bool` | `false` | no |
| message_retention_duration | How long to retain unacknowledged messages in the subscription's backlog | `string` | `"604800s"` | no |
| ack_deadline_seconds | The maximum time after a subscriber receives a message before the subscriber should acknowledge the message | `number` | `20` | no |
| subscription_expiration_ttl | The TTL for the subscription expiration policy | `string` | `"2678400s"` | no |
| minimum_backoff | The minimum delay between consecutive deliveries of a given message | `string` | `"10s"` | no |
| maximum_backoff | The maximum delay between consecutive deliveries of a given message | `string` | `"600s"` | no |
| dead_letter_topic | The name of the dead letter topic for failed message delivery | `string` | `null` | no |
| max_delivery_attempts | The maximum number of delivery attempts for any message | `number` | `5` | no |
| topic_iam_members | List of IAM members to grant publisher role on the topic | `list(string)` | `[]` | no |
| subscription_iam_members | List of IAM members to grant subscriber role on the subscription | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| topic_name | The name of the Pub/Sub topic |
| topic_id | The ID of the Pub/Sub topic |
| topic_project | The project ID of the Pub/Sub topic |
| subscription_name | The name of the Pub/Sub subscription |
| subscription_id | The ID of the Pub/Sub subscription |
| subscription_project | The project ID of the Pub/Sub subscription |
| enabled | Whether Pub/Sub resources are enabled |

## Resource Naming

All resources follow the naming convention:
- Topic: `${environment}-${environment_name}-topic`
- Subscription: `${environment}-${environment_name}-subscription`

## Dependencies

This module depends on:
- Google Cloud Project being configured
- Pub/Sub API being enabled
- Proper IAM permissions for creating Pub/Sub resources

## Examples

### Basic Configuration
```hcl
module "pubsub" {
  source = "./modules/pubsub"

  project_id       = var.project_id
  environment      = var.environment
  environment_name = var.environment_name
  enabled          = true
}
```

### Advanced Configuration with Dead Letter Topic
```hcl
module "pubsub" {
  source = "./modules/pubsub"

  project_id       = var.project_id
  environment      = var.environment
  environment_name = var.environment_name
  enabled          = true

  # Custom retention and delivery settings
  message_retention_duration = "2592000s"  # 30 days
  ack_deadline_seconds      = 60
  max_delivery_attempts     = 3

  # Dead letter topic for failed messages
  dead_letter_topic = "projects/${var.project_id}/topics/dead-letter-topic"

  # IAM configuration
  topic_iam_members = [
    "serviceAccount:app-service@${var.project_id}.iam.gserviceaccount.com"
  ]
}
```

### Conditional Creation Based on Environment
```hcl
module "pubsub" {
  source = "./modules/pubsub"

  project_id       = var.project_id
  environment      = var.environment
  environment_name = var.environment_name
  enabled          = var.environment == "prod"  # Only enable in production

  # Production-specific settings
  message_retention_duration = var.environment == "prod" ? "1209600s" : "604800s"
  max_delivery_attempts     = var.environment == "prod" ? 3 : 1
}
```
