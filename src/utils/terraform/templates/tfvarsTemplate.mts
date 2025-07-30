import { databaseTemplate, type DatabaseInfo } from './databaseTemplate.mjs'

export function tfvarsTemplate(
  project: string,
  environment: string,
  environmentName: string,
  imageUrl: string,
  database: DatabaseInfo | null
): string {
  return `
# Project configuration
project_id = "${project}"
environment = "${environment}"
environment_name = "${environmentName}"

# Networking
region = "us-central1"

${databaseTemplate(database)}

# Cloud Run
container_image = "${imageUrl}"
`
}
