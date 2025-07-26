import { Command } from 'commander'
import {
  logSuccess,
  logError,
  runCommand,
  validateEnvironment,
  checkTfvarsExists,
  withTerraformDirectory,
} from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

async function planAction(environment: string): Promise<void> {
  // Validate environment
  validateEnvironment(environment)

  logSuccess(`Planning Terraform changes for ${environment} environment...`)

  // Check if ${TERRAFORM_TFVARS_FILE} exists
  if (!checkTfvarsExists()) {
    throw new Error(
      `${TERRAFORM_TFVARS_FILE} not found. Please create it from terraform.tfvars.example`
    )
  }

  await withTerraformDirectory(async () => {
    logSuccess('Running terraform plan...')
    await runCommand('terraform', [
      'plan',
      `-var-file=${TERRAFORM_TFVARS_FILE}`,
    ])
  })
}

export function registerPlanCommand(program: Command): void {
  program
    .command('plan')
    .description('Plan Terraform changes')
    .argument('<environment>', 'Environment to plan (dev, staging, prod)')
    .action(async (environment: string) => {
      try {
        await planAction(environment)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
