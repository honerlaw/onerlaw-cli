import { z } from 'zod'

export const ConfigItemSchema = z.object({
  project: z.string().min(1, 'Project ID is required'),
  environment: z.enum(['dev', 'staging', 'prod']),
  environmentName: z.string().min(1, 'Environment name is required'),
  database: z
    .object({
      name: z.string(),
      user: z.string(),
    })
    .optional()
    .nullable()
    .default(null),
})

export const ConfigSchema = z.array(ConfigItemSchema)

export type ConfigItem = z.infer<typeof ConfigItemSchema>
export type Config = z.infer<typeof ConfigSchema>

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config)
}
