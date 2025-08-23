# Generate a random password for the database
resource "random_password" "database_password" {
  length  = 16
  special = true
}

# Create Secret Manager secret for database password
resource "google_secret_manager_secret" "database_password" {
  secret_id = "${var.instance_name}-db-password"
  project   = var.project_id

  replication {
    auto {}
  }
}

# Store the database password in Secret Manager
resource "google_secret_manager_secret_version" "database_password" {
  secret      = google_secret_manager_secret.database_password.id
  secret_data = random_password.database_password.result
}

# Create Secret Manager secret for the full DATABASE_URL
resource "google_secret_manager_secret" "database_url" {
  secret_id = "${var.instance_name}-database-url"
  project   = var.project_id

  replication {
    auto {}
  }
}

# Store the complete DATABASE_URL in Secret Manager
resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = "postgresql://${var.database_user}:${urlencode(random_password.database_password.result)}@localhost/${var.database_name}?host=/cloudsql/${google_sql_database_instance.instance.connection_name}"
}

# Create Cloud SQL instance
resource "google_sql_database_instance" "instance" {
  name             = var.instance_name
  database_version = var.database_version
  region           = var.region
  project          = var.project_id

  settings {
    tier = var.database_tier

    backup_configuration {
      enabled    = true
      start_time = "02:00"

      backup_retention_settings {
        retained_backups = var.environment == "prod" ? 7 : 3
      }
    }

    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.vpc_network_id
      ssl_mode                                      = "ENCRYPTED_ONLY"
      enable_private_path_for_google_cloud_services = true
    }

    maintenance_window {
      day          = 7 # Sunday
      hour         = 2 # 2 AM
      update_track = "stable"
    }
  }

  deletion_protection = false
}

# Create the database
resource "google_sql_database" "database" {
  name     = var.database_name
  instance = google_sql_database_instance.instance.name
  project  = var.project_id
}

# Create the database user
resource "google_sql_user" "user" {
  name     = var.database_user
  instance = google_sql_database_instance.instance.name
  project  = var.project_id
  password = random_password.database_password.result

  depends_on = [google_sql_database.database]
}
