import type { EnvironmentConfig } from '@/config/schema.mjs'
import { getImageFullyQualifiedName } from '@/commands/deploy/getImageFullyQualifiedName.mjs'
import { buildFullSecretName } from '@/commands/secret/buildFullSecretName.mjs'
import { checkSecretExists } from '@/commands/secret/checkSecretExists.mjs'
import { logWarning } from '@/utils/index.mjs'

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

      if (app.secrets && app.secrets.length > 0) {
        const includedSecrets: string[] = []

        for (const s of app.secrets) {
          const fullSecretName = buildFullSecretName(
            environment,
            environmentName,
            s.name
          )

          const exists = await checkSecretExists(fullSecretName)
          if (!exists) {
            logWarning(
              `Secret ${fullSecretName} does not exist. Skipping from tfvars.`
            )
            continue
          }

          includedSecrets.push(`{\n      name = "${s.name}"\n      secret_name = "${fullSecretName}"\n      version = "${s.version ?? 'latest'}"\n    }`)
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
