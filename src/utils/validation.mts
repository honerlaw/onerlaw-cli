export function validateEnvironment(environment: string): void {
  const validEnvironments = ['dev', 'staging', 'prod'] as const
  if (
    !validEnvironments.includes(
      environment as (typeof validEnvironments)[number]
    )
  ) {
    throw new Error(
      `Environment must be one of: ${validEnvironments.join(', ')}`
    )
  }
}
