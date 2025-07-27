export async function getImageFullyQualifiedName(
  project: string,
  environment: string,
  environmentName: string
): Promise<string> {
  const registryName = `${environment}-${environmentName}`
  const hostname = `us-central1-docker.pkg.dev`
  const imageName = 'app-server'
  const tag = 'latest'

  return `${hostname}/${project}/${registryName}/${imageName}:${tag}`
}
