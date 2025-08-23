export function buildServiceName(
  environment: string,
  environmentName: string,
  appName: string
): string {
  return `${environment}-${environmentName}-${appName}`
}
