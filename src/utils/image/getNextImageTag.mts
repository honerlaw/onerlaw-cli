import { runGcloudCommand } from '@/utils/commands.mjs'
import { logSuccess } from '@/utils/index.mjs'

export async function getNextImageTag(
  project: string,
  registryName: string,
  imageName: string,
  hostname: string
): Promise<string> {
  try {
    const repositoryPath = `${hostname}/${project}/${registryName}/${imageName}`

    logSuccess(`Checking for existing tags in repository: ${repositoryPath}`)

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
      logSuccess('No existing tags found, starting with tag: 1')
      return '1'
    }

    const tags = result
      .trim()
      .split('\n')
      .filter((tag: string) => tag.length > 0)

    if (tags.length === 0) {
      logSuccess('No existing tags found, starting with tag: 1')
      return '1'
    }

    // Parse numeric tags and find the highest one
    const numericTags = tags
      .map((tag: string) => parseInt(tag, 10))
      .filter((num: number) => !isNaN(num) && num > 0)

    if (numericTags.length === 0) {
      logSuccess('No numeric tags found, starting with tag: 1')
      return '1'
    }

    const highestTag = Math.max(...numericTags)
    const nextTag = (highestTag + 1).toString()

    logSuccess(`Found highest tag: ${highestTag}, using next tag: ${nextTag}`)
    return nextTag
  } catch {
    // If there's an error (e.g., repository doesn't exist), default to tag 1
    logSuccess('Repository not found or error occurred, starting with tag: 1')
    return '1'
  }
}
