import { Option } from 'commander'

export const ENVIRONMENT_OPTION = new Option(
  '-e, --environment <env>',
  'environment (dev, staging, prod)'
).choices(['dev', 'staging', 'prod'])
