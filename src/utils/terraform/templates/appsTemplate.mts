import type { EnvironmentConfig } from '@/config/schema.mjs'
import { getImageFullyQualifiedName } from '@/utils/image/getImageFullyQualifiedName.mjs'
import { checkSecretExists } from '@/commands/secret/checkSecretExists.mjs'
import { logSuccess, logWarning } from '@/utils/index.mjs'
import { listPrefixedSecrets } from '@/utils/secret/listPrefixedSecrets.mjs'
import { buildSecretPrefix } from '@/utils/secret/buildSecretPrefix.mjs'

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

      logSuccess(`Container image: ${containerImage}`)

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

      const prefix = buildSecretPrefix(environment, environmentName)
      const fullSecretNames = await listPrefixedSecrets(prefix, project)

      logSuccess(`Fetched secret names... ${fullSecretNames.length}`)

      if (fullSecretNames.length > 0) {
        const includedSecrets: string[] = []
        for (const fullName of fullSecretNames) {
          const exists = await checkSecretExists(fullName)
          if (!exists) {
            logWarning(
              `Secret ${fullName} does not exist. Skipping from tfvars.`
            )
            continue
          }

          const shortName = fullName.substring(prefix.length)
          includedSecrets.push(
            `{\n      name = "${shortName}"\n      secret_name = "${fullName}"\n      version = "latest"\n    }`
          )
        }

        if (includedSecrets.length > 0) {
          parts.push(`    secrets = [\n${includedSecrets.join(',\n')}\n    ]`)
        }
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
