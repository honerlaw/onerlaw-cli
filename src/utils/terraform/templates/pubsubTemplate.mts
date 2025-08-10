import type { EnvironmentConfig } from '@/config/schema.mjs'

export function pubsubTemplate(pubsub: EnvironmentConfig['pubsub']): string {
  if (!pubsub) {
    return `
# Pub/Sub
# No pubsub configuration`
  }

  return `
# Pub/Sub
pubsub_topic_name = "${pubsub.topic}"`
}
