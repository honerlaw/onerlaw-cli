import { select, confirm } from '@/utils/prompts.mjs'
import { logSuccess } from '@/utils/logger.mjs'
import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'
import { selectEnvironmentToModify } from './selectEnvironmentToModify.mjs'
import { modifyEnvironment } from './modifyEnvironment.mjs'
import {
  getProjectId,
  getEnvironment,
  getEnvironmentName,
  getDatabase,
  getDNS,
} from '@/config/prompts/index.mjs'

export async function modifyProject(
  project: ProjectConfig
): Promise<ProjectConfig> {
  logSuccess(`Modifying project: ${project.project}`)

  const newProjectId = await getProjectId(project.project)

  const action = await select('What would you like to do?', [
    { name: 'Modify existing environment', value: 'modify' },
    { name: 'Add new environment', value: 'add' },
    { name: 'Remove environment', value: 'remove' },
  ])

  let updatedEnvironments = [...project.environments]

  if (action === 'modify') {
    const environmentToModify = await selectEnvironmentToModify(project)
    if (environmentToModify) {
      const modifiedEnvironment = await modifyEnvironment(environmentToModify)
      const envIndex = project.environments.findIndex(
        env =>
          env.name === environmentToModify.name &&
          env.environment === environmentToModify.environment
      )
      if (envIndex >= 0) {
        updatedEnvironments[envIndex] = modifiedEnvironment
      }
    }
  } else if (action === 'add') {
    const newEnvironmentName = await getEnvironmentName()
    const newEnvironmentType = await getEnvironment()

    const database = await getDatabase()
    const dns = await getDNS()

    const newEnvironment: EnvironmentConfig = {
      name: newEnvironmentName,
      environment: newEnvironmentType,
      database,
      dns,
    }

    updatedEnvironments.push(newEnvironment)
  } else if (action === 'remove') {
    const environmentToRemove = await selectEnvironmentToModify(project)
    if (environmentToRemove) {
      const shouldRemove = await confirm(
        `Are you sure you want to remove environment "${environmentToRemove.name}"?`
      )
      if (shouldRemove) {
        updatedEnvironments = updatedEnvironments.filter(
          env =>
            !(
              env.name === environmentToRemove.name &&
              env.environment === environmentToRemove.environment
            )
        )
      }
    }
  }

  return {
    project: newProjectId,
    environments: updatedEnvironments,
  }
}
