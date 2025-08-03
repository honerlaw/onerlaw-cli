import { input, confirm } from '@/utils/prompts.mjs'

export async function getDomainName(
  existingDomainName?: string | null
): Promise<string | null> {
  if (existingDomainName) {
    const wantsToModify = await confirm(
      `Current domain name: ${existingDomainName}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingDomainName
    }
  }

  const domainName = await input(
    'Enter domain name (optional, press Enter to skip):'
  )
  return domainName.trim() || null
}
