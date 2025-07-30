import { logSuccess } from '@/utils/logger.mjs'
import { setupTerraform } from '@/utils/terraform/setupTerraform.mjs'
import { createBucket } from '@/utils/bucket/createBucket.mjs'
import { initializeTerraform } from '@/utils/terraform/init.mjs'
import { applyTerraform } from '@/utils/terraform/apply.mjs'
import { type LoadedConfig } from '@/config/loadConfigFromPrompt.mjs'

export async function setupAction(config: LoadedConfig): Promise<void> {
  const {
    selection: { project },
  } = config

  logSuccess(`Setting up backend configuration for project: ${project}`)

  // Setup terraform configuration
  await setupTerraform(config)
  logSuccess('Configuration files created successfully!')

  await createBucket(project)
  await initializeTerraform()
  await applyTerraform()

  logSuccess('Backend configuration updated successfully!')
}
