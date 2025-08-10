import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getPubsub,
  getApps,
} from '@/config/prompts/index.mjs'

export async function createNewConfig(): Promise<ProjectConfig[]> {
  const project = await getProjectId()
  const environment = await getEnvironment()
  const environmentName = await getEnvironmentName()

  const database = await getDatabase()
  const pubsub = await getPubsub()
  const apps = await getApps()

  const environmentConfig: EnvironmentConfig = {
    name: environmentName,
    environment,
    database,
    pubsub,
    apps,
  }

  return [
    {
      project,
      environment: environmentConfig,
    },
  ]
}
