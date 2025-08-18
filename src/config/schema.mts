import { z } from 'zod'

export const EnvironmentConfigSchema = z
  .object({
    name: z.string().min(1, 'Environment name is required'),
    environment: z.enum(['dev', 'staging', 'prod']),
    database: z
      .object({
        name: z.string().min(1, 'Database name is required'),
        user: z.string().min(1, 'Database user is required'),
      })
      .strict()
      .nullable()
      .default(null),
    pubsub: z
      .object({
        topic: z.string().min(1, 'Pub/Sub topic is required'),
      })
      .strict()
      .nullable()
      .default(null),
    apps: z
      .array(
        z
          .object({
            name: z.string().min(1, 'App name is required'),
            port: z.number().int().positive().optional(),
            dns: z
              .object({
                domainName: z.string().min(1, 'Domain name is required'),
                subdomainNames: z
                  .array(z.string())
                  .min(1, 'At least one subdomain is required'),
              })
              .strict()
              .optional(),
          })
          .strict()
      )
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
