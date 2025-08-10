import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getDNS,
  getPubsub,
} from '@/config/prompts/index.mjs'

export async function createNewConfig(): Promise<ProjectConfig[]> {
  const project = await getProjectId()
  const environment = await getEnvironment()
  const environmentName = await getEnvironmentName()

  const database = await getDatabase()
  const dns = await getDNS()
  const pubsub = await getPubsub()

  const environmentConfig: EnvironmentConfig = {
    name: environmentName,
    environment,
    database,
    dns,
    pubsub,
  }

  return [
    {
      project,
      environment: environmentConfig,
    },
  ]
}
