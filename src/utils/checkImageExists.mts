import { runGcloudCommand } from '@/utils/commands.mjs'

export async function checkImageExists(imageName: string): Promise<boolean> {
  try {
    await runGcloudCommand(
      [
        'artifacts',
        'docker',
        'images',
        'describe',
        imageName,
        '--format=value(name)',
      ],
      {},
      true
    )
    return true
  } catch {
    return false
  }
}
