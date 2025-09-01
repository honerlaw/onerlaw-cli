import { select, input, confirm } from '@/utils/prompts.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'

export async function getApps(
  existingApps?: EnvironmentConfig['apps']
): Promise<EnvironmentConfig['apps']> {
  if (existingApps && existingApps.length > 0) {
    const appList = existingApps
      .map(
        app =>
          `${app.name}${app.port ? ` (port: ${app.port})` : ''}${app.prebuild ? ` [prebuild: ${app.prebuild}]` : ''}${app.dns ? ` [DNS: ${app.dns.subdomainNames.join(', ')}.${app.dns.domainName}]` : ''}`
      )
      .join(', ')
    const wantsToModify = await confirm(
      `Current apps: ${appList}. Do you want to modify them?`
    )

    if (!wantsToModify) {
      return existingApps
    }
  }

  const wantsApps = await select('Configure apps?', [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ])

  if (!wantsApps) {
    return null
  }

  const apps: NonNullable<EnvironmentConfig['apps']> = []
  let addMore = true

  while (addMore) {
    const appName = await input('Enter app name:')

    const wantsPort = await select(
      'Do you want to specify a port for this app?',
      [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ]
    )

    let port: number | undefined
    if (wantsPort) {
      const portInput = await input('Enter port number:')
      port = parseInt(portInput, 10)

      if (isNaN(port) || port <= 0) {
        throw new Error('Port must be a positive integer')
      }
    }

    const wantsDns = await select(
      'Do you want to configure DNS for this app?',
      [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ]
    )

    let dns: { domainName: string; subdomainNames: string[] } | undefined
    if (wantsDns) {
      const domainName = await input('Enter domain name (e.g. example.com):')
      const subdomainInput = await input(
        'Enter subdomain names (comma-separated):'
      )
      const subdomainNames = subdomainInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      if (subdomainNames.length === 0) {
        throw new Error('At least one subdomain is required')
      }

      dns = { domainName, subdomainNames }
    }

    // Prebuild command prompt
    const wantsPrebuild = await select(
      'Do you want to specify a prebuild command for this app?',
      [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ]
    )

    let prebuild: string | undefined
    if (wantsPrebuild) {
      prebuild = await input('Enter prebuild command (e.g. npm run build):')
      if (prebuild && prebuild.trim().length === 0) {
        prebuild = undefined
      }
    }

    // Secrets prompt per app
    const wantsSecrets = await select(
      'Add Secret Manager env vars for this app?',
      [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ]
    )

    let secrets: { name: string; version: string }[] | undefined
    if (wantsSecrets) {
      secrets = []
      let addMoreSecrets = true
      while (addMoreSecrets) {
        const envName = await input('Enter env var name (e.g. API_KEY):')
        const versionInput = await input(
          'Enter secret version (default: latest):'
        )
        const version =
          versionInput && versionInput.trim().length > 0
            ? versionInput.trim()
            : undefined
        secrets.push({ name: envName, version: version ?? 'latest' })
        addMoreSecrets = await select('Add another secret?', [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ])
      }
    }

    apps.push({
      name: appName,
      ...(port && { port }),
      ...(prebuild && { prebuild }),
      ...(dns && { dns }),
      ...(secrets && { secrets }),
    })

    addMore = await select('Add another app?', [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ])
  }

  return apps
}
