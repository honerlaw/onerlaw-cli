import { SECRET_NAME_SEPARATOR } from '@/commands/secret/constants.mjs'

export function buildFullSecretName(
  environment: string,
  environmentName: string,
  secretName: string
): string {
  return `${environment}${SECRET_NAME_SEPARATOR}${environmentName}${SECRET_NAME_SEPARATOR}${secretName}`
}
