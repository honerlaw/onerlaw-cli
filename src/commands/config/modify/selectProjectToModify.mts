import { select } from '@/utils/prompts.mjs'
import type { ProjectConfig } from '@/config/schema.mjs'

export async function selectProjectToModify(
  existingConfig: ProjectConfig[]
): Promise<ProjectConfig | null> {
  if (existingConfig.length === 0) {
    return null
  }

  const projectChoices = existingConfig.map((project, index) => ({
    name: `${project.project} (${project.environments.length} environments)`,
    value: index,
  }))

  const selectedIndex = await select(
    'Select a project to modify:',
    projectChoices
  )

  return existingConfig[selectedIndex]
}
