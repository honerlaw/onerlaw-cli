import { runCommand } from '@/utils/index.mjs'

export async function checkSecretExists(
  fullSecretName: string
): Promise<boolean> {
  try {
    await runCommand(
      'gcloud',
      ['secrets', 'describe', fullSecretName],
      {},
      true
    )
    return true
  } catch {
    return false
  }
}
