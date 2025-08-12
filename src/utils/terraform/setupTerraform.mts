import { writeFile } from '@/utils/files.mjs'
import { tfvarsTemplate } from './templates/tfvarsTemplate.mjs'
import { backendTemplate } from './templates/backendTemplate.mjs'
import { type LoadedConfig } from '@/config/loadConfigFromPrompt.mjs'
import { getBackendConfigPath, getTfvarsPath } from '@/utils/paths.mjs'
import { setGcloudProject } from '@/utils/index.mjs'

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

  // Generate backend.tf
  const backendContent = backendTemplate(project, environment, environmentName)

  await writeFile(getBackendConfigPath(), backendContent)
}
