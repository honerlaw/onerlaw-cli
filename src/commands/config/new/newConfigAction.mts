import { logSuccess, logError } from '@/utils/logger.mjs'
import { writeFile, checkFileAccess } from '@/utils/files.mjs'
import { validateConfig } from '@/config/schema.mjs'
import { CONFIG_PATH } from '@/config/constants.mjs'
import { loadConfig } from '@/config/loader.mjs'
import { addNewConfiguration } from './addNewConfiguration.mjs'
import { createNewConfig } from './createNewConfig.mjs'

export async function newConfigAction(): Promise<void> {
  try {
    // Check if config file exists
    const configExists = await checkFileAccess(CONFIG_PATH)
    let config

    if (configExists) {
      try {
        const existingConfig = await loadConfig(CONFIG_PATH)
        config = await addNewConfiguration(existingConfig)
        logSuccess('Added new configuration to existing config file')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Failed to load existing config: ${errorMessage}`)
        process.exit(1)
      }
    } else {
      config = await createNewConfig()
      logSuccess('Created new config file with configuration')
    }

    // Validate config
    validateConfig(config)

    // Write config file
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
    logSuccess(`Config written to ${CONFIG_PATH}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to create new config: ${errorMessage}`)
    process.exit(1)
  }
}
