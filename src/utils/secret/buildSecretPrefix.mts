import { SECRET_NAME_SEPARATOR } from '@/commands/secret/constants.mjs'

export function buildSecretPrefix(
  environment: string,
  environmentName: string
): string {
  return `${environment}${SECRET_NAME_SEPARATOR}${environmentName}${SECRET_NAME_SEPARATOR}`
}
