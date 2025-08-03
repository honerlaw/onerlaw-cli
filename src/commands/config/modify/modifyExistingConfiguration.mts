import type { ProjectConfig } from '@/config/schema.mjs'
import { logError } from '@/utils/logger.mjs'
import { selectProjectToModify } from './selectProjectToModify.mjs'
import { modifyProject } from './modifyProject.mjs'

export async function modifyExistingConfiguration(
  existingConfig: ProjectConfig[]
): Promise<ProjectConfig[]> {
  const projectToModify = await selectProjectToModify(existingConfig)
  if (!projectToModify) {
    logError('No projects available to modify')
    return existingConfig
  }

  const modifiedProject = await modifyProject(projectToModify)
  const projectIndex = existingConfig.findIndex(
    p => p.project === projectToModify.project
  )

  if (projectIndex >= 0) {
    const updatedConfig = [...existingConfig]
    updatedConfig[projectIndex] = modifiedProject
    return updatedConfig
  }
  return existingConfig
}
