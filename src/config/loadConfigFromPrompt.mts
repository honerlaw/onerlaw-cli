import { type ConfigItem } from './schema.mjs'
import { CONFIG_PATH } from './constants.mjs'
import { select } from '../utils/prompts.mjs'
import { loadConfig } from './loader.mjs'

export async function loadConfigFromPrompt(
  configPath: string = CONFIG_PATH
): Promise<ConfigItem> {
  const configs = await loadConfig(configPath)

  if (configs.length === 0) {
    throw new Error('No configuration items found in config file')
  }

  if (configs.length === 1) {
    return configs[0]
  }

  const choices = configs.map(config => ({
    name: `${config.environment} - ${config.environmentName}`,
    value: config,
    description: `Project: ${config.project}`,
  }))

  return await select('Please select a configuration:', choices, -1)
}
