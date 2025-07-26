import {
  logSuccess,
  logWarning,
  logError,
  logInfo,
  runCommand,
} from '../../utils/index.mjs'
import { Command } from 'commander'

async function createBucketAction(projectId: string): Promise<void> {
  const bucketName = `terraform-state-${projectId}`

  logSuccess(`Creating Terraform state bucket: ${bucketName}`)

  try {
    // Set the project
    await runCommand('gcloud', ['config', 'set', 'project', projectId])

    // Check if bucket already exists
    try {
      await runCommand('gsutil', ['ls', `gs://${bucketName}`])
      logWarning(`Bucket ${bucketName} already exists`)
      return
    } catch {
      // Bucket doesn't exist, create it
    }

    // Create the bucket
    await runCommand('gsutil', [
      'mb',
      '-p',
      projectId,
      '-c',
      'STANDARD',
      '-l',
      'US',
      `gs://${bucketName}`,
    ])

    // Enable versioning
    await runCommand('gsutil', [
      'versioning',
      'set',
      'on',
      `gs://${bucketName}`,
    ])

    logSuccess(`Bucket ${bucketName} created successfully`)
    logWarning('Next steps:')
    logInfo('1. Run: tsx src/index.ts setup-backend <project-id>')
    logInfo('2. Run: tsx src/index.ts init')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to create bucket: ${errorMessage}`)
  }
}

export function registerCreateBucketCommand(program: Command): void {
  program
    .command('create-bucket')
    .description('Create Terraform state bucket')
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .action(async (options: { project: string }) => {
      try {
        await createBucketAction(options.project)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
