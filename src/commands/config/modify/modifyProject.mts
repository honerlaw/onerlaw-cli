import type { ProjectConfig } from '@/config/schema.mjs'
import {
  getProjectId,
  getEnvironmentName,
  getEnvironment,
  getDatabase,
  getPubsub,
  getApps,
} from '@/config/prompts/index.mjs'

export async function modifyProject(
  project: ProjectConfig
): Promise<ProjectConfig> {
  const currentEnvironment = project.environment

  const updatedProjectId = await getProjectId(project.project)
  const updatedEnvironmentName = await getEnvironmentName(
    currentEnvironment.name
  )
  const updatedEnvironmentType = await getEnvironment(
    currentEnvironment.environment
  )
  const updatedDatabase = await getDatabase(currentEnvironment.database)
  const updatedPubsub = await getPubsub(currentEnvironment.pubsub)
  const updatedApps = await getApps(currentEnvironment.apps)

  return {
    project: updatedProjectId,
    environment: {
      name: updatedEnvironmentName,
      environment: updatedEnvironmentType,
      database: updatedDatabase,
      pubsub: updatedPubsub,
      apps: updatedApps,
    },
  }
}
