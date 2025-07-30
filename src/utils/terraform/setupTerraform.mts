import { writeFile } from '@/utils/files.mjs'
import { tfvarsTemplate } from './templates/tfvarsTemplate.mjs'
import { backendTemplate } from './templates/backendTemplate.mjs'
import { getImageFullyQualifiedName } from '@/commands/setup/getImageFullyQualifiedName.mjs'
import { type LoadedConfig } from '@/config/loadConfigFromPrompt.mjs'

export async function setupTerraform(config: LoadedConfig): Promise<void> {
  const {
    selection: { project, environment, environmentName, database },
  } = config

  // Get the fully qualified image name
  const imageUrl = await getImageFullyQualifiedName(
    project,
    environment,
    environmentName
  )

  // Generate terraform.tfvars
  const tfvarsContent = tfvarsTemplate(
    project,
    environment,
    environmentName,
    imageUrl,
    database
  )

  await writeFile('terraform.tfvars', tfvarsContent)

  // Generate backend.tf
  const backendContent = backendTemplate(project, environment, environmentName)

  await writeFile('terraform/backend.tf', backendContent)
}
