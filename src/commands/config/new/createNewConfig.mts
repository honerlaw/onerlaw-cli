import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getDomainName,
  getSubdomainNames,
} from '@/config/prompts/index.mjs'

export async function createNewConfig(): Promise<ProjectConfig[]> {
  const project = await getProjectId()
  const environment = await getEnvironment()
  const environmentName = await getEnvironmentName()

  const database = await getDatabase()
  const domainName = await getDomainName()
  const subdomainNames = domainName ? await getSubdomainNames() : []

  const environmentConfig: EnvironmentConfig = {
    name: environmentName,
    environment,
    database,
    domainName,
    subdomainNames,
  }

  return [
    {
      project,
      environments: [environmentConfig],
    },
  ]
}
