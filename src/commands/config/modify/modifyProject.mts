import { logSuccess } from '@/utils/logger.mjs'
import { LOG_MODIFYING_PROJECT_PREFIX } from './constants.mjs'
import type { ProjectConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironmentName,
  getEnvironment,
  getDatabase,
  getDNS,
  getPubsub,
} from '@/config/prompts/index.mjs'

export async function modifyProject(
  project: ProjectConfig
): Promise<ProjectConfig> {
  logSuccess(`${LOG_MODIFYING_PROJECT_PREFIX}${project.project}`)
  const updatedProjectId = await getProjectId(project.project)

  const currentEnvironment = project.environment

  const updatedEnvironmentName = await getEnvironmentName(
    currentEnvironment.name
  )

  const updatedEnvironmentType = await getEnvironment(
    currentEnvironment.environment
  )

  const updatedDatabase = await getDatabase(currentEnvironment.database)

  const updatedDns = await getDNS(currentEnvironment.dns)

  const updatedPubsub = await getPubsub(currentEnvironment.pubsub)

  return {
    project: updatedProjectId,
    environment: {
      name: updatedEnvironmentName,
      environment: updatedEnvironmentType,
      database: updatedDatabase,
      dns: updatedDns,
      pubsub: updatedPubsub,
    },
  }
}
