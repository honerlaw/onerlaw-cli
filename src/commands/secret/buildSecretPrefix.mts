import { SECRET_NAME_SEPARATOR } from './constants.mjs'
import { type LoadedConfig } from '@/config/index.mjs'

export function buildSecretPrefix(config: LoadedConfig): string {
  const { environment, environmentName } = config.selection
  return `${environment}${SECRET_NAME_SEPARATOR}${environmentName}${SECRET_NAME_SEPARATOR}`
}
