import { select } from '@/utils/prompts.mjs'
import { logError } from '@/utils/logger.mjs'
import type { ProjectConfig } from '@/config/schema.mjs'
import { selectProjectToRemove } from './selectProjectToRemove.mjs'

export async function removeConfiguration(
  existingConfig: ProjectConfig[]
): Promise<ProjectConfig[]> {
  const projectToRemove = await selectProjectToRemove(existingConfig)
  if (!projectToRemove) {
    logError('No projects available to remove')
    return existingConfig
  }

  const confirmRemoval = await select(
    `Are you sure you want to remove project "${projectToRemove.project}"?`,
    [
      { name: 'Yes, remove the project', value: 'yes' },
      { name: 'No, keep the project', value: 'no' },
    ]
  )

  if (confirmRemoval === 'yes') {
    return existingConfig.filter(p => p.project !== projectToRemove.project)
  }

  return existingConfig
}
