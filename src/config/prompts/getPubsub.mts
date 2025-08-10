import { select, input, confirm } from '@/utils/prompts.mjs'
import type { EnvironmentConfig } from '@/config/schema.mjs'

export async function getPubsub(
  existingPubsub?: EnvironmentConfig['pubsub']
): Promise<EnvironmentConfig['pubsub']> {
  if (existingPubsub) {
    const wantsToModify = await confirm(
      `Current pubsub config: topic: ${existingPubsub.topic}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingPubsub
    }
  }

  const wantsPubsub = await select('Configure Pub/Sub?', [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ])

  if (!wantsPubsub) {
    return null
  }

  const topicName = await input('Enter topic name:')

  return {
    topic: topicName,
  }
}
