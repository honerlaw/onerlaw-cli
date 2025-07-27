import { readFile } from '../utils/files.mjs'
import { validateConfig, type Config } from './schema.mjs'
import { CONFIG_PATH } from './constants.mjs'

export async function loadConfig(
  configPath: string = CONFIG_PATH
): Promise<Config> {
  try {
    const configContent = await readFile(configPath)
    const configData = JSON.parse(configContent)

    return validateConfig(configData)
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in configuration file: ${error.message}`)
    }

    if (error instanceof Error) {
      throw new Error(`Failed to load configuration: ${error.message}`)
    }

    throw new Error('Failed to load configuration: Unknown error')
  }
}
