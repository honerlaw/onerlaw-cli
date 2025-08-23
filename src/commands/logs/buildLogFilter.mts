import {
  CLOUD_RUN_RESOURCE_TYPE,
  LOG_FILTER_STDOUT,
  LOG_FILTER_STDERR,
} from './constants.mjs'

export function buildLogFilter(serviceName: string): string {
  return `resource.type="${CLOUD_RUN_RESOURCE_TYPE}" AND resource.labels.service_name="${serviceName}" AND (logName:"${LOG_FILTER_STDOUT}" OR logName:"${LOG_FILTER_STDERR}")`
}
