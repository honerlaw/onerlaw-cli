export type DatabaseInfo = {
  name: string
  user: string
}

export function databaseTemplate(database: DatabaseInfo | null): string {
  if (database === null) {
    return ''
  }

  return `# Cloud SQL
database_name = "${database.name}"
database_user = "${database.user}"
`
}
