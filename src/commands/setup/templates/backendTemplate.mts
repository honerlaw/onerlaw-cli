import { getBucketName } from '../../../utils/bucket/getBucketName.mjs'

export function backendTemplate(
  project: string,
  environment: string,
  environmentName: string
): string {
  return `
bucket = "${getBucketName(project)}"
prefix = "terraform/state/${environment}/${environmentName}"
`
}
