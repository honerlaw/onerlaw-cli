import { input, select } from '@/utils/prompts.mjs'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { writeFile, checkFileAccess } from '@/utils/files.mjs'
import {
  validateConfig,
  type ProjectConfig,
  type EnvironmentConfig,
} from '@/config/schema.mjs'
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

async function getUpdatedConfig(
  configExists: boolean,
  projectId: string,
  environmentConfig: EnvironmentConfig
): Promise<ProjectConfig[]> {
  if (!configExists) {
    return [
      {
        project: projectId,
        environments: [environmentConfig],
      },
    ]
  }

  try {
    const existingConfig = await loadConfig(CONFIG_PATH)

    // Check if project already exists
    const existingProjectIndex = existingConfig.findIndex(
      p => p.project === projectId
    )

    if (existingProjectIndex >= 0) {
      // Add environment to existing project
      const updatedConfig = [...existingConfig]
      updatedConfig[existingProjectIndex].environments.push(environmentConfig)
      return updatedConfig
    } else {
      // Add new project
      return [
        ...existingConfig,
        {
          project: projectId,
          environments: [environmentConfig],
        },
      ]
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to load existing config: ${errorMessage}`)
    return [
      {
        project: projectId,
        environments: [environmentConfig],
      },
    ]
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

    const environmentConfig: EnvironmentConfig = {
      name: environmentName,
      environment,
      database,
    }

    // Check if config file exists and load existing config
    const configExists = await checkFileAccess(CONFIG_PATH)
    const config = await getUpdatedConfig(
      configExists,
      project,
      environmentConfig
    )

    if (configExists) {
      logSuccess('Added new environment configuration to existing config file')
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
