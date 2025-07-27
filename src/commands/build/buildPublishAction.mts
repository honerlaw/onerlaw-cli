import { logError, logSuccess } from '../../utils/index.mjs'
import {
  DEFAULT_IMAGE_NAME,
  DEFAULT_TAG,
  DEFAULT_DOCKERFILE_PATH,
  DEFAULT_CONTEXT_PATH,
  GCR_HOSTNAME,
} from './constants.mjs'
import { BuildPublishOptions } from './types.mjs'
import { getNpmToken } from './getNpmToken.mjs'
import { configureDockerAuth } from './configureDockerAuth.mjs'
import { buildDockerImage } from './buildDockerImage.mjs'
import { pushDockerImage } from './pushDockerImage.mjs'

export async function buildPublishAction(
  options: BuildPublishOptions
): Promise<void> {
  const {
    project,
    environment,
    environmentName,
    imageName = DEFAULT_IMAGE_NAME,
    tag = DEFAULT_TAG,
    dockerfilePath = DEFAULT_DOCKERFILE_PATH,
    contextPath = DEFAULT_CONTEXT_PATH,
    noCache = false,
  } = options

  try {
    logSuccess(
      `Building and publishing Docker image for ${environment} environment...`
    )

    const registryName = `${environment}-${environmentName}`
    const fullImageName = `${GCR_HOSTNAME}/${project}/${registryName}/${imageName}:${tag}`

    logSuccess(`Full image name: ${fullImageName}`)

    await configureDockerAuth(registryName)

    const npmToken = await getNpmToken()

    await buildDockerImage(
      fullImageName,
      dockerfilePath,
      contextPath,
      noCache,
      npmToken
    )

    await pushDockerImage(fullImageName)

    logSuccess(`Successfully built and published: ${fullImageName}`)
    logSuccess(`Image is now available at: ${fullImageName}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Error building and publishing Docker image: ${errorMessage}`)
    throw error
  }
}
