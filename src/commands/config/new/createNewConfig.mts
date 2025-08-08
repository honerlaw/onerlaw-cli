import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getDNS,
} from '@/config/prompts/index.mjs'

export async function createNewConfig(): Promise<ProjectConfig[]> {
  const project = await getProjectId()
  const environment = await getEnvironment()
  const environmentName = await getEnvironmentName()

  const database = await getDatabase()
  const dns = await getDNS()

  const environmentConfig: EnvironmentConfig = {
    name: environmentName,
    environment,
    database,
    dns,
  }

  return [
    {
      project,
      environment: environmentConfig,
    },
  ]
}
