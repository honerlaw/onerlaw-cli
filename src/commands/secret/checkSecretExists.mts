import { runGcloudCommand } from '@/utils/index.mjs'

export async function checkSecretExists(
  fullSecretName: string
): Promise<boolean> {
  try {
    await runGcloudCommand(['secrets', 'describe', fullSecretName], {}, true)
    return true
  } catch {
    return false
  }
}
