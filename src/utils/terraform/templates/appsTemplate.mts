import type { EnvironmentConfig } from '@/config/schema.mjs'
import { getImageFullyQualifiedName } from '@/commands/deploy/getImageFullyQualifiedName.mjs'

export async function appsTemplate(
  apps: EnvironmentConfig['apps'],
  project: string,
  environment: string,
  environmentName: string
): Promise<string> {
  if (!apps || apps.length === 0) {
    return '# Apps: No apps configured'
  }

  const appBlocks = await Promise.all(
    apps.map(async app => {
      const containerImage = await getImageFullyQualifiedName(
        app.name,
        project,
        environment,
        environmentName
      )

      const parts = [
        `  {`,
        `    name = "${app.name}"`,
        `    container_image = "${containerImage}"`,
      ]

      if (app.port) {
        parts.push(`    port = ${app.port}`)
      }

      if (app.dns) {
        parts.push(
          `    dns = {`,
          `      domainName = "${app.dns.domainName}"`,
          `      subdomainNames = [${app.dns.subdomainNames.map(name => `"${name}"`).join(', ')}]`,
          `    }`
        )
      }

      parts.push(`  }`)
      return parts.join('\n')
    })
  )

  const appsConfig = appBlocks.join(',\n')

  return `# Apps
apps = [
${appsConfig}
]`
}
