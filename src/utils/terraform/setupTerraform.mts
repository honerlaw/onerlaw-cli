import { writeFile } from '../files.mjs'
import { getBackendConfigPath, getTfvarsPath } from '../paths.mjs'
import { backendTemplate, tfvarsTemplate } from './templates/index.mjs'
import { getImageFullyQualifiedName } from '../../commands/setup/getImageFullyQualifiedName.mjs'
import { type ConfigItem } from '@/config/index.mjs'

export async function setupTerraform(config: ConfigItem): Promise<void> {
  const { project, environment, environmentName, database } = config

  // Create the backend file
  const backendPath = getBackendConfigPath()
  await writeFile(
    backendPath,
    backendTemplate(project, environment, environmentName)
  )

  // Create the tfvars file
  const tfvarsPath = getTfvarsPath()
  await writeFile(
    tfvarsPath,
    tfvarsTemplate(
      project,
      environment,
      environmentName,
      await getImageFullyQualifiedName(project, environment, environmentName),
      database
    )
  )
}
