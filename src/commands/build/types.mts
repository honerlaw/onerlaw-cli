export type BuildPublishOptions = {
  project: string
  environment: string
  environmentName: string
  imageName?: string
  tag?: string
  dockerfilePath?: string
  contextPath?: string
  noCache?: boolean
  prebuild?: string
}
