import { logSuccess } from '@/utils/logger.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'
import {
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getDomainName,
  getSubdomainNames,
} from '@/config/prompts/index.mjs'

export async function modifyEnvironment(
  environment: EnvironmentConfig
): Promise<EnvironmentConfig> {
  logSuccess(`Modifying environment: ${environment.name}`)

  const newName = await getEnvironmentName(environment.name)
  const newEnvironmentType = await getEnvironment(environment.environment)

  const database = await getDatabase(environment.database)

  const domainName = await getDomainName(environment.domainName)
  const subdomainNames = domainName
    ? await getSubdomainNames(environment.subdomainNames)
    : []

  return {
    name: newName,
    environment: newEnvironmentType,
    database,
    domainName,
    subdomainNames,
  }
}
