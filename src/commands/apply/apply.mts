import { Command } from 'commander'
import {
  logSuccess,
  logError,
  logWarning,
  runCommand,
  checkTfvarsExists,
  withTerraformDirectory,
  confirm,
} from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

async function applyAction(): Promise<void> {
  logSuccess(`Applying Terraform changes...`)

  // Check if ${TERRAFORM_TFVARS_FILE} exists
  if (!checkTfvarsExists()) {
    throw new Error(
      `${TERRAFORM_TFVARS_FILE} not found. Please create it: npx @onerlaw/infra setup-backend -p <project> -e <environment> -n <environment-name>`
    )
  }

  await withTerraformDirectory(async () => {
    const shouldApply = await confirm(
      'Are you sure you want to apply these Terraform changes?',
      false
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

export function registerApplyCommand(program: Command): void {
  program
    .command('apply')
    .description('Apply Terraform changes')
    .action(async () => {
      try {
        await applyAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
