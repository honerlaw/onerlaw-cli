import {
  logSuccess,
  getBackendConfigPath,
  getTfvarsPath,
  writeFileSync,
  initializeTerraform,
  applyTerraform,
  createBucket,
} from '../../utils/index.mjs'
import { backendTemplate } from './backendTemplate.mjs'
import { tfvarsTemplate } from './tfvarsTemplate.mjs'
import { getImageFullyQualifiedName } from './getImageFullyQualifiedName.mjs'

export async function setupAction(
  project: string,
  environment: string,
  environmentName: string
): Promise<void> {
  logSuccess(`Setting up backend configuration for project: ${project}`)
  logSuccess(`Environment: ${environment}`)

  // create the backend file to be used
  const backendPath = getBackendConfigPath()
  writeFileSync(
    backendPath,
    backendTemplate(project, environment, environmentName)
  )
  logSuccess(`Created ${backendPath}...`)

  const tfvarsPath = getTfvarsPath()
  writeFileSync(
    tfvarsPath,
    tfvarsTemplate(
      project,
      environment,
      environmentName,
      await getImageFullyQualifiedName(project, environment, environmentName)
    )
  )
  logSuccess(`Created ${tfvarsPath}...`)

  await createBucket(project)
  await initializeTerraform()
  await applyTerraform()

  logSuccess('Backend configuration updated successfully!')
}
