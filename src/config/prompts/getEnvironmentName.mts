import { input, confirm } from '@/utils/prompts.mjs'

export async function getEnvironmentName(
  existingEnvironmentName?: string | null
): Promise<string> {
  if (existingEnvironmentName) {
    const wantsToModify = await confirm(
      `Current environment name: ${existingEnvironmentName}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingEnvironmentName
    }
  }

  return await input('Enter environment name:')
}
