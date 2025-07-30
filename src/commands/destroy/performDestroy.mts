import {
  logWarning,
  withTerraformDirectory,
  confirm,
} from '../../utils/index.mjs'
import { runTerraformDestroy } from './runTerraformDestroy.mjs'
import { cleanupStateBucket } from './cleanupStateBucket.mjs'
import { LoadedConfig } from '@/config/index.mjs'

export async function performDestroy(config: LoadedConfig): Promise<void> {
  await withTerraformDirectory(async () => {
    const shouldDestroy = await confirm(
      'Are you sure you want to destroy the infrastructure?'
    )

    if (shouldDestroy) {
      await runTerraformDestroy()
      await cleanupStateBucket(config)
    } else {
      logWarning('Destroy cancelled')
    }
  })
}
