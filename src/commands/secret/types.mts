export type SecretOptions = {
  project: string
  environment: string
  environmentName: string
  // If provided, parse this file for key=value pairs and upsert each as a secret
  envFilePath?: string
  // For single secret upsert when not using envFilePath
  secretName?: string
  secretValue?: string
}
