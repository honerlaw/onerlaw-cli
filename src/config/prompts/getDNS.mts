import { select, input, confirm } from '@/utils/prompts.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'

export async function getDNS(
  existingDNS?: EnvironmentConfig['dns']
): Promise<EnvironmentConfig['dns']> {
  if (existingDNS) {
    const wantsToModify = await confirm(
      `Current DNS config: domain: ${existingDNS.domainName}, subdomains: ${existingDNS.subdomainNames.join(', ')}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingDNS
    }
  }

  const wantsDNS = await select('Configure DNS?', [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ])

  if (!wantsDNS) {
    return null
  }

  const domainName = await input('Enter domain name (e.g. example.com):')
  const subdomainInput = await input(
    'Enter subdomain names (e.g. www, api, etc.) (comma-separated, optional, press Enter to skip):'
  )

  const subdomainNames = subdomainInput
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0)

  return {
    domainName,
    subdomainNames,
  }
}
