export function tfvarsTemplate(
  project: string,
  environment: string,
  environmentName: string,
  imageUrl: string
): string {
  return `
# Project configuration
project_id = "${project}"
environment = "${environment}"
environment_name = "${environmentName}"

# Networking
region = "us-central1"

# Cloud SQL
database_name = "app_db"
database_user = "app_user"

# Cloud Run
container_image = "${imageUrl}"
`
}
