import { checkImageExists } from '@/utils/checkImageExists.mjs'

const HELLO_WORLD_IMAGE = 'gcr.io/google-samples/hello-app:1.0'

export async function getImageFullyQualifiedName(
  project: string,
  environment: string,
  environmentName: string
): Promise<string> {
  const registryName = `${environment}-${environmentName}`
  const hostname = `us-central1-docker.pkg.dev`
  const imageName = 'app-server'
  const tag = 'latest'
  const fullImageName = `${hostname}/${project}/${registryName}/${imageName}:${tag}`

  const imageExists = await checkImageExists(fullImageName)

  if (imageExists) {
    return fullImageName
  }

  // Image doesn't exist, return hello world image
  return HELLO_WORLD_IMAGE
}
