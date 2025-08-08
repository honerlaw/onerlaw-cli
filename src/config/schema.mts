import { z } from 'zod'

export const EnvironmentConfigSchema = z
  .object({
    name: z.string().min(1, 'Environment name is required'),
    environment: z.enum(['dev', 'staging', 'prod']),
    database: z
      .object({
        name: z.string(),
        user: z.string(),
      })
      .strict()
      .optional()
      .nullable()
      .default(null),
    dns: z
      .object({
        domainName: z.string(),
        subdomainNames: z.array(z.string()),
      })
      .strict()
      .optional()
      .nullable()
      .default(null),
  })
  .strict()

export const ProjectConfigSchema = z
  .object({
    project: z.string().min(1, 'Project ID is required'),
    environment: EnvironmentConfigSchema,
  })
  .strict()

export const ConfigSchema = z.array(ProjectConfigSchema)

export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>
export type Config = z.infer<typeof ConfigSchema>

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config)
}
