import { runCommand } from '../index.mjs'

export async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    await runCommand('gsutil', ['ls', `gs://${bucketName}`])
    return true
  } catch {
    return false
  }
}
