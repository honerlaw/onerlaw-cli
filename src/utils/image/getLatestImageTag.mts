import { runGcloudCommand } from '@/utils/commands.mjs'

export async function getLatestImageTag(
  project: string,
  registryName: string,
  imageName: string,
  hostname: string
): Promise<string | null> {
  try {
    const repositoryPath = `${hostname}/${project}/${registryName}/${imageName}`

    // List all tags for the image repository
    const result = await runGcloudCommand(
      [
        'artifacts',
        'docker',
        'tags',
        'list',
        repositoryPath,
        '--format=value(tag)',
      ],
      {},
      true
    )

    if (!result || typeof result !== 'string') {
      return null
    }

    const tags = result
      .trim()
      .split('\n')
      .filter((tag: string) => tag.length > 0)

    if (tags.length === 0) {
      return null
    }

    // Parse numeric tags and find the highest one
    const numericTags = tags
      .map((tag: string) => parseInt(tag, 10))
      .filter((num: number) => !isNaN(num) && num > 0)

    if (numericTags.length === 0) {
      return null
    }

    const highestTag = Math.max(...numericTags)
    return highestTag.toString()
  } catch {
    // If there's an error, return null
    return null
  }
}
