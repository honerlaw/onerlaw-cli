import { input, select } from '@/utils/prompts.mjs'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { writeFile } from '@/utils/files.mjs'
import { validateConfig, type Config } from '@/config/schema.mjs'
import { CONFIG_PATH } from '@/config/constants.mjs'

export async function initAction(): Promise<void> {
  try {
    const project = await input('Enter your Google Cloud Project ID:')
    const environment = (await select('Select environment:', [
      { name: 'Development', value: 'dev' },
      { name: 'Staging', value: 'staging' },
      { name: 'Production', value: 'prod' },
    ])) as 'dev' | 'staging' | 'prod'
    const environmentName = await input('Enter environment name:')

    const wantsDatabase = await select('Configure a database?', [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ])

    let database: { name: string; user: string } | null = null
    if (wantsDatabase) {
      const dbName = await input('Enter database name:')
      const dbUser = await input('Enter database user:')
      database = { name: dbName, user: dbUser }
    }

    const config: Config = {
      project,
      environment,
      environmentName,
      database,
    }

    // Validate config
    validateConfig(config)

    // Write config file
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
    logSuccess(`Config written to ${CONFIG_PATH}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to initialize config: ${errorMessage}`)
    process.exit(1)
  }
}
