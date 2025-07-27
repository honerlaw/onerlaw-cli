import { loadConfig } from './loader.mjs'
import { Config } from './schema.mjs'

type Options = {
  project?: string
  environment?: Config['environment']
  environmentName?: Config['environmentName']
  databaseName?: string
  databaseUser?: string
}

export async function resolveConfig(options: Options): Promise<Config> {
  const config = await loadConfig()

  const { databaseName, databaseUser, ...rest } = options

  return {
    ...config,
    ...rest,
    database:
      databaseName && databaseUser
        ? {
            name: databaseName,
            user: databaseUser,
          }
        : null,
  }
}
