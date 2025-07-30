import {
  logSuccess,
  initializeTerraform,
  applyTerraform,
  createBucket,
  setupTerraform,
} from '../../utils/index.mjs'
import { ConfigItem } from '@/config/index.mjs'

export async function setupAction(config: ConfigItem): Promise<void> {
  const { project, environment } = config

  logSuccess(`Setting up backend configuration for project: ${project}`)
  logSuccess(`Environment: ${environment}`)

  await setupTerraform(config)
  logSuccess('Configuration files created successfully!')

  await createBucket(project)
  await initializeTerraform()
  await applyTerraform()

  logSuccess('Backend configuration updated successfully!')
}
