import type { ProjectConfig } from '@/config/schema.mjs'
import { createNewConfig } from './createNewConfig.mjs'

export async function addNewConfiguration(
  existingConfig: ProjectConfig[]
): Promise<ProjectConfig[]> {
  const config = (await createNewConfig())[0]

  // Check if project already exists
  const existingProjectIndex = existingConfig.findIndex(
    p => p.project === config.project
  )

  if (existingProjectIndex >= 0) {
    // Add environment to existing project
    const updatedConfig = [...existingConfig]
    updatedConfig[existingProjectIndex].environments.push(
      config.environments[0]
    )
    return updatedConfig
  } else {
    // Add new project
    return [...existingConfig, config]
  }
}
