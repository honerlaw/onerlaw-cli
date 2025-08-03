import { input, confirm } from '@/utils/prompts.mjs'

export async function getSubdomainNames(
  existingSubdomainNames?: string[] | null
): Promise<string[]> {
  if (existingSubdomainNames && existingSubdomainNames.length > 0) {
    const wantsToModify = await confirm(
      `Current subdomain names: ${existingSubdomainNames.join(', ')}. Do you want to modify them?`
    )

    if (!wantsToModify) {
      return existingSubdomainNames
    }
  }

  const subdomainInput = await input(
    'Enter subdomain names (comma-separated, optional, press Enter to skip):'
  )
  if (!subdomainInput.trim()) {
    return []
  }

  return subdomainInput
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0)
}
