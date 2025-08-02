import { runCommand } from '@/utils/commands.mjs'

export async function checkImageExists(imageName: string): Promise<boolean> {
  try {
    await runCommand(
      'gcloud',
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
