import {
  logSuccess,
  runCommand,
  validateTfvars,
  withTerraformDirectory,
} from '../index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

export async function applyTerraform(): Promise<void> {
  logSuccess(`Applying Terraform changes...`)

  await validateTfvars()

  await withTerraformDirectory(async () => {
    logSuccess('Running terraform apply...')
    await runCommand('terraform', [
      'apply',
      `-var-file=${TERRAFORM_TFVARS_FILE}`,
      '-auto-approve',
    ])
  })
}
