import { select, input, confirm } from '@/utils/prompts.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'

export async function getDatabase(
  existingDatabase?: EnvironmentConfig['database']
): Promise<EnvironmentConfig['database']> {
  if (existingDatabase) {
    const wantsToModify = await confirm(
      `Current database config: ${existingDatabase.name} (user: ${existingDatabase.user}). Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingDatabase
    }
  }

  const wantsDatabase = await select('Configure a database?', [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ])

  if (!wantsDatabase) {
    return null
  }

  const databaseName = await input('Enter database name:')
  const databaseUser = await input('Enter database user:')

  return {
    name: databaseName,
    user: databaseUser,
  }
}
