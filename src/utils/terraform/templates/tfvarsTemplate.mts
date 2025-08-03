import { databaseTemplate, type DatabaseInfo } from './databaseTemplate.mjs'

export function tfvarsTemplate(
  project: string,
  environment: string,
  environmentName: string,
  imageUrl: string,
  database: DatabaseInfo | null,
  domainName: string | null = null
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

# DNS and Load Balancer
${domainName ? `domain_name = "${domainName}"` : '# domain_name = "example.com"  # Uncomment and set to enable load balancer and DNS'}
`
}
