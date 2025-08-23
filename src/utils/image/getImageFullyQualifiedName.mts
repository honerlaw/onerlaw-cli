import { getLatestImageTag } from './getLatestImageTag.mjs'
import { GCR_HOSTNAME } from '@/commands/build/constants.mjs'

const HELLO_WORLD_IMAGE = 'gcr.io/google-samples/hello-app:1.0'

export async function getImageFullyQualifiedName(
  appName: string,
  project: string,
  environment: string,
  environmentName: string
): Promise<string> {
  const registryName = `${environment}-${environmentName}`
  const hostname = GCR_HOSTNAME
  const imageName = appName

  // Get the latest numeric tag for the image
  const latestTag = await getLatestImageTag(
    project,
    registryName,
    imageName,
    hostname
  )

  if (latestTag) {
    const fullImageName = `${hostname}/${project}/${registryName}/${imageName}:${latestTag}`
    return fullImageName
  }

  // No image found, return hello world image
  return HELLO_WORLD_IMAGE
}
