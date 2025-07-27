import {
  logSuccess,
  getBackendConfigPath,
  getTfvarsPath,
  initializeTerraform,
  applyTerraform,
  createBucket,
  writeFile,
} from '../../utils/index.mjs'
import { backendTemplate, tfvarsTemplate } from './templates/index.mjs'
import { getImageFullyQualifiedName } from './getImageFullyQualifiedName.mjs'

export async function setupAction(
  project: string,
  environment: string,
  environmentName: string,
  databaseName: string | null = null,
  databaseUser: string | null = null
): Promise<void> {
  logSuccess(`Setting up backend configuration for project: ${project}`)
  logSuccess(`Environment: ${environment}`)

  // create the backend file to be used
  const backendPath = getBackendConfigPath()
  await writeFile(
    backendPath,
    backendTemplate(project, environment, environmentName)
  )
  logSuccess(`Created ${backendPath}...`)

  const tfvarsPath = getTfvarsPath()
  await writeFile(
    tfvarsPath,
    tfvarsTemplate(
      project,
      environment,
      environmentName,
      await getImageFullyQualifiedName(project, environment, environmentName),
      databaseName && databaseUser
        ? {
            name: databaseName,
            user: databaseUser,
          }
        : null
    )
  )
  logSuccess(`Created ${tfvarsPath}...`)

  await createBucket(project)
  await initializeTerraform()
  await applyTerraform()

  logSuccess('Backend configuration updated successfully!')
}
