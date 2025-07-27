export function getBucketName(projectId: string): string {
  return `${projectId}-terraform-state`
}
