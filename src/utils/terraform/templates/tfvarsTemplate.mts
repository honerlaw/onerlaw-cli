import { databaseTemplate } from './databaseTemplate.mjs'
import { dnsTemplate } from './dnsTemplate.mjs'
import { type EnvironmentConfig } from '@/config/schema.mjs'

export function tfvarsTemplate(
  project: string,
  environment: string,
  environmentName: string,
  imageUrl: string,
  database: EnvironmentConfig['database'],
  dns: EnvironmentConfig['dns']
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
${dnsTemplate(dns)}
`
}
