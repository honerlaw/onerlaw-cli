import { select, confirm } from '@/utils/prompts.mjs'

export async function getEnvironment(
  existingEnvironment?: 'dev' | 'staging' | 'prod' | null
): Promise<'dev' | 'staging' | 'prod'> {
  if (existingEnvironment) {
    const wantsToModify = await confirm(
      `Current environment: ${existingEnvironment}. Do you want to modify it?`
    )

    if (!wantsToModify) {
      return existingEnvironment
    }
  }

  return (await select('Select environment:', [
    { name: 'Development', value: 'dev' },
    { name: 'Staging', value: 'staging' },
    { name: 'Production', value: 'prod' },
  ])) as 'dev' | 'staging' | 'prod'
}
