import { select } from '@/utils/prompts.mjs'
import { logSuccess } from '@/utils/logger.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'

export async function selectApp(
  apps: NonNullable<EnvironmentConfig['apps']>
): Promise<NonNullable<EnvironmentConfig['apps']>[0]> {
  // If only one app, use it directly; otherwise prompt for selection
  if (apps.length === 1) {
    const selectedApp = apps[0]
    logSuccess(`Using application: ${selectedApp.name}`)
    return selectedApp
  }

  const appChoices = apps.map((app: NonNullable<typeof apps>[0]) => ({
    name: `${app.name}${app.port ? ` (port: ${app.port})` : ''}`,
    value: app,
  }))

  return await select('Select application to view logs:', appChoices)
}
