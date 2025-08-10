import { CONFIG_PATH } from './constants.mjs'
import { select } from '../utils/prompts.mjs'
import { loadConfig } from './loader.mjs'
import { Config } from './schema.mjs'

// Helper type for flattened environment configuration that commands expect
export type LoadedConfig = {
  selection: {
    project: string
    environment: 'dev' | 'staging' | 'prod'
    environmentName: string
    database: {
      name: string
      user: string
    } | null
    dns: {
      domainName: string
      subdomainNames: string[]
    } | null
    pubsub: {
      topic: string
    } | null
  }
  configs: Config
}

export async function loadConfigFromPrompt(
  configPath: string = CONFIG_PATH
): Promise<LoadedConfig> {
  const projects = await loadConfig(configPath)

  if (projects.length === 0) {
    throw new Error('No projects found in config file')
  }

  // If only one project, return it directly
  if (projects.length === 1) {
    const project = projects[0]
    const environment = project.environment
    return {
      selection: {
        project: project.project,
        environment: environment.environment,
        environmentName: environment.name,
        database: environment.database,
        dns: environment.dns,
        pubsub: environment.pubsub,
      },
      configs: projects,
    }
  }

  // Create choices for all project configurations
  const choices: Array<{
    name: string
    value: LoadedConfig
    description: string
  }> = []

  for (const project of projects) {
    const environment = project.environment
    choices.push({
      name: `${project.project} - ${environment.name} (${environment.environment})`,
      value: {
        selection: {
          project: project.project,
          environment: environment.environment,
          environmentName: environment.name,
          database: environment.database,
          dns: environment.dns,
          pubsub: environment.pubsub,
        },
        configs: projects,
      },
      description: `Project: ${project.project}, Environment: ${environment.name}`,
    })
  }

  return await select('Please select a configuration:', choices, -1)
}
