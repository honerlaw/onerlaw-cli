import { writeFile } from '@/utils/files.mjs'
import { tfvarsTemplate } from './templates/tfvarsTemplate.mjs'
import { backendTemplate } from './templates/backendTemplate.mjs'
import { type LoadedConfig } from '@/config/loadConfigFromPrompt.mjs'
import { getBackendConfigPath, getTfvarsPath } from '@/utils/paths.mjs'
import { logSuccess, setGcloudProject } from '@/utils/index.mjs'

export async function setupTerraform(config: LoadedConfig): Promise<void> {
  const {
    selection: {
      project,
      environment,
      environmentName,
      database,
      pubsub,
      apps,
    },
  } = config

  // Ensure gcloud is pointing to the correct project for any gcloud lookups
  await setGcloudProject(project)

  logSuccess('Setting up terraform configuration')

  // Generate terraform.tfvars
  const tfvarsContent = await tfvarsTemplate(
    project,
    environment,
    environmentName,
    database,
    pubsub,
    apps
  )

  await writeFile(getTfvarsPath(), tfvarsContent)

  logSuccess('Terraform configuration files created successfully!')

  // Generate backend.tf
  const backendContent = backendTemplate(project, environment, environmentName)

  await writeFile(getBackendConfigPath(), backendContent)

  logSuccess('Backend configuration file created successfully!')
}
