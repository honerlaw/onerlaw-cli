import {
  logSuccess,
  logWarning,
  runCommand,
  checkTfvarsExists,
  withTerraformDirectory,
  checkBackendConfigExists,
} from '../index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

export async function initializeTerraform(): Promise<void> {
  logSuccess(`Initializing Terraform...`)

  // Check if ${TERRAFORM_TFVARS_FILE} exists
  if (!checkTfvarsExists()) {
    throw new Error(
      `${TERRAFORM_TFVARS_FILE} not found. Please create it from terraform.tfvars.example`
    )
  }

  await withTerraformDirectory(async () => {
    logSuccess('Initializing Terraform...')
    if (checkBackendConfigExists()) {
      logSuccess(`Using backend configuration...`)
      await runCommand('terraform', [
        'init',
        `-backend-config=backend.tfbackend`,
      ])
    } else {
      logWarning(`No backend configuration found, using default...`)
      await runCommand('terraform', ['init'])
    }
  })
}
