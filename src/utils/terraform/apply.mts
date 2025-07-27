import {
  logSuccess,
  logWarning,
  runCommand,
  validateTfvars,
  withTerraformDirectory,
  confirm,
} from '../index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

export async function applyTerraform(): Promise<void> {
  logSuccess(`Applying Terraform changes...`)

  await validateTfvars()

  await withTerraformDirectory(async () => {
    const shouldApply = await confirm(
      'Are you sure you want to apply these Terraform changes?'
    )

    if (shouldApply) {
      logSuccess('Running terraform apply...')
      await runCommand('terraform', [
        'apply',
        `-var-file=${TERRAFORM_TFVARS_FILE}`,
        '-auto-approve',
      ])
    } else {
      logWarning('Apply cancelled')
      return
    }
  })
}
