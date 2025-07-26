import { Command } from 'commander'
import {
  logError,
  logWarning,
  logSuccess,
  runCommand,
  validateEnvironment,
  checkTfvarsExists,
  withTerraformDirectory,
  confirm,
  getTfvarsPath,
  checkFileExists,
  readFileSync,
} from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'

async function destroyAction(environment: string): Promise<void> {
  // Validate environment
  validateEnvironment(environment)

  logError(`Destroying infrastructure for ${environment} environment...`)

  // Check if ${TERRAFORM_TFVARS_FILE} exists
  if (!checkTfvarsExists()) {
    throw new Error(
      `${TERRAFORM_TFVARS_FILE} not found. Please create it from terraform.tfvars.example`
    )
  }

  await withTerraformDirectory(async () => {
    const shouldDestroy = await confirm(
      'Are you sure you want to destroy the infrastructure?',
      false
    )

    if (shouldDestroy) {
      await runCommand('terraform', [
        'destroy',
        '-auto-approve',
        `-var-file=${TERRAFORM_TFVARS_FILE}`,
      ])

      // After destroying infrastructure, also destroy the state bucket
      logWarning('Infrastructure destroyed. Now cleaning up state bucket...')

      try {
        // Read project ID from ${TERRAFORM_TFVARS_FILE}
        const tfvarsPath = getTfvarsPath()
        if (checkFileExists(tfvarsPath)) {
          const tfvarsContent = readFileSync(tfvarsPath)
          const projectIdMatch = tfvarsContent.match(
            /project_id\s*=\s*"([^"]+)"/
          )

          if (projectIdMatch) {
            const projectId = projectIdMatch[1]
            const bucketName = `terraform-state-${projectId}`

            logWarning(`Deleting state bucket: ${bucketName}`)

            // Delete all objects in the bucket first
            await runCommand('gsutil', [
              '-m',
              'rm',
              '-r',
              `gs://${bucketName}/*`,
            ])

            // Delete the bucket itself
            await runCommand('gsutil', ['rb', `gs://${bucketName}`])

            logSuccess(`State bucket ${bucketName} deleted successfully`)
          } else {
            logWarning(
              `Could not find project_id in ${TERRAFORM_TFVARS_FILE}, skipping bucket deletion`
            )
          }
        } else {
          logWarning(
            `${TERRAFORM_TFVARS_FILE} not found, skipping bucket deletion`
          )
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logWarning(`Failed to delete state bucket: ${errorMessage}`)
      }
    } else {
      logWarning('Destroy cancelled')
    }
  })
}

export function registerDestroyCommand(program: Command): void {
  program
    .command('destroy')
    .description('Destroy Terraform infrastructure')
    .argument('<environment>', 'Environment to destroy (dev, staging, prod)')
    .action(async (environment: string) => {
      try {
        await destroyAction(environment)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
