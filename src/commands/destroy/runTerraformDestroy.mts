import { runCommand } from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

export async function runTerraformDestroy(): Promise<void> {
  await runCommand('terraform', [
    'destroy',
    '-auto-approve',
    `-var-file=${TERRAFORM_TFVARS_FILE}`,
  ])
}
