import { logSuccess, logError } from '@/utils/logger.mjs'
import { writeFile, checkFileAccess } from '@/utils/files.mjs'
import { validateConfig } from '@/config/schema.mjs'
import { CONFIG_PATH } from '@/config/constants.mjs'
import { loadConfig } from '@/config/loader.mjs'
import { removeConfiguration } from './removeConfiguration.mjs'

export async function removeConfigAction(): Promise<void> {
  try {
    // Check if config file exists
    const configExists = await checkFileAccess(CONFIG_PATH)

    if (!configExists) {
      logError(
        'No configuration file found. Use "config new" to create a new configuration.'
      )
      process.exit(1)
    }

    // Load existing config
    const existingConfig = await loadConfig(CONFIG_PATH)

    if (existingConfig.length === 0) {
      logError(
        'No configurations found in the config file. Use "config new" to create a new configuration.'
      )
      process.exit(1)
    }

    // Remove configuration
    const config = await removeConfiguration(existingConfig)

    // Validate config
    validateConfig(config)

    // Write config file
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
    logSuccess(`Config updated in ${CONFIG_PATH}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to remove config: ${errorMessage}`)
    process.exit(1)
  }
}
