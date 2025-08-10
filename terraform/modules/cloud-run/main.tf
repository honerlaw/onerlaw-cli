# Create service account for Cloud Run
resource "google_service_account" "cloud_run_sa" {
  account_id   = "${var.service_name}-sa"
  display_name = "Cloud Run Service Account for ${var.service_name}"
  project      = var.project_id
}

# Grant Cloud Run service account access to Cloud SQL (only if database is configured)
resource "google_project_iam_member" "cloud_run_sql_client" {
  count   = var.cloud_sql_enabled ? 1 : 0
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Grant Cloud Run service account access to Secret Manager
resource "google_project_iam_member" "cloud_run_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Grant Cloud Run service account access to Pub/Sub
resource "google_project_iam_member" "cloud_run_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "cloud_run_pubsub_subscriber" {
  project = var.project_id
  role    = "roles/pubsub.subscriber"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Create Cloud Run service
resource "google_cloud_run_v2_service" "service" {
  name     = var.service_name
  location = var.region
  project  = var.project_id

  template {
    scaling {
      max_instance_count = var.max_instances
      min_instance_count = var.min_instances
    }

    vpc_access {
      connector = var.vpc_connector_name
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = var.image
      ports {
        container_port = var.port
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      # Database environment variables (only if database is configured)
      dynamic "env" {
        for_each = var.cloud_sql_enabled ? [1] : []
        content {
          name  = "DB_HOST"
          value = "/cloudsql/${var.database_instance_connection_name}"
        }
      }

      dynamic "env" {
        for_each = var.cloud_sql_enabled ? [1] : []
        content {
          name  = "DB_NAME"
          value = var.database_name
        }
      }

      dynamic "env" {
        for_each = var.cloud_sql_enabled ? [1] : []
        content {
          name  = "DB_USER"
          value = var.database_user
        }
      }

      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }

      # Use Secret Manager for database password (only if database is configured)
      dynamic "env" {
        for_each = var.cloud_sql_enabled ? [1] : []
        content {
          name = "DB_PASSWORD"
          value_source {
            secret_key_ref {
              secret  = var.database_password_secret_name
              version = "latest"
            }
          }
        }
      }

      # Add secret environment variables
      dynamic "env" {
        for_each = var.secrets
        content {
          name = env.value.name
          value_source {
            secret_key_ref {
              secret  = env.value.secret_name
              version = env.value.version
            }
          }
        }
      }

      # Add Cloud SQL connection (only if database is configured)
      dynamic "volume_mounts" {
        for_each = var.cloud_sql_enabled ? [1] : []
        content {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }
    }

    # Add Cloud SQL volumes (only if database is configured)
    dynamic "volumes" {
      for_each = var.cloud_sql_enabled ? [1] : []
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.database_instance_connection_name]
        }
      }
    }

    service_account = google_service_account.cloud_run_sa.email
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Allow unauthenticated access to Cloud Run service
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.service.location
  project  = google_cloud_run_v2_service.service.project
  service  = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
} 