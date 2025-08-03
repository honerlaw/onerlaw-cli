import { input, confirm } from '@/utils/prompts.mjs'

export async function getProjectId(
  existingProjectId?: string | null
): Promise<string> {
  if (existingProjectId) {
    const wantsToModify = await confirm(
      `Current project ID: ${existingProjectId}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingProjectId
    }
  }

  return await input('Enter your Google Cloud Project ID:')
}
