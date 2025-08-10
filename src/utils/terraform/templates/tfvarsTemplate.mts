import { databaseTemplate } from './databaseTemplate.mjs'
import { pubsubTemplate } from './pubsubTemplate.mjs'
import { appsTemplate } from './appsTemplate.mjs'
import { type EnvironmentConfig } from '@/config/schema.mjs'

export async function tfvarsTemplate(
  project: string,
  environment: string,
  environmentName: string,
  database: EnvironmentConfig['database'],
  pubsub: EnvironmentConfig['pubsub'],
  apps: EnvironmentConfig['apps']
): Promise<string> {
  return `
# Project configuration
project_id = "${project}"
environment = "${environment}"
environment_name = "${environmentName}"

# Networking
region = "us-central1"

${databaseTemplate(database)}

# Pub/Sub
${pubsubTemplate(pubsub)}

# Apps
${await appsTemplate(apps, project, environment, environmentName)}
`
}
