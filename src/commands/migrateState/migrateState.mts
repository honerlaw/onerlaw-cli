import {
  logError,
  logSuccess,
  logWarning,
  runCommand,
  validateEnvironment,
  checkBackendConfigExists,
  checkLocalStateExists,
  withTerraformDirectory,
} from '../../utils/index.mjs'
import { Command } from 'commander'
import { BACKEND_TF_FILE } from '../../constants.mjs'

async function migrateStateAction(environment: string): Promise<void> {
  logSuccess(
    `Migrating Terraform state to remote backend for ${environment}...`
  )

  // Check if backend configuration exists
  if (!checkBackendConfigExists()) {
    throw new Error(
      `Backend configuration not found for ${environment}. Please run setup-backend first.`
    )
  }

  // Check if local state exists
  if (!checkLocalStateExists()) {
    logWarning('No local state file found. Initializing with backend...')
    await withTerraformDirectory(async () => {
      await runCommand('terraform', [
        'init',
        `-backend-config=${BACKEND_TF_FILE}`,
      ])
    })
    return
  }

  logWarning('Local state file found. Migrating to remote backend...')

  await withTerraformDirectory(async () => {
    // Initialize with backend and migrate state
    await runCommand('terraform', [
      'init',
      `-backend-config=${BACKEND_TF_FILE}`,
      '-migrate-state',
    ])
  })

  logSuccess('State migration completed successfully!')
  logWarning('You can now safely delete the local terraform.tfstate file.')
}

export function registerMigrateStateCommand(program: Command): void {
  program
    .command('migrate-state')
    .description('Migrate Terraform state to remote backend')
    .argument('<environment>', 'Environment to migrate (dev, staging, prod)')
    .action(async (environment: string) => {
      try {
        validateEnvironment(environment)
        await migrateStateAction(environment)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
