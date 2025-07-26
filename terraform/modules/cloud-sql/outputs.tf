output "instance_name" {
  description = "The name of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.name
}

output "instance_connection_name" {
  description = "The connection name of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.connection_name
}

output "database_name" {
  description = "The name of the database"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "The database user name"
  value       = google_sql_user.user.name
}

output "database_password_secret_name" {
  description = "The name of the Secret Manager secret containing the database password"
  value       = google_secret_manager_secret.database_password.secret_id
}



 