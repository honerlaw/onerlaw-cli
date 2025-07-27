import { logWarning, logSuccess, runCommand } from '../index.mjs'
import { getBucketName } from './getBucketName.mjs'

export async function deleteBucket(projectId: string): Promise<void> {
  const bucketName = getBucketName(projectId)

  logWarning(`Deleting state bucket: ${bucketName}`)

  try {
    // Delete all objects in the bucket first
    await runCommand('gsutil', ['-m', 'rm', '-r', `gs://${bucketName}/*`])

    // Delete the bucket itself
    await runCommand('gsutil', ['rb', `gs://${bucketName}`])

    logSuccess(`State bucket ${bucketName} deleted successfully`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to delete state bucket: ${errorMessage}`)
  }
}
