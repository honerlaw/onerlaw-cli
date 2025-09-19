import {
  logSuccess,
  logWarning,
  runCommand,
  runGcloudCommand,
} from '../index.mjs'
import { getBucketName } from './getBucketName.mjs'
import { bucketExists } from './bucketExists.mjs'

export async function createBucket(projectId: string): Promise<void> {
  const bucketName = getBucketName(projectId)

  logSuccess(`Creating Terraform state bucket: ${bucketName}`)

  try {
    // Set the project
    await runGcloudCommand(['config', 'set', 'project', projectId])

    // Check if bucket already exists
    const exists = await bucketExists(bucketName)
    if (exists) {
      logWarning(`Bucket ${bucketName} already exists`)
      return
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to create bucket: ${errorMessage}`)
  }
}
