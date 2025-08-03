import { select } from '@/utils/prompts.mjs'
import type { ProjectConfig, EnvironmentConfig } from '@/config/schema.mjs'

export async function selectEnvironmentToModify(
  project: ProjectConfig
): Promise<EnvironmentConfig | null> {
  if (project.environments.length === 0) {
    return null
  }

  const environmentChoices = project.environments.map((env, index) => ({
    name: `${env.name} (${env.environment})`,
    value: index,
  }))

  const selectedIndex = await select(
    'Select an environment to modify:',
    environmentChoices
  )

  return project.environments[selectedIndex]
}
