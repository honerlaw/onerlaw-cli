import { type EnvironmentConfig } from '@/config/schema.mjs'

export function databaseTemplate(
  database: EnvironmentConfig['database']
): string {
  if (database === null) {
    return ''
  }

  return `# Cloud SQL
database_name = "${database.name}"
database_user = "${database.user}"
`
}
