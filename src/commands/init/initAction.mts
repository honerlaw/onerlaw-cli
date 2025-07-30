import { input, select } from '@/utils/prompts.mjs'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { writeFile, checkFileAccess } from '@/utils/files.mjs'
import { validateConfig, type ConfigItem } from '@/config/schema.mjs'
import { CONFIG_PATH } from '@/config/constants.mjs'
import { loadConfig } from '@/config/loader.mjs'

async function getDatabase(
  wantsDatabase: boolean
): Promise<{ name: string; user: string } | null> {
  if (!wantsDatabase) {
    return null
  }

  return {
    name: await input('Enter database name:'),
    user: await input('Enter database user:'),
  }
}

async function getConfigArray(
  configExists: boolean,
  configItem: ConfigItem
): Promise<ConfigItem[]> {
  if (!configExists) {
    return [configItem]
  }

  try {
    const existingConfig = await loadConfig(CONFIG_PATH)
    return [...existingConfig, configItem]
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to load existing config: ${errorMessage}`)
    return [configItem]
  }
}

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

    const database = await getDatabase(wantsDatabase)

    const configItem: ConfigItem = {
      project,
      environment,
      environmentName,
      database,
    }

    // Check if config file exists and load existing config
    const configExists = await checkFileAccess(CONFIG_PATH)
    const config = await getConfigArray(configExists, configItem)

    if (configExists) {
      logSuccess('Added new configuration to existing config file')
    } else {
      logSuccess('Created new config file with configuration')
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
