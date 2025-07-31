import {
  logSuccess,
  logWarning,
  runCommand,
  validateTfvars,
  withTerraformDirectory,
  checkBackendConfigExists,
} from '../index.mjs'
import { BACKEND_TF_FILE } from '../../constants.mjs'

export async function initializeTerraform(): Promise<void> {
  logSuccess(`Initializing Terraform...`)

  await validateTfvars()

  await withTerraformDirectory(async () => {
    logSuccess('Initializing Terraform...')
    if (checkBackendConfigExists()) {
      logSuccess(`Using backend configuration...`)
      await runCommand('terraform', [
        'init',
        '-migrate-state',
        `-backend-config=${BACKEND_TF_FILE}`,
      ])
    } else {
      logWarning(`No backend configuration found, using default...`)
      await runCommand('terraform', ['init'])
    }
  })
}
